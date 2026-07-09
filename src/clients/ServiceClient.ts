/**
 * Service Client
 * Base class for inter-service HTTP communication with built-in resilience patterns
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ServiceRequestOptions } from '../types';
import {
  ExternalAPIError,
  GatewayTimeoutError,
  ServiceUnavailableError,
  CircuitBreakerOpenError,
} from '../utils/errors';
import { logger } from '../utils/logger';
import { retry, sleep } from '../utils/helpers';

/**
 * Circuit Breaker State
 */
enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

/**
 * Circuit Breaker Configuration
 */
interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
}

/**
 * Circuit Breaker Implementation
 */
class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private nextAttempt = Date.now();

  constructor(private config: CircuitBreakerConfig) {}

  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        throw new CircuitBreakerOpenError('ServiceClient');
      }
      this.state = CircuitState.HALF_OPEN;
      this.successCount = 0;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.state = CircuitState.CLOSED;
        this.successCount = 0;
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.nextAttempt = Date.now() + this.config.timeout;
      logger.warn('Circuit breaker opened', {
        failureCount: this.failureCount,
        nextAttempt: new Date(this.nextAttempt).toISOString(),
      });
    }
  }

  public getState(): CircuitState {
    return this.state;
  }

  public reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();
  }
}

/**
 * Simple in-memory cache
 */
class RequestCache {
  private cache = new Map<string, { data: any; expiresAt: number }>();

  public get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  public set(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
    });
  }

  public clear(): void {
    this.cache.clear();
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }
}

/**
 * Service Client Configuration
 */
export interface ServiceClientConfig {
  baseURL: string;
  serviceName: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  circuitBreaker?: Partial<CircuitBreakerConfig>;
  headers?: Record<string, string>;
}

/**
 * Service Client Class
 */
export class ServiceClient {
  private axiosInstance: AxiosInstance;
  private circuitBreaker: CircuitBreaker;
  private cache: RequestCache;
  private serviceName: string;

  constructor(config: ServiceClientConfig) {
    this.serviceName = config.serviceName;

    // Initialize axios instance
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `IconRadar-ServiceClient/${this.serviceName}`,
        ...config.headers,
      },
    });

    // Initialize circuit breaker
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: config.circuitBreaker?.failureThreshold || 5,
      successThreshold: config.circuitBreaker?.successThreshold || 2,
      timeout: config.circuitBreaker?.timeout || 60000,
    });

    // Initialize cache
    this.cache = new RequestCache();

    // Add request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add service API key if available
        if (process.env.SERVICE_API_KEY) {
          config.headers['X-Service-API-Key'] = process.env.SERVICE_API_KEY;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.error || error.message;

        // Map status codes to appropriate errors
        if (status === 503) {
          throw new ServiceUnavailableError(message, error.config?.headers?.['x-correlation-id']);
        } else if (status === 504 || error.code === 'ECONNABORTED') {
          throw new GatewayTimeoutError(message, error.config?.headers?.['x-correlation-id']);
        } else if (error.code === 'ECONNREFUSED') {
          throw new ServiceUnavailableError(
            `${this.serviceName} is unavailable`,
            error.config?.headers?.['x-correlation-id']
          );
        }

        throw new ExternalAPIError(
          this.serviceName,
          message,
          error.config?.url,
          error,
          error.config?.headers?.['x-correlation-id']
        );
      }
    );
  }

  /**
   * GET request with caching and retry
   */
  public async get<T = any>(path: string, options: ServiceRequestOptions = {}): Promise<T> {
    const cacheKey = `GET:${path}:${JSON.stringify(options)}`;

    // Check cache
    if (options.cache) {
      const cached = this.cache.get<T>(cacheKey);
      if (cached) {
        logger.debug(`Cache hit for ${this.serviceName}`, { path, cacheKey });
        return cached;
      }
    }

    // Execute request
    const result = await this.executeRequest<T>(
      async () => {
        const response = await this.axiosInstance.get<T>(path, this.buildConfig(options));
        return response.data;
      },
      options,
      'GET',
      path
    );

    // Cache result
    if (options.cache && result) {
      this.cache.set(cacheKey, result, options.cacheTTL || 300000); // Default 5 minutes
    }

    return result;
  }

  /**
   * POST request with retry
   */
  public async post<T = any>(path: string, data?: any, options: ServiceRequestOptions = {}): Promise<T> {
    return this.executeRequest<T>(
      async () => {
        const response = await this.axiosInstance.post<T>(path, data, this.buildConfig(options));
        return response.data;
      },
      options,
      'POST',
      path
    );
  }

  /**
   * PUT request with retry
   */
  public async put<T = any>(path: string, data?: any, options: ServiceRequestOptions = {}): Promise<T> {
    return this.executeRequest<T>(
      async () => {
        const response = await this.axiosInstance.put<T>(path, data, this.buildConfig(options));
        return response.data;
      },
      options,
      'PUT',
      path
    );
  }

  /**
   * PATCH request with retry
   */
  public async patch<T = any>(path: string, data?: any, options: ServiceRequestOptions = {}): Promise<T> {
    return this.executeRequest<T>(
      async () => {
        const response = await this.axiosInstance.patch<T>(path, data, this.buildConfig(options));
        return response.data;
      },
      options,
      'PATCH',
      path
    );
  }

  /**
   * DELETE request with retry
   */
  public async delete<T = any>(path: string, options: ServiceRequestOptions = {}): Promise<T> {
    return this.executeRequest<T>(
      async () => {
        const response = await this.axiosInstance.delete<T>(path, this.buildConfig(options));
        return response.data;
      },
      options,
      'DELETE',
      path
    );
  }

  /**
   * Execute request with circuit breaker and retry logic
   */
  private async executeRequest<T>(
    fn: () => Promise<T>,
    options: ServiceRequestOptions,
    method: string,
    path: string
  ): Promise<T> {
    const startTime = Date.now();

    try {
      // Log request
      logger.debug(`${method} ${this.serviceName}${path}`, {
        correlationId: options.correlationId,
        service: this.serviceName,
      });

      // Execute with circuit breaker
      const result = await this.circuitBreaker.execute(async () => {
        // Execute with retry if enabled
        if (options.retry !== false) {
          return await retry(fn, {
            maxAttempts: options.retryCount || 3,
            initialDelay: 1000,
            maxDelay: 5000,
            factor: 2,
            onRetry: (attempt, error) => {
              logger.warn(`Retry attempt ${attempt} for ${this.serviceName}`, {
                correlationId: options.correlationId,
                service: this.serviceName,
                method,
                path,
                error: error.message,
              });
            },
          });
        }

        return await fn();
      });

      // Log success
      const duration = Date.now() - startTime;
      logger.logExternalCall(this.serviceName, `${method} ${path}`, duration, true, {
        correlationId: options.correlationId,
      });

      return result;
    } catch (error) {
      // Log failure
      const duration = Date.now() - startTime;
      logger.logExternalCall(this.serviceName, `${method} ${path}`, duration, false, {
        correlationId: options.correlationId,
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }

  /**
   * Build axios config from options
   */
  private buildConfig(options: ServiceRequestOptions): AxiosRequestConfig {
    return {
      timeout: options.timeout,
      headers: {
        ...(options.correlationId && { 'X-Correlation-ID': options.correlationId }),
        ...(options.token && { Authorization: `Bearer ${options.token}` }),
        ...options.headers,
      },
    };
  }

  /**
   * Get circuit breaker state
   */
  public getCircuitBreakerState(): CircuitState {
    return this.circuitBreaker.getState();
  }

  /**
   * Reset circuit breaker
   */
  public resetCircuitBreaker(): void {
    this.circuitBreaker.reset();
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get service name
   */
  public getServiceName(): string {
    return this.serviceName;
  }
}

/**
 * Create service client instance
 */
export function createServiceClient(config: ServiceClientConfig): ServiceClient {
  return new ServiceClient(config);
}

export default ServiceClient;

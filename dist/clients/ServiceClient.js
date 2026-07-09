"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceClient = void 0;
exports.createServiceClient = createServiceClient;
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const helpers_1 = require("../utils/helpers");
var CircuitState;
(function (CircuitState) {
    CircuitState["CLOSED"] = "CLOSED";
    CircuitState["OPEN"] = "OPEN";
    CircuitState["HALF_OPEN"] = "HALF_OPEN";
})(CircuitState || (CircuitState = {}));
class CircuitBreaker {
    config;
    state = CircuitState.CLOSED;
    failureCount = 0;
    successCount = 0;
    nextAttempt = Date.now();
    constructor(config) {
        this.config = config;
    }
    async execute(fn) {
        if (this.state === CircuitState.OPEN) {
            if (Date.now() < this.nextAttempt) {
                throw new errors_1.CircuitBreakerOpenError('ServiceClient');
            }
            this.state = CircuitState.HALF_OPEN;
            this.successCount = 0;
        }
        try {
            const result = await fn();
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure();
            throw error;
        }
    }
    onSuccess() {
        this.failureCount = 0;
        if (this.state === CircuitState.HALF_OPEN) {
            this.successCount++;
            if (this.successCount >= this.config.successThreshold) {
                this.state = CircuitState.CLOSED;
                this.successCount = 0;
            }
        }
    }
    onFailure() {
        this.failureCount++;
        if (this.failureCount >= this.config.failureThreshold) {
            this.state = CircuitState.OPEN;
            this.nextAttempt = Date.now() + this.config.timeout;
            logger_1.logger.warn('Circuit breaker opened', {
                failureCount: this.failureCount,
                nextAttempt: new Date(this.nextAttempt).toISOString(),
            });
        }
    }
    getState() {
        return this.state;
    }
    reset() {
        this.state = CircuitState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.nextAttempt = Date.now();
    }
}
class RequestCache {
    cache = new Map();
    get(key) {
        const cached = this.cache.get(key);
        if (!cached)
            return null;
        if (Date.now() > cached.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return cached.data;
    }
    set(key, data, ttl) {
        this.cache.set(key, {
            data,
            expiresAt: Date.now() + ttl,
        });
    }
    clear() {
        this.cache.clear();
    }
    delete(key) {
        this.cache.delete(key);
    }
}
class ServiceClient {
    axiosInstance;
    circuitBreaker;
    cache;
    serviceName;
    constructor(config) {
        this.serviceName = config.serviceName;
        this.axiosInstance = axios_1.default.create({
            baseURL: config.baseURL,
            timeout: config.timeout || 10000,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': `IconRadar-ServiceClient/${this.serviceName}`,
                ...config.headers,
            },
        });
        this.circuitBreaker = new CircuitBreaker({
            failureThreshold: config.circuitBreaker?.failureThreshold || 5,
            successThreshold: config.circuitBreaker?.successThreshold || 2,
            timeout: config.circuitBreaker?.timeout || 60000,
        });
        this.cache = new RequestCache();
        this.axiosInstance.interceptors.request.use((config) => {
            if (process.env.SERVICE_API_KEY) {
                config.headers['X-Service-API-Key'] = process.env.SERVICE_API_KEY;
            }
            return config;
        }, (error) => Promise.reject(error));
        this.axiosInstance.interceptors.response.use((response) => response, (error) => {
            const status = error.response?.status;
            const message = error.response?.data?.error || error.message;
            if (status === 503) {
                throw new errors_1.ServiceUnavailableError(message, error.config?.headers?.['x-correlation-id']);
            }
            else if (status === 504 || error.code === 'ECONNABORTED') {
                throw new errors_1.GatewayTimeoutError(message, error.config?.headers?.['x-correlation-id']);
            }
            else if (error.code === 'ECONNREFUSED') {
                throw new errors_1.ServiceUnavailableError(`${this.serviceName} is unavailable`, error.config?.headers?.['x-correlation-id']);
            }
            throw new errors_1.ExternalAPIError(this.serviceName, message, error.config?.url, error, error.config?.headers?.['x-correlation-id']);
        });
    }
    async get(path, options = {}) {
        const cacheKey = `GET:${path}:${JSON.stringify(options)}`;
        if (options.cache) {
            const cached = this.cache.get(cacheKey);
            if (cached) {
                logger_1.logger.debug(`Cache hit for ${this.serviceName}`, { path, cacheKey });
                return cached;
            }
        }
        const result = await this.executeRequest(async () => {
            const response = await this.axiosInstance.get(path, this.buildConfig(options));
            return response.data;
        }, options, 'GET', path);
        if (options.cache && result) {
            this.cache.set(cacheKey, result, options.cacheTTL || 300000);
        }
        return result;
    }
    async post(path, data, options = {}) {
        return this.executeRequest(async () => {
            const response = await this.axiosInstance.post(path, data, this.buildConfig(options));
            return response.data;
        }, options, 'POST', path);
    }
    async put(path, data, options = {}) {
        return this.executeRequest(async () => {
            const response = await this.axiosInstance.put(path, data, this.buildConfig(options));
            return response.data;
        }, options, 'PUT', path);
    }
    async patch(path, data, options = {}) {
        return this.executeRequest(async () => {
            const response = await this.axiosInstance.patch(path, data, this.buildConfig(options));
            return response.data;
        }, options, 'PATCH', path);
    }
    async delete(path, options = {}) {
        return this.executeRequest(async () => {
            const response = await this.axiosInstance.delete(path, this.buildConfig(options));
            return response.data;
        }, options, 'DELETE', path);
    }
    async executeRequest(fn, options, method, path) {
        const startTime = Date.now();
        try {
            logger_1.logger.debug(`${method} ${this.serviceName}${path}`, {
                correlationId: options.correlationId,
                service: this.serviceName,
            });
            const result = await this.circuitBreaker.execute(async () => {
                if (options.retry !== false) {
                    return await (0, helpers_1.retry)(fn, {
                        maxAttempts: options.retryCount || 3,
                        initialDelay: 1000,
                        maxDelay: 5000,
                        factor: 2,
                        onRetry: (attempt, error) => {
                            logger_1.logger.warn(`Retry attempt ${attempt} for ${this.serviceName}`, {
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
            const duration = Date.now() - startTime;
            logger_1.logger.logExternalCall(this.serviceName, `${method} ${path}`, duration, true, {
                correlationId: options.correlationId,
            });
            return result;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            logger_1.logger.logExternalCall(this.serviceName, `${method} ${path}`, duration, false, {
                correlationId: options.correlationId,
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    buildConfig(options) {
        return {
            timeout: options.timeout,
            headers: {
                ...(options.correlationId && { 'X-Correlation-ID': options.correlationId }),
                ...(options.token && { Authorization: `Bearer ${options.token}` }),
                ...options.headers,
            },
        };
    }
    getCircuitBreakerState() {
        return this.circuitBreaker.getState();
    }
    resetCircuitBreaker() {
        this.circuitBreaker.reset();
    }
    clearCache() {
        this.cache.clear();
    }
    getServiceName() {
        return this.serviceName;
    }
}
exports.ServiceClient = ServiceClient;
function createServiceClient(config) {
    return new ServiceClient(config);
}
exports.default = ServiceClient;

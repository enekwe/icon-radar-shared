/**
 * Custom Error Classes
 * Standardized error handling across all microservices
 */

/**
 * HTTP Status Codes
 */
export enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

/**
 * Base API Error Class
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly correlationId?: string;
  public readonly metadata?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    isOperational = true,
    correlationId?: string,
    metadata?: Record<string, any>
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.correlationId = correlationId;
    this.metadata = metadata;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      error: this.message,
      code: this.code,
      statusCode: this.statusCode,
      correlationId: this.correlationId,
      metadata: this.metadata,
    };
  }
}

/**
 * 400 Bad Request Error
 * Used for invalid input or malformed requests
 */
export class BadRequestError extends ApiError {
  constructor(message = 'Bad request', correlationId?: string, metadata?: Record<string, any>) {
    super(message, HttpStatus.BAD_REQUEST, 'BAD_REQUEST', true, correlationId, metadata);
  }
}

/**
 * 400 Validation Error
 * Used for input validation failures with field-level errors
 */
export class ValidationError extends ApiError {
  public readonly errors: Array<{ field: string; message: string }>;

  constructor(
    message = 'Validation failed',
    errors: Array<{ field: string; message: string }> = [],
    correlationId?: string
  ) {
    super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', true, correlationId, { errors });
    this.errors = errors;
  }

  toJSON() {
    return {
      success: false,
      error: this.message,
      code: this.code,
      statusCode: this.statusCode,
      errors: this.errors,
      correlationId: this.correlationId,
    };
  }
}

/**
 * 401 Unauthorized Error
 * Used when authentication is required but not provided or invalid
 */
export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', correlationId?: string, metadata?: Record<string, any>) {
    super(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED', true, correlationId, metadata);
  }
}

/**
 * 403 Forbidden Error
 * Used when user is authenticated but doesn't have permission
 */
export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', correlationId?: string, metadata?: Record<string, any>) {
    super(message, HttpStatus.FORBIDDEN, 'FORBIDDEN', true, correlationId, metadata);
  }
}

/**
 * 404 Not Found Error
 * Used when a requested resource doesn't exist
 */
export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', correlationId?: string, metadata?: Record<string, any>) {
    super(message, HttpStatus.NOT_FOUND, 'NOT_FOUND', true, correlationId, metadata);
  }
}

/**
 * 409 Conflict Error
 * Used when a resource already exists or there's a state conflict
 */
export class ConflictError extends ApiError {
  constructor(message = 'Resource conflict', correlationId?: string, metadata?: Record<string, any>) {
    super(message, HttpStatus.CONFLICT, 'CONFLICT', true, correlationId, metadata);
  }
}

/**
 * 422 Unprocessable Entity Error
 * Used for business logic errors
 */
export class UnprocessableEntityError extends ApiError {
  constructor(message = 'Unprocessable entity', correlationId?: string, metadata?: Record<string, any>) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, 'UNPROCESSABLE_ENTITY', true, correlationId, metadata);
  }
}

/**
 * 429 Too Many Requests Error
 * Used when rate limit is exceeded
 */
export class TooManyRequestsError extends ApiError {
  public readonly retryAfter?: number;

  constructor(message = 'Too many requests', retryAfter?: number, correlationId?: string) {
    super(message, HttpStatus.TOO_MANY_REQUESTS, 'TOO_MANY_REQUESTS', true, correlationId, { retryAfter });
    this.retryAfter = retryAfter;
  }
}

/**
 * 500 Internal Server Error
 * Used for unexpected server errors
 */
export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error', correlationId?: string, metadata?: Record<string, any>) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR', false, correlationId, metadata);
  }
}

/**
 * 502 Bad Gateway Error
 * Used when external service returns invalid response
 */
export class BadGatewayError extends ApiError {
  constructor(message = 'Bad gateway', correlationId?: string, metadata?: Record<string, any>) {
    super(message, HttpStatus.BAD_GATEWAY, 'BAD_GATEWAY', true, correlationId, metadata);
  }
}

/**
 * 503 Service Unavailable Error
 * Used when service is temporarily unavailable
 */
export class ServiceUnavailableError extends ApiError {
  constructor(message = 'Service unavailable', correlationId?: string, metadata?: Record<string, any>) {
    super(message, HttpStatus.SERVICE_UNAVAILABLE, 'SERVICE_UNAVAILABLE', true, correlationId, metadata);
  }
}

/**
 * 504 Gateway Timeout Error
 * Used when external service times out
 */
export class GatewayTimeoutError extends ApiError {
  constructor(message = 'Gateway timeout', correlationId?: string, metadata?: Record<string, any>) {
    super(message, HttpStatus.GATEWAY_TIMEOUT, 'GATEWAY_TIMEOUT', true, correlationId, metadata);
  }
}

/**
 * External API Error
 * Used for errors from external API integrations
 */
export class ExternalAPIError extends ApiError {
  public readonly service: string;
  public readonly endpoint?: string;
  public readonly originalError?: any;

  constructor(
    service: string,
    message = 'External API error',
    endpoint?: string,
    originalError?: any,
    correlationId?: string
  ) {
    super(
      message,
      HttpStatus.BAD_GATEWAY,
      'EXTERNAL_API_ERROR',
      true,
      correlationId,
      { service, endpoint, originalError: originalError?.message }
    );
    this.service = service;
    this.endpoint = endpoint;
    this.originalError = originalError;
  }
}

/**
 * Database Error
 * Used for database operation failures
 */
export class DatabaseError extends ApiError {
  public readonly operation?: string;
  public readonly originalError?: any;

  constructor(message = 'Database error', operation?: string, originalError?: any, correlationId?: string) {
    super(
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'DATABASE_ERROR',
      false,
      correlationId,
      { operation, originalError: originalError?.message }
    );
    this.operation = operation;
    this.originalError = originalError;
  }
}

/**
 * Circuit Breaker Open Error
 * Used when circuit breaker is open
 */
export class CircuitBreakerOpenError extends ApiError {
  public readonly service: string;

  constructor(service: string, correlationId?: string) {
    super(
      `Circuit breaker is open for ${service}`,
      HttpStatus.SERVICE_UNAVAILABLE,
      'CIRCUIT_BREAKER_OPEN',
      true,
      correlationId,
      { service }
    );
    this.service = service;
  }
}

/**
 * Authentication Token Error
 * Used for JWT token validation failures
 */
export class TokenError extends ApiError {
  public readonly reason: 'expired' | 'invalid' | 'malformed';

  constructor(reason: 'expired' | 'invalid' | 'malformed', correlationId?: string) {
    const messages = {
      expired: 'Token has expired',
      invalid: 'Token is invalid',
      malformed: 'Token is malformed',
    };
    super(messages[reason], HttpStatus.UNAUTHORIZED, 'TOKEN_ERROR', true, correlationId, { reason });
    this.reason = reason;
  }
}

/**
 * Check if error is an operational error (expected)
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof ApiError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Convert unknown error to ApiError
 */
export function toApiError(error: unknown, correlationId?: string): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new InternalServerError(error.message, correlationId, {
      originalError: error.message,
      stack: error.stack,
    });
  }

  return new InternalServerError('An unknown error occurred', correlationId, {
    originalError: String(error),
  });
}

/**
 * Error factory for creating appropriate errors
 */
export const ErrorFactory = {
  badRequest: (message?: string, correlationId?: string, metadata?: Record<string, any>) =>
    new BadRequestError(message, correlationId, metadata),

  validation: (message?: string, errors?: Array<{ field: string; message: string }>, correlationId?: string) =>
    new ValidationError(message, errors, correlationId),

  unauthorized: (message?: string, correlationId?: string, metadata?: Record<string, any>) =>
    new UnauthorizedError(message, correlationId, metadata),

  forbidden: (message?: string, correlationId?: string, metadata?: Record<string, any>) =>
    new ForbiddenError(message, correlationId, metadata),

  notFound: (message?: string, correlationId?: string, metadata?: Record<string, any>) =>
    new NotFoundError(message, correlationId, metadata),

  conflict: (message?: string, correlationId?: string, metadata?: Record<string, any>) =>
    new ConflictError(message, correlationId, metadata),

  unprocessable: (message?: string, correlationId?: string, metadata?: Record<string, any>) =>
    new UnprocessableEntityError(message, correlationId, metadata),

  tooManyRequests: (message?: string, retryAfter?: number, correlationId?: string) =>
    new TooManyRequestsError(message, retryAfter, correlationId),

  internal: (message?: string, correlationId?: string, metadata?: Record<string, any>) =>
    new InternalServerError(message, correlationId, metadata),

  externalApi: (service: string, message?: string, endpoint?: string, error?: any, correlationId?: string) =>
    new ExternalAPIError(service, message, endpoint, error, correlationId),

  database: (message?: string, operation?: string, error?: any, correlationId?: string) =>
    new DatabaseError(message, operation, error, correlationId),

  circuitBreakerOpen: (service: string, correlationId?: string) =>
    new CircuitBreakerOpenError(service, correlationId),

  token: (reason: 'expired' | 'invalid' | 'malformed', correlationId?: string) =>
    new TokenError(reason, correlationId),
};

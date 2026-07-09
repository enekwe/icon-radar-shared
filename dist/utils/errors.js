"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorFactory = exports.TokenError = exports.CircuitBreakerOpenError = exports.DatabaseError = exports.ExternalAPIError = exports.GatewayTimeoutError = exports.ServiceUnavailableError = exports.BadGatewayError = exports.InternalServerError = exports.TooManyRequestsError = exports.UnprocessableEntityError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.ValidationError = exports.BadRequestError = exports.ApiError = exports.HttpStatus = void 0;
exports.isOperationalError = isOperationalError;
exports.toApiError = toApiError;
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatus[HttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatus[HttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatus[HttpStatus["CONFLICT"] = 409] = "CONFLICT";
    HttpStatus[HttpStatus["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    HttpStatus[HttpStatus["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    HttpStatus[HttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HttpStatus[HttpStatus["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    HttpStatus[HttpStatus["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    HttpStatus[HttpStatus["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
})(HttpStatus || (exports.HttpStatus = HttpStatus = {}));
class ApiError extends Error {
    statusCode;
    code;
    isOperational;
    correlationId;
    metadata;
    constructor(message, statusCode, code, isOperational = true, correlationId, metadata) {
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
exports.ApiError = ApiError;
class BadRequestError extends ApiError {
    constructor(message = 'Bad request', correlationId, metadata) {
        super(message, HttpStatus.BAD_REQUEST, 'BAD_REQUEST', true, correlationId, metadata);
    }
}
exports.BadRequestError = BadRequestError;
class ValidationError extends ApiError {
    errors;
    constructor(message = 'Validation failed', errors = [], correlationId) {
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
            metadata: { errors: this.errors },
        };
    }
}
exports.ValidationError = ValidationError;
class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized', correlationId, metadata) {
        super(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED', true, correlationId, metadata);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends ApiError {
    constructor(message = 'Forbidden', correlationId, metadata) {
        super(message, HttpStatus.FORBIDDEN, 'FORBIDDEN', true, correlationId, metadata);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends ApiError {
    constructor(message = 'Resource not found', correlationId, metadata) {
        super(message, HttpStatus.NOT_FOUND, 'NOT_FOUND', true, correlationId, metadata);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends ApiError {
    constructor(message = 'Resource conflict', correlationId, metadata) {
        super(message, HttpStatus.CONFLICT, 'CONFLICT', true, correlationId, metadata);
    }
}
exports.ConflictError = ConflictError;
class UnprocessableEntityError extends ApiError {
    constructor(message = 'Unprocessable entity', correlationId, metadata) {
        super(message, HttpStatus.UNPROCESSABLE_ENTITY, 'UNPROCESSABLE_ENTITY', true, correlationId, metadata);
    }
}
exports.UnprocessableEntityError = UnprocessableEntityError;
class TooManyRequestsError extends ApiError {
    retryAfter;
    constructor(message = 'Too many requests', retryAfter, correlationId) {
        super(message, HttpStatus.TOO_MANY_REQUESTS, 'TOO_MANY_REQUESTS', true, correlationId, { retryAfter });
        this.retryAfter = retryAfter;
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
class InternalServerError extends ApiError {
    constructor(message = 'Internal server error', correlationId, metadata) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR', false, correlationId, metadata);
    }
}
exports.InternalServerError = InternalServerError;
class BadGatewayError extends ApiError {
    constructor(message = 'Bad gateway', correlationId, metadata) {
        super(message, HttpStatus.BAD_GATEWAY, 'BAD_GATEWAY', true, correlationId, metadata);
    }
}
exports.BadGatewayError = BadGatewayError;
class ServiceUnavailableError extends ApiError {
    constructor(message = 'Service unavailable', correlationId, metadata) {
        super(message, HttpStatus.SERVICE_UNAVAILABLE, 'SERVICE_UNAVAILABLE', true, correlationId, metadata);
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
class GatewayTimeoutError extends ApiError {
    constructor(message = 'Gateway timeout', correlationId, metadata) {
        super(message, HttpStatus.GATEWAY_TIMEOUT, 'GATEWAY_TIMEOUT', true, correlationId, metadata);
    }
}
exports.GatewayTimeoutError = GatewayTimeoutError;
class ExternalAPIError extends ApiError {
    service;
    endpoint;
    originalError;
    constructor(service, message = 'External API error', endpoint, originalError, correlationId) {
        super(message, HttpStatus.BAD_GATEWAY, 'EXTERNAL_API_ERROR', true, correlationId, { service, endpoint, originalError: originalError?.message });
        this.service = service;
        this.endpoint = endpoint;
        this.originalError = originalError;
    }
}
exports.ExternalAPIError = ExternalAPIError;
class DatabaseError extends ApiError {
    operation;
    originalError;
    constructor(message = 'Database error', operation, originalError, correlationId) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'DATABASE_ERROR', false, correlationId, { operation, originalError: originalError?.message });
        this.operation = operation;
        this.originalError = originalError;
    }
}
exports.DatabaseError = DatabaseError;
class CircuitBreakerOpenError extends ApiError {
    service;
    constructor(service, correlationId) {
        super(`Circuit breaker is open for ${service}`, HttpStatus.SERVICE_UNAVAILABLE, 'CIRCUIT_BREAKER_OPEN', true, correlationId, { service });
        this.service = service;
    }
}
exports.CircuitBreakerOpenError = CircuitBreakerOpenError;
class TokenError extends ApiError {
    reason;
    constructor(reason, correlationId) {
        const messages = {
            expired: 'Token has expired',
            invalid: 'Token is invalid',
            malformed: 'Token is malformed',
        };
        super(messages[reason], HttpStatus.UNAUTHORIZED, 'TOKEN_ERROR', true, correlationId, { reason });
        this.reason = reason;
    }
}
exports.TokenError = TokenError;
function isOperationalError(error) {
    if (error instanceof ApiError) {
        return error.isOperational;
    }
    return false;
}
function toApiError(error, correlationId) {
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
exports.ErrorFactory = {
    badRequest: (message, correlationId, metadata) => new BadRequestError(message, correlationId, metadata),
    validation: (message, errors, correlationId) => new ValidationError(message, errors, correlationId),
    unauthorized: (message, correlationId, metadata) => new UnauthorizedError(message, correlationId, metadata),
    forbidden: (message, correlationId, metadata) => new ForbiddenError(message, correlationId, metadata),
    notFound: (message, correlationId, metadata) => new NotFoundError(message, correlationId, metadata),
    conflict: (message, correlationId, metadata) => new ConflictError(message, correlationId, metadata),
    unprocessable: (message, correlationId, metadata) => new UnprocessableEntityError(message, correlationId, metadata),
    tooManyRequests: (message, retryAfter, correlationId) => new TooManyRequestsError(message, retryAfter, correlationId),
    internal: (message, correlationId, metadata) => new InternalServerError(message, correlationId, metadata),
    externalApi: (service, message, endpoint, error, correlationId) => new ExternalAPIError(service, message, endpoint, error, correlationId),
    database: (message, operation, error, correlationId) => new DatabaseError(message, operation, error, correlationId),
    circuitBreakerOpen: (service, correlationId) => new CircuitBreakerOpenError(service, correlationId),
    token: (reason, correlationId) => new TokenError(reason, correlationId),
};

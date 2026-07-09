export declare enum HttpStatus {
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
    GATEWAY_TIMEOUT = 504
}
export declare class ApiError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly isOperational: boolean;
    readonly correlationId?: string;
    readonly metadata?: Record<string, any>;
    constructor(message: string, statusCode: number, code: string, isOperational?: boolean, correlationId?: string, metadata?: Record<string, any>);
    toJSON(): {
        success: boolean;
        error: string;
        code: string;
        statusCode: number;
        correlationId: string | undefined;
        metadata: Record<string, any> | undefined;
    };
}
export declare class BadRequestError extends ApiError {
    constructor(message?: string, correlationId?: string, metadata?: Record<string, any>);
}
export declare class ValidationError extends ApiError {
    readonly errors: Array<{
        field: string;
        message: string;
    }>;
    constructor(message?: string, errors?: Array<{
        field: string;
        message: string;
    }>, correlationId?: string);
    toJSON(): {
        success: boolean;
        error: string;
        code: string;
        statusCode: number;
        errors: {
            field: string;
            message: string;
        }[];
        correlationId: string | undefined;
        metadata: {
            errors: {
                field: string;
                message: string;
            }[];
        };
    };
}
export declare class UnauthorizedError extends ApiError {
    constructor(message?: string, correlationId?: string, metadata?: Record<string, any>);
}
export declare class ForbiddenError extends ApiError {
    constructor(message?: string, correlationId?: string, metadata?: Record<string, any>);
}
export declare class NotFoundError extends ApiError {
    constructor(message?: string, correlationId?: string, metadata?: Record<string, any>);
}
export declare class ConflictError extends ApiError {
    constructor(message?: string, correlationId?: string, metadata?: Record<string, any>);
}
export declare class UnprocessableEntityError extends ApiError {
    constructor(message?: string, correlationId?: string, metadata?: Record<string, any>);
}
export declare class TooManyRequestsError extends ApiError {
    readonly retryAfter?: number;
    constructor(message?: string, retryAfter?: number, correlationId?: string);
}
export declare class InternalServerError extends ApiError {
    constructor(message?: string, correlationId?: string, metadata?: Record<string, any>);
}
export declare class BadGatewayError extends ApiError {
    constructor(message?: string, correlationId?: string, metadata?: Record<string, any>);
}
export declare class ServiceUnavailableError extends ApiError {
    constructor(message?: string, correlationId?: string, metadata?: Record<string, any>);
}
export declare class GatewayTimeoutError extends ApiError {
    constructor(message?: string, correlationId?: string, metadata?: Record<string, any>);
}
export declare class ExternalAPIError extends ApiError {
    readonly service: string;
    readonly endpoint?: string;
    readonly originalError?: any;
    constructor(service: string, message?: string, endpoint?: string, originalError?: any, correlationId?: string);
}
export declare class DatabaseError extends ApiError {
    readonly operation?: string;
    readonly originalError?: any;
    constructor(message?: string, operation?: string, originalError?: any, correlationId?: string);
}
export declare class CircuitBreakerOpenError extends ApiError {
    readonly service: string;
    constructor(service: string, correlationId?: string);
}
export declare class TokenError extends ApiError {
    readonly reason: 'expired' | 'invalid' | 'malformed';
    constructor(reason: 'expired' | 'invalid' | 'malformed', correlationId?: string);
}
export declare function isOperationalError(error: Error): boolean;
export declare function toApiError(error: unknown, correlationId?: string): ApiError;
export declare const ErrorFactory: {
    badRequest: (message?: string, correlationId?: string, metadata?: Record<string, any>) => BadRequestError;
    validation: (message?: string, errors?: Array<{
        field: string;
        message: string;
    }>, correlationId?: string) => ValidationError;
    unauthorized: (message?: string, correlationId?: string, metadata?: Record<string, any>) => UnauthorizedError;
    forbidden: (message?: string, correlationId?: string, metadata?: Record<string, any>) => ForbiddenError;
    notFound: (message?: string, correlationId?: string, metadata?: Record<string, any>) => NotFoundError;
    conflict: (message?: string, correlationId?: string, metadata?: Record<string, any>) => ConflictError;
    unprocessable: (message?: string, correlationId?: string, metadata?: Record<string, any>) => UnprocessableEntityError;
    tooManyRequests: (message?: string, retryAfter?: number, correlationId?: string) => TooManyRequestsError;
    internal: (message?: string, correlationId?: string, metadata?: Record<string, any>) => InternalServerError;
    externalApi: (service: string, message?: string, endpoint?: string, error?: any, correlationId?: string) => ExternalAPIError;
    database: (message?: string, operation?: string, error?: any, correlationId?: string) => DatabaseError;
    circuitBreakerOpen: (service: string, correlationId?: string) => CircuitBreakerOpenError;
    token: (reason: "expired" | "invalid" | "malformed", correlationId?: string) => TokenError;
};
//# sourceMappingURL=errors.d.ts.map
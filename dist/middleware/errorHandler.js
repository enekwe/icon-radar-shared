"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
exports.asyncHandler = asyncHandler;
exports.setupUnhandledRejectionHandler = setupUnhandledRejectionHandler;
exports.setupUncaughtExceptionHandler = setupUncaughtExceptionHandler;
exports.setupErrorHandlers = setupErrorHandlers;
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
function errorHandler(error, req, res, _next) {
    const authReq = req;
    const correlationId = authReq.correlationId;
    const apiError = error instanceof errors_1.ApiError ? error : (0, errors_1.toApiError)(error, correlationId);
    if (apiError.isOperational) {
        logger_1.logger.warn('Operational error occurred', {
            correlationId,
            errorMessage: apiError instanceof Error ? apiError.message : String(apiError),
            code: apiError.code,
            statusCode: apiError.statusCode,
            path: req.path,
            method: req.method,
            userId: authReq.user?.userId,
        });
    }
    else {
        logger_1.logger.error('Non-operational error occurred', {
            correlationId,
            errorMessage: apiError instanceof Error ? apiError.message : String(apiError),
            code: apiError.code,
            statusCode: apiError.statusCode,
            stack: apiError.stack,
            path: req.path,
            method: req.method,
            userId: authReq.user?.userId,
        });
    }
    res.status(apiError.statusCode).json(apiError.toJSON());
}
function notFoundHandler(req, res, _next) {
    const authReq = req;
    const correlationId = authReq.correlationId;
    logger_1.logger.warn('Route not found', {
        correlationId,
        path: req.path,
        method: req.method,
    });
    res.status(404).json({
        success: false,
        error: 'Route not found',
        code: 'NOT_FOUND',
        correlationId,
        path: req.path,
        method: req.method,
    });
}
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
function setupUnhandledRejectionHandler() {
    process.on('unhandledRejection', (reason, promise) => {
        logger_1.logger.error('Unhandled Promise Rejection', {
            errorMessage: reason instanceof Error ? reason.message : String(reason),
            stack: reason instanceof Error ? reason.stack : undefined,
            promise: promise.toString(),
        });
        if (process.env.NODE_ENV === 'production') {
            logger_1.logger.error('Shutting down due to unhandled rejection...');
            process.exit(1);
        }
    });
}
function setupUncaughtExceptionHandler() {
    process.on('uncaughtException', (error) => {
        logger_1.logger.error('Uncaught Exception', {
            errorMessage: error.message,
            stack: error.stack,
        });
        logger_1.logger.error('Shutting down due to uncaught exception...');
        process.exit(1);
    });
}
function setupErrorHandlers() {
    setupUnhandledRejectionHandler();
    setupUncaughtExceptionHandler();
}

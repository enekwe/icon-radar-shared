/**
 * Error Handler Middleware
 * Centralized error handling for all API errors
 */

import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { ApiError, isOperationalError, toApiError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Error handler middleware
 * Should be the last middleware in the chain
 */
export function errorHandler(
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authReq = req as AuthenticatedRequest;
  const correlationId = authReq.correlationId;

  // Convert unknown errors to ApiError
  const apiError = error instanceof ApiError ? error : toApiError(error, correlationId);

  // Log error
  if (apiError.isOperational) {
    logger.warn('Operational error occurred', {
      correlationId,
      error: apiError.message,
      code: apiError.code,
      statusCode: apiError.statusCode,
      path: req.path,
      method: req.method,
      userId: authReq.user?.userId,
    });
  } else {
    logger.error('Non-operational error occurred', {
      correlationId,
      error: apiError.message,
      code: apiError.code,
      statusCode: apiError.statusCode,
      stack: apiError.stack,
      path: req.path,
      method: req.method,
      userId: authReq.user?.userId,
    });
  }

  // Send error response
  res.status(apiError.statusCode).json(apiError.toJSON());
}

/**
 * Not found handler
 * Handles 404 errors for undefined routes
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthenticatedRequest;
  const correlationId = authReq.correlationId;

  logger.warn('Route not found', {
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

/**
 * Async handler wrapper
 * Wraps async route handlers to catch promise rejections
 */
export function asyncHandler<T = any>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Handle unhandled promise rejections
 */
export function setupUnhandledRejectionHandler(): void {
  process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
    logger.error('Unhandled Promise Rejection', {
      reason: reason.message,
      stack: reason.stack,
      promise: promise.toString(),
    });

    // In production, you might want to exit the process
    if (process.env.NODE_ENV === 'production') {
      logger.error('Shutting down due to unhandled rejection...');
      process.exit(1);
    }
  });
}

/**
 * Handle uncaught exceptions
 */
export function setupUncaughtExceptionHandler(): void {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', {
      error: error.message,
      stack: error.stack,
    });

    // Always exit on uncaught exceptions
    logger.error('Shutting down due to uncaught exception...');
    process.exit(1);
  });
}

/**
 * Setup all error handlers
 */
export function setupErrorHandlers(): void {
  setupUnhandledRejectionHandler();
  setupUncaughtExceptionHandler();
}

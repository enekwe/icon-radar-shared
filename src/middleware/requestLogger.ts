/**
 * Request Logger Middleware
 * Logs HTTP requests and responses
 */

import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { logger } from '../utils/logger';

/**
 * Request logger middleware
 * Logs incoming requests and outgoing responses
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthenticatedRequest;
  const startTime = Date.now();

  // Log request
  logger.logRequest(req.method, req.path, {
    correlationId: authReq.correlationId,
    userId: authReq.user?.userId,
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'],
  });

  // Capture response
  const originalSend = res.send;
  res.send = function (data: any): Response {
    const duration = Date.now() - startTime;

    // Log response
    logger.logResponse(req.method, req.path, res.statusCode, duration, {
      correlationId: authReq.correlationId,
      userId: authReq.user?.userId,
    });

    return originalSend.call(this, data);
  };

  next();
}

export default requestLogger;

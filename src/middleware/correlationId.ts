/**
 * Correlation ID Middleware
 * Adds or propagates correlation ID for request tracing
 */

import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { generateUUID } from '../utils/helpers';

/**
 * Correlation ID middleware
 * Generates or propagates correlation ID for distributed tracing
 */
export function correlationId(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthenticatedRequest;

  // Get correlation ID from header or generate new one
  const correlationId =
    (req.headers['x-correlation-id'] as string) ||
    (req.headers['x-request-id'] as string) ||
    generateUUID();

  // Add to request object
  authReq.correlationId = correlationId;

  // Add to response headers
  res.setHeader('X-Correlation-ID', correlationId);

  next();
}

export default correlationId;

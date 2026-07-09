/**
 * Authentication Middleware
 * JWT token validation and user context extraction
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JWTPayload, UserContext, Role } from '../types';
import { UnauthorizedError, ForbiddenError, TokenError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Extract token from Authorization header
 */
function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  // Support both "Bearer token" and "token" formats
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return authHeader;
}

/**
 * Verify JWT token
 */
function verifyToken(token: string): JWTPayload {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  try {
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new TokenError('expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new TokenError('invalid');
    } else {
      throw new TokenError('malformed');
    }
  }
}

/**
 * Middleware to require authentication
 * Validates JWT token and adds user context to request
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthenticatedRequest;
  const correlationId = authReq.correlationId;

  try {
    // Extract token from header
    const token = extractToken(req);

    if (!token) {
      logger.logSecurity('Authentication required but no token provided', 'medium', {
        correlationId,
        path: req.path,
        method: req.method,
      });
      throw new UnauthorizedError('Authentication required', correlationId);
    }

    // Verify and decode token
    const decoded = verifyToken(token);

    // Add user context to request
    authReq.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    logger.debug('User authenticated', {
      correlationId,
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    next();
  } catch (error) {
    if (error instanceof TokenError || error instanceof UnauthorizedError) {
      logger.logSecurity('Authentication failed', 'high', {
        correlationId,
        path: req.path,
        method: req.method,
        error: error.message,
      });
      res.status(error.statusCode).json(error.toJSON());
    } else {
      logger.error('Authentication middleware error', {
        correlationId,
        error: error instanceof Error ? error.message : String(error),
      });
      const authError = new UnauthorizedError('Authentication failed', correlationId);
      res.status(authError.statusCode).json(authError.toJSON());
    }
  }
}

/**
 * Middleware to require specific role(s)
 * Must be used after requireAuth middleware
 */
export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    const correlationId = authReq.correlationId;

    try {
      // Check if user is authenticated
      if (!authReq.user) {
        throw new UnauthorizedError('Authentication required', correlationId);
      }

      // Check if user has required role
      if (!roles.includes(authReq.user.role)) {
        logger.logSecurity('Authorization failed - insufficient permissions', 'high', {
          correlationId,
          userId: authReq.user.userId,
          userRole: authReq.user.role,
          requiredRoles: roles,
          path: req.path,
          method: req.method,
        });
        throw new ForbiddenError('Insufficient permissions', correlationId, {
          requiredRoles: roles,
          userRole: authReq.user.role,
        });
      }

      logger.debug('Authorization successful', {
        correlationId,
        userId: authReq.user.userId,
        role: authReq.user.role,
      });

      next();
    } catch (error) {
      if (error instanceof ForbiddenError || error instanceof UnauthorizedError) {
        res.status(error.statusCode).json(error.toJSON());
      } else {
        logger.error('Authorization middleware error', {
          correlationId,
          error: error instanceof Error ? error.message : String(error),
        });
        const forbiddenError = new ForbiddenError('Authorization failed', correlationId);
        res.status(forbiddenError.statusCode).json(forbiddenError.toJSON());
      }
    }
  };
}

/**
 * Middleware to optionally authenticate
 * Adds user context if token is present, but doesn't require it
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthenticatedRequest;

  try {
    const token = extractToken(req);

    if (token) {
      const decoded = verifyToken(token);
      authReq.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    }

    next();
  } catch (error) {
    // Silently fail for optional auth
    logger.debug('Optional auth failed', {
      correlationId: authReq.correlationId,
      error: error instanceof Error ? error.message : String(error),
    });
    next();
  }
}

/**
 * Middleware to validate service-to-service authentication
 * Uses X-Service-API-Key header
 */
export function requireServiceAuth(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthenticatedRequest;
  const correlationId = authReq.correlationId;

  try {
    const apiKey = req.headers['x-service-api-key'] as string;
    const expectedKey = process.env.SERVICE_API_KEY;

    if (!expectedKey) {
      throw new Error('SERVICE_API_KEY environment variable is not set');
    }

    if (!apiKey) {
      logger.logSecurity('Service authentication required but no API key provided', 'high', {
        correlationId,
        path: req.path,
        method: req.method,
      });
      throw new ForbiddenError('Service authentication required', correlationId);
    }

    if (apiKey !== expectedKey) {
      logger.logSecurity('Service authentication failed - invalid API key', 'critical', {
        correlationId,
        path: req.path,
        method: req.method,
      });
      throw new ForbiddenError('Invalid service API key', correlationId);
    }

    logger.debug('Service authenticated', {
      correlationId,
      path: req.path,
      method: req.method,
    });

    next();
  } catch (error) {
    if (error instanceof ForbiddenError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      logger.error('Service authentication middleware error', {
        correlationId,
        error: error instanceof Error ? error.message : String(error),
      });
      const forbiddenError = new ForbiddenError('Service authentication failed', correlationId);
      res.status(forbiddenError.statusCode).json(forbiddenError.toJSON());
    }
  }
}

/**
 * Generate JWT token
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresIn = '24h'): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Generate refresh token (longer expiration)
 */
export function generateRefreshToken(userId: string): string {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET environment variable is not set');
  }

  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): { userId: string } {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET environment variable is not set');
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    return decoded;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new TokenError('expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new TokenError('invalid');
    } else {
      throw new TokenError('malformed');
    }
  }
}

/**
 * Extract user context from request
 */
export function getUserContext(req: Request): UserContext | null {
  const authReq = req as AuthenticatedRequest;
  return authReq.user || null;
}

/**
 * Check if user has specific role
 */
export function hasRole(req: Request, ...roles: Role[]): boolean {
  const user = getUserContext(req);
  if (!user) return false;
  return roles.includes(user.role);
}

/**
 * Check if user is admin
 */
export function isAdmin(req: Request): boolean {
  return hasRole(req, 'admin');
}

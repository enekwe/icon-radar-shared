/**
 * CORS Middleware
 * Cross-Origin Resource Sharing configuration
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * CORS Configuration Options
 */
export interface CorsOptions {
  origins?: string[];
  allowCredentials?: boolean;
  allowMethods?: string[];
  allowHeaders?: string[];
  exposeHeaders?: string[];
  maxAge?: number;
}

/**
 * Default CORS configuration
 */
const DEFAULT_CORS_OPTIONS: CorsOptions = {
  origins: ['*'],
  allowCredentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID', 'X-Service-API-Key'],
  exposeHeaders: ['X-Correlation-ID', 'X-Total-Count', 'X-Page', 'X-Limit'],
  maxAge: 86400, // 24 hours
};

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | undefined, allowedOrigins: string[]): boolean {
  if (!origin) return true; // Allow requests with no origin (e.g., mobile apps, Postman)
  if (allowedOrigins.includes('*')) return true;
  return allowedOrigins.some((allowed) => {
    if (allowed === origin) return true;
    // Support wildcard subdomains (e.g., *.example.com)
    if (allowed.startsWith('*.')) {
      const domain = allowed.substring(2);
      return origin.endsWith(domain);
    }
    return false;
  });
}

/**
 * CORS middleware factory
 */
export function cors(options: CorsOptions = {}): (req: Request, res: Response, next: NextFunction) => void {
  const config = { ...DEFAULT_CORS_OPTIONS, ...options };

  return (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers.origin;

    // Check if origin is allowed
    if (origin && !isOriginAllowed(origin, config.origins!)) {
      logger.warn('CORS: Origin not allowed', {
        origin,
        path: req.path,
        method: req.method,
      });
      res.status(403).json({
        success: false,
        error: 'CORS: Origin not allowed',
        code: 'CORS_ERROR',
      });
      return;
    }

    // Set CORS headers
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (config.origins!.includes('*')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    if (config.allowCredentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    if (config.allowMethods) {
      res.setHeader('Access-Control-Allow-Methods', config.allowMethods.join(', '));
    }

    if (config.allowHeaders) {
      res.setHeader('Access-Control-Allow-Headers', config.allowHeaders.join(', '));
    }

    if (config.exposeHeaders) {
      res.setHeader('Access-Control-Expose-Headers', config.exposeHeaders.join(', '));
    }

    if (config.maxAge) {
      res.setHeader('Access-Control-Max-Age', config.maxAge.toString());
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    next();
  };
}

/**
 * Development CORS (allow all origins)
 */
export function devCors(): (req: Request, res: Response, next: NextFunction) => void {
  return cors({
    origins: ['*'],
    allowCredentials: true,
  });
}

/**
 * Production CORS (strict origins)
 */
export function prodCors(allowedOrigins: string[]): (req: Request, res: Response, next: NextFunction) => void {
  return cors({
    origins: allowedOrigins,
    allowCredentials: true,
  });
}

/**
 * Get CORS middleware based on environment
 */
export function envCors(productionOrigins: string[] = []): (req: Request, res: Response, next: NextFunction) => void {
  if (process.env.NODE_ENV === 'production') {
    return prodCors(productionOrigins);
  }
  return devCors();
}

/**
 * Parse allowed origins from environment variable
 */
export function getCorsOriginsFromEnv(): string[] {
  const originsEnv = process.env.CORS_ORIGINS || process.env.ALLOWED_ORIGINS;
  if (!originsEnv) return ['*'];

  return originsEnv.split(',').map((origin) => origin.trim()).filter(Boolean);
}

/**
 * Auto CORS (reads from environment)
 */
export function autoCors(): (req: Request, res: Response, next: NextFunction) => void {
  const origins = getCorsOriginsFromEnv();
  return cors({ origins });
}

export default cors;

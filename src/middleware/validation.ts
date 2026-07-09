/**
 * Validation Middleware
 * Request validation using Zod schemas
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../types';
import { ValidationError } from '../utils/errors';
import { transformZodErrors } from '../utils/validators';
import { logger } from '../utils/logger';

/**
 * Validation target
 */
export type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Validate request data with Zod schema
 */
export function validateRequest<T extends z.ZodType>(
  schema: T,
  target: ValidationTarget = 'body'
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    const correlationId = authReq.correlationId;

    try {
      // Get data based on target
      const data = req[target];

      // Validate with Zod schema
      const result = schema.safeParse(data);

      if (!result.success) {
        const errors = transformZodErrors(result.error);

        logger.warn('Request validation failed', {
          correlationId,
          target,
          path: req.path,
          method: req.method,
          errors,
        });

        throw new ValidationError('Validation failed', errors, correlationId);
      }

      // Replace request data with validated and transformed data
      (req as any)[target] = result.data;

      logger.debug('Request validation successful', {
        correlationId,
        target,
        path: req.path,
        method: req.method,
      });

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(error.statusCode).json(error.toJSON());
      } else {
        logger.error('Validation middleware error', {
          correlationId,
          error: error instanceof Error ? error.message : String(error),
        });
        const validationError = new ValidationError('Validation error', [], correlationId);
        res.status(validationError.statusCode).json(validationError.toJSON());
      }
    }
  };
}

/**
 * Validate request body
 */
export function validateBody<T extends z.ZodType>(schema: T) {
  return validateRequest(schema, 'body');
}

/**
 * Validate query parameters
 */
export function validateQuery<T extends z.ZodType>(schema: T) {
  return validateRequest(schema, 'query');
}

/**
 * Validate URL parameters
 */
export function validateParams<T extends z.ZodType>(schema: T) {
  return validateRequest(schema, 'params');
}

/**
 * Validate multiple targets at once
 */
export function validateMultiple(schemas: {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    const correlationId = authReq.correlationId;
    const allErrors: Array<{ field: string; message: string }> = [];

    try {
      // Validate body
      if (schemas.body) {
        const bodyResult = schemas.body.safeParse(req.body);
        if (!bodyResult.success) {
          allErrors.push(...transformZodErrors(bodyResult.error));
        } else {
          req.body = bodyResult.data;
        }
      }

      // Validate query
      if (schemas.query) {
        const queryResult = schemas.query.safeParse(req.query);
        if (!queryResult.success) {
          allErrors.push(...transformZodErrors(queryResult.error));
        } else {
          req.query = queryResult.data;
        }
      }

      // Validate params
      if (schemas.params) {
        const paramsResult = schemas.params.safeParse(req.params);
        if (!paramsResult.success) {
          allErrors.push(...transformZodErrors(paramsResult.error));
        } else {
          req.params = paramsResult.data;
        }
      }

      // Check if there are any errors
      if (allErrors.length > 0) {
        logger.warn('Multi-target validation failed', {
          correlationId,
          path: req.path,
          method: req.method,
          errors: allErrors,
        });
        throw new ValidationError('Validation failed', allErrors, correlationId);
      }

      logger.debug('Multi-target validation successful', {
        correlationId,
        path: req.path,
        method: req.method,
      });

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(error.statusCode).json(error.toJSON());
      } else {
        logger.error('Multi-target validation middleware error', {
          correlationId,
          error: error instanceof Error ? error.message : String(error),
        });
        const validationError = new ValidationError('Validation error', [], correlationId);
        res.status(validationError.statusCode).json(validationError.toJSON());
      }
    }
  };
}

/**
 * Sanitize request body (strip unknown fields)
 */
export function sanitizeBody<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.parse(req.body);
      req.body = result;
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Validate pagination parameters
 */
export function validatePagination(req: Request, res: Response, next: NextFunction): void {
  const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('asc'),
  });

  const result = paginationSchema.safeParse(req.query);

  if (!result.success) {
    const errors = transformZodErrors(result.error);
    const validationError = new ValidationError(
      'Invalid pagination parameters',
      errors,
      (req as AuthenticatedRequest).correlationId
    );
    res.status(validationError.statusCode).json(validationError.toJSON());
    return;
  }

  req.query = { ...req.query, ...result.data };
  next();
}

/**
 * Validate UUID parameter
 */
export function validateUUID(paramName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    const correlationId = authReq.correlationId;
    const value = req.params[paramName];

    const uuidSchema = z.string().uuid();
    const result = uuidSchema.safeParse(value);

    if (!result.success) {
      logger.warn('Invalid UUID parameter', {
        correlationId,
        paramName,
        value,
        path: req.path,
      });

      const validationError = new ValidationError(
        `Invalid ${paramName}: must be a valid UUID`,
        [{ field: paramName, message: 'Invalid UUID format' }],
        correlationId
      );
      res.status(validationError.statusCode).json(validationError.toJSON());
      return;
    }

    next();
  };
}

/**
 * Validate common ID parameter
 */
export function validateId(paramName = 'id') {
  return validateUUID(paramName);
}

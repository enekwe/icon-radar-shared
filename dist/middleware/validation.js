"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
exports.validateBody = validateBody;
exports.validateQuery = validateQuery;
exports.validateParams = validateParams;
exports.validateMultiple = validateMultiple;
exports.sanitizeBody = sanitizeBody;
exports.validatePagination = validatePagination;
exports.validateUUID = validateUUID;
exports.validateId = validateId;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
const validators_1 = require("../utils/validators");
const logger_1 = require("../utils/logger");
function validateRequest(schema, target = 'body') {
    return (req, res, next) => {
        const authReq = req;
        const correlationId = authReq.correlationId;
        try {
            const data = req[target];
            const result = schema.safeParse(data);
            if (!result.success) {
                const errors = (0, validators_1.transformZodErrors)(result.error);
                logger_1.logger.warn('Request validation failed', {
                    correlationId,
                    target,
                    path: req.path,
                    method: req.method,
                    errors,
                });
                throw new errors_1.ValidationError('Validation failed', errors, correlationId);
            }
            req[target] = result.data;
            logger_1.logger.debug('Request validation successful', {
                correlationId,
                target,
                path: req.path,
                method: req.method,
            });
            next();
        }
        catch (error) {
            if (error instanceof errors_1.ValidationError) {
                res.status(error.statusCode).json(error.toJSON());
            }
            else {
                logger_1.logger.error('Validation middleware error', {
                    correlationId,
                    error: error instanceof Error ? error.message : String(error),
                });
                const validationError = new errors_1.ValidationError('Validation error', [], correlationId);
                res.status(validationError.statusCode).json(validationError.toJSON());
            }
        }
    };
}
function validateBody(schema) {
    return validateRequest(schema, 'body');
}
function validateQuery(schema) {
    return validateRequest(schema, 'query');
}
function validateParams(schema) {
    return validateRequest(schema, 'params');
}
function validateMultiple(schemas) {
    return (req, res, next) => {
        const authReq = req;
        const correlationId = authReq.correlationId;
        const allErrors = [];
        try {
            if (schemas.body) {
                const bodyResult = schemas.body.safeParse(req.body);
                if (!bodyResult.success) {
                    allErrors.push(...(0, validators_1.transformZodErrors)(bodyResult.error));
                }
                else {
                    req.body = bodyResult.data;
                }
            }
            if (schemas.query) {
                const queryResult = schemas.query.safeParse(req.query);
                if (!queryResult.success) {
                    allErrors.push(...(0, validators_1.transformZodErrors)(queryResult.error));
                }
                else {
                    req.query = queryResult.data;
                }
            }
            if (schemas.params) {
                const paramsResult = schemas.params.safeParse(req.params);
                if (!paramsResult.success) {
                    allErrors.push(...(0, validators_1.transformZodErrors)(paramsResult.error));
                }
                else {
                    req.params = paramsResult.data;
                }
            }
            if (allErrors.length > 0) {
                logger_1.logger.warn('Multi-target validation failed', {
                    correlationId,
                    path: req.path,
                    method: req.method,
                    errors: allErrors,
                });
                throw new errors_1.ValidationError('Validation failed', allErrors, correlationId);
            }
            logger_1.logger.debug('Multi-target validation successful', {
                correlationId,
                path: req.path,
                method: req.method,
            });
            next();
        }
        catch (error) {
            if (error instanceof errors_1.ValidationError) {
                res.status(error.statusCode).json(error.toJSON());
            }
            else {
                logger_1.logger.error('Multi-target validation middleware error', {
                    correlationId,
                    error: error instanceof Error ? error.message : String(error),
                });
                const validationError = new errors_1.ValidationError('Validation error', [], correlationId);
                res.status(validationError.statusCode).json(validationError.toJSON());
            }
        }
    };
}
function sanitizeBody(schema) {
    return (req, res, next) => {
        try {
            const result = schema.parse(req.body);
            req.body = result;
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
function validatePagination(req, res, next) {
    const paginationSchema = zod_1.z.object({
        page: zod_1.z.coerce.number().int().min(1).default(1),
        limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
        sort: zod_1.z.string().optional(),
        order: zod_1.z.enum(['asc', 'desc']).default('asc'),
    });
    const result = paginationSchema.safeParse(req.query);
    if (!result.success) {
        const errors = (0, validators_1.transformZodErrors)(result.error);
        const validationError = new errors_1.ValidationError('Invalid pagination parameters', errors, req.correlationId);
        res.status(validationError.statusCode).json(validationError.toJSON());
        return;
    }
    req.query = { ...req.query, ...result.data };
    next();
}
function validateUUID(paramName) {
    return (req, res, next) => {
        const authReq = req;
        const correlationId = authReq.correlationId;
        const value = req.params[paramName];
        const uuidSchema = zod_1.z.string().uuid();
        const result = uuidSchema.safeParse(value);
        if (!result.success) {
            logger_1.logger.warn('Invalid UUID parameter', {
                correlationId,
                paramName,
                value,
                path: req.path,
            });
            const validationError = new errors_1.ValidationError(`Invalid ${paramName}: must be a valid UUID`, [{ field: paramName, message: 'Invalid UUID format' }], correlationId);
            res.status(validationError.statusCode).json(validationError.toJSON());
            return;
        }
        next();
    };
}
function validateId(paramName = 'id') {
    return validateUUID(paramName);
}

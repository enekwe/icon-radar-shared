"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
exports.optionalAuth = optionalAuth;
exports.requireServiceAuth = requireServiceAuth;
exports.generateToken = generateToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.getUserContext = getUserContext;
exports.hasRole = hasRole;
exports.isAdmin = isAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
function extractToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return null;
    }
    if (authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return authHeader;
}
function verifyToken(token) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new errors_1.TokenError('expired');
        }
        else if (error.name === 'JsonWebTokenError') {
            throw new errors_1.TokenError('invalid');
        }
        else {
            throw new errors_1.TokenError('malformed');
        }
    }
}
function requireAuth(req, res, next) {
    const authReq = req;
    const correlationId = authReq.correlationId;
    try {
        const token = extractToken(req);
        if (!token) {
            logger_1.logger.logSecurity('Authentication required but no token provided', 'medium', {
                correlationId,
                path: req.path,
                method: req.method,
            });
            throw new errors_1.UnauthorizedError('Authentication required', correlationId);
        }
        const decoded = verifyToken(token);
        authReq.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };
        logger_1.logger.debug('User authenticated', {
            correlationId,
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        });
        next();
    }
    catch (error) {
        if (error instanceof errors_1.TokenError || error instanceof errors_1.UnauthorizedError) {
            logger_1.logger.logSecurity('Authentication failed', 'high', {
                correlationId,
                path: req.path,
                method: req.method,
                error: error.message,
            });
            res.status(error.statusCode).json(error.toJSON());
        }
        else {
            logger_1.logger.error('Authentication middleware error', {
                correlationId,
                error: error instanceof Error ? error.message : String(error),
            });
            const authError = new errors_1.UnauthorizedError('Authentication failed', correlationId);
            res.status(authError.statusCode).json(authError.toJSON());
        }
    }
}
function requireRole(...roles) {
    return (req, res, next) => {
        const authReq = req;
        const correlationId = authReq.correlationId;
        try {
            if (!authReq.user) {
                throw new errors_1.UnauthorizedError('Authentication required', correlationId);
            }
            if (!roles.includes(authReq.user.role)) {
                logger_1.logger.logSecurity('Authorization failed - insufficient permissions', 'high', {
                    correlationId,
                    userId: authReq.user.userId,
                    userRole: authReq.user.role,
                    requiredRoles: roles,
                    path: req.path,
                    method: req.method,
                });
                throw new errors_1.ForbiddenError('Insufficient permissions', correlationId, {
                    requiredRoles: roles,
                    userRole: authReq.user.role,
                });
            }
            logger_1.logger.debug('Authorization successful', {
                correlationId,
                userId: authReq.user.userId,
                role: authReq.user.role,
            });
            next();
        }
        catch (error) {
            if (error instanceof errors_1.ForbiddenError || error instanceof errors_1.UnauthorizedError) {
                res.status(error.statusCode).json(error.toJSON());
            }
            else {
                logger_1.logger.error('Authorization middleware error', {
                    correlationId,
                    error: error instanceof Error ? error.message : String(error),
                });
                const forbiddenError = new errors_1.ForbiddenError('Authorization failed', correlationId);
                res.status(forbiddenError.statusCode).json(forbiddenError.toJSON());
            }
        }
    };
}
function optionalAuth(req, res, next) {
    const authReq = req;
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
    }
    catch (error) {
        logger_1.logger.debug('Optional auth failed', {
            correlationId: authReq.correlationId,
            error: error instanceof Error ? error.message : String(error),
        });
        next();
    }
}
function requireServiceAuth(req, res, next) {
    const authReq = req;
    const correlationId = authReq.correlationId;
    try {
        const apiKey = req.headers['x-service-api-key'];
        const expectedKey = process.env.SERVICE_API_KEY;
        if (!expectedKey) {
            throw new Error('SERVICE_API_KEY environment variable is not set');
        }
        if (!apiKey) {
            logger_1.logger.logSecurity('Service authentication required but no API key provided', 'high', {
                correlationId,
                path: req.path,
                method: req.method,
            });
            throw new errors_1.ForbiddenError('Service authentication required', correlationId);
        }
        if (apiKey !== expectedKey) {
            logger_1.logger.logSecurity('Service authentication failed - invalid API key', 'critical', {
                correlationId,
                path: req.path,
                method: req.method,
            });
            throw new errors_1.ForbiddenError('Invalid service API key', correlationId);
        }
        logger_1.logger.debug('Service authenticated', {
            correlationId,
            path: req.path,
            method: req.method,
        });
        next();
    }
    catch (error) {
        if (error instanceof errors_1.ForbiddenError) {
            res.status(error.statusCode).json(error.toJSON());
        }
        else {
            logger_1.logger.error('Service authentication middleware error', {
                correlationId,
                error: error instanceof Error ? error.message : String(error),
            });
            const forbiddenError = new errors_1.ForbiddenError('Service authentication failed', correlationId);
            res.status(forbiddenError.statusCode).json(forbiddenError.toJSON());
        }
    }
}
function generateToken(payload, expiresIn = '24h') {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
}
function generateRefreshToken(userId) {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET environment variable is not set');
    }
    return jsonwebtoken_1.default.sign({ userId }, secret, { expiresIn: '7d' });
}
function verifyRefreshToken(token) {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET environment variable is not set');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new errors_1.TokenError('expired');
        }
        else if (error.name === 'JsonWebTokenError') {
            throw new errors_1.TokenError('invalid');
        }
        else {
            throw new errors_1.TokenError('malformed');
        }
    }
}
function getUserContext(req) {
    const authReq = req;
    return authReq.user || null;
}
function hasRole(req, ...roles) {
    const user = getUserContext(req);
    if (!user)
        return false;
    return roles.includes(user.role);
}
function isAdmin(req) {
    return hasRole(req, 'admin');
}

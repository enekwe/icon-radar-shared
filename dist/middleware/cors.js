"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cors = cors;
exports.devCors = devCors;
exports.prodCors = prodCors;
exports.envCors = envCors;
exports.getCorsOriginsFromEnv = getCorsOriginsFromEnv;
exports.autoCors = autoCors;
const logger_1 = require("../utils/logger");
const DEFAULT_CORS_OPTIONS = {
    origins: ['*'],
    allowCredentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID', 'X-Service-API-Key'],
    exposeHeaders: ['X-Correlation-ID', 'X-Total-Count', 'X-Page', 'X-Limit'],
    maxAge: 86400,
};
function isOriginAllowed(origin, allowedOrigins) {
    if (!origin)
        return true;
    if (allowedOrigins.includes('*'))
        return true;
    return allowedOrigins.some((allowed) => {
        if (allowed === origin)
            return true;
        if (allowed.startsWith('*.')) {
            const domain = allowed.substring(2);
            return origin.endsWith(domain);
        }
        return false;
    });
}
function cors(options = {}) {
    const config = { ...DEFAULT_CORS_OPTIONS, ...options };
    return (req, res, next) => {
        const origin = req.headers.origin;
        if (origin && !isOriginAllowed(origin, config.origins)) {
            logger_1.logger.warn('CORS: Origin not allowed', {
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
        if (origin) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        else if (config.origins.includes('*')) {
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
        if (req.method === 'OPTIONS') {
            res.status(204).end();
            return;
        }
        next();
    };
}
function devCors() {
    return cors({
        origins: ['*'],
        allowCredentials: true,
    });
}
function prodCors(allowedOrigins) {
    return cors({
        origins: allowedOrigins,
        allowCredentials: true,
    });
}
function envCors(productionOrigins = []) {
    if (process.env.NODE_ENV === 'production') {
        return prodCors(productionOrigins);
    }
    return devCors();
}
function getCorsOriginsFromEnv() {
    const originsEnv = process.env.CORS_ORIGINS || process.env.ALLOWED_ORIGINS;
    if (!originsEnv)
        return ['*'];
    return originsEnv.split(',').map((origin) => origin.trim()).filter(Boolean);
}
function autoCors() {
    const origins = getCorsOriginsFromEnv();
    return cors({ origins });
}
exports.default = cors;

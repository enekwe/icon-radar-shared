"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = exports.LogLevel = void 0;
exports.createLogger = createLogger;
exports.createServiceLogger = createServiceLogger;
const winston_1 = __importDefault(require("winston"));
const uuid_1 = require("uuid");
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "error";
    LogLevel["WARN"] = "warn";
    LogLevel["INFO"] = "info";
    LogLevel["DEBUG"] = "debug";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
const devFormat = winston_1.default.format.printf(({ level, message, timestamp, service, correlationId, ...metadata }) => {
    let msg = `${timestamp} [${service}] ${level.toUpperCase()}: ${message}`;
    if (correlationId) {
        msg += ` | correlationId: ${correlationId}`;
    }
    const metaKeys = Object.keys(metadata);
    if (metaKeys.length > 0) {
        msg += ` | ${JSON.stringify(metadata, null, 2)}`;
    }
    return msg;
});
const prodFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json());
const developmentFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.colorize(), winston_1.default.format.errors({ stack: true }), devFormat);
function createLogger(options) {
    const { service, level = LogLevel.INFO, enableConsole = true, enableFile = false, fileDir = './logs', environment = process.env.NODE_ENV || 'development', } = options;
    const transports = [];
    if (enableConsole) {
        transports.push(new winston_1.default.transports.Console({
            format: environment === 'production' ? prodFormat : developmentFormat,
        }));
    }
    if (enableFile) {
        transports.push(new winston_1.default.transports.File({
            filename: `${fileDir}/error.log`,
            level: 'error',
            format: prodFormat,
            maxsize: 10485760,
            maxFiles: 5,
        }));
        transports.push(new winston_1.default.transports.File({
            filename: `${fileDir}/combined.log`,
            format: prodFormat,
            maxsize: 10485760,
            maxFiles: 10,
        }));
    }
    return winston_1.default.createLogger({
        level,
        format: prodFormat,
        defaultMeta: {
            service,
            environment,
            hostname: process.env.HOSTNAME || 'unknown',
            pid: process.pid,
        },
        transports,
        exitOnError: false,
    });
}
class Logger {
    logger;
    defaultMeta;
    constructor(options) {
        this.logger = createLogger(options);
        this.defaultMeta = {};
    }
    child(meta) {
        const childLogger = new Logger({
            service: this.logger.defaultMeta?.service || 'app',
        });
        childLogger.logger = this.logger.child(meta);
        childLogger.defaultMeta = { ...this.defaultMeta, ...meta };
        return childLogger;
    }
    error(message, metaOrError) {
        const isLogMetadata = metaOrError && typeof metaOrError === 'object' && !Array.isArray(metaOrError) &&
            ('correlationId' in metaOrError || 'userId' in metaOrError || 'athleteId' in metaOrError ||
                'brandId' in metaOrError || 'duration' in metaOrError || 'error' in metaOrError || 'stack' in metaOrError);
        const metadata = isLogMetadata
            ? { ...this.defaultMeta, ...metaOrError }
            : metaOrError !== undefined
                ? { ...this.defaultMeta, error: metaOrError }
                : this.defaultMeta;
        this.logger.error(message, metadata);
    }
    warn(message, metaOrError) {
        const isLogMetadata = metaOrError && typeof metaOrError === 'object' && !Array.isArray(metaOrError) &&
            ('correlationId' in metaOrError || 'userId' in metaOrError || 'athleteId' in metaOrError ||
                'brandId' in metaOrError || 'duration' in metaOrError || 'error' in metaOrError || 'stack' in metaOrError);
        const metadata = isLogMetadata
            ? { ...this.defaultMeta, ...metaOrError }
            : metaOrError !== undefined
                ? { ...this.defaultMeta, error: metaOrError }
                : this.defaultMeta;
        this.logger.warn(message, metadata);
    }
    info(message, meta) {
        this.logger.info(message, { ...this.defaultMeta, ...meta });
    }
    debug(message, meta) {
        this.logger.debug(message, { ...this.defaultMeta, ...meta });
    }
    withCorrelation(correlationId) {
        return this.child({ correlationId });
    }
    withUser(userId, email) {
        return this.child({ userId, email });
    }
    logRequest(method, path, meta) {
        this.info(`HTTP ${method} ${path}`, { type: 'http_request', method, path, ...meta });
    }
    logResponse(method, path, statusCode, duration, meta) {
        const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
        this[level](`HTTP ${method} ${path} ${statusCode}`, {
            type: 'http_response',
            method,
            path,
            statusCode,
            duration,
            ...meta,
        });
    }
    logQuery(query, duration, meta) {
        this.debug('Database query executed', {
            type: 'database_query',
            query: query.substring(0, 200),
            duration,
            ...meta,
        });
    }
    logExternalCall(service, endpoint, duration, success, meta) {
        const level = success ? 'info' : 'warn';
        this[level](`External API call to ${service}`, {
            type: 'external_api_call',
            service,
            endpoint,
            duration,
            success,
            ...meta,
        });
    }
    logJob(jobType, jobId, status, meta) {
        const level = status === 'failed' ? 'error' : 'info';
        this[level](`Job ${jobType} ${status}`, {
            type: 'job',
            jobType,
            jobId,
            status,
            ...meta,
        });
    }
    logAuth(event, userId, meta) {
        this.info(`Auth: ${event}`, {
            type: 'auth',
            event,
            userId,
            ...meta,
        });
    }
    logSecurity(event, severity, meta) {
        const level = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
        this[level](`Security: ${event}`, {
            type: 'security',
            event,
            severity,
            ...meta,
        });
    }
    static generateCorrelationId() {
        return (0, uuid_1.v4)();
    }
    getWinstonLogger() {
        return this.logger;
    }
}
exports.Logger = Logger;
exports.logger = new Logger({
    service: process.env.SERVICE_NAME || 'icon-radar',
    level: process.env.LOG_LEVEL || LogLevel.INFO,
    enableConsole: true,
    enableFile: process.env.NODE_ENV === 'production',
    fileDir: process.env.LOG_DIR || './logs',
    environment: process.env.NODE_ENV || 'development',
});
function createServiceLogger(serviceName) {
    return new Logger({
        service: serviceName,
        level: process.env.LOG_LEVEL || LogLevel.INFO,
        enableConsole: true,
        enableFile: process.env.NODE_ENV === 'production',
        fileDir: process.env.LOG_DIR || './logs',
        environment: process.env.NODE_ENV || 'development',
    });
}
exports.default = exports.logger;

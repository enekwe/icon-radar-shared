/**
 * Winston Logger
 * Structured logging with correlation IDs, transports, and child logger support
 */

import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

/**
 * Log Levels
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

/**
 * Logger Configuration Options
 */
export interface LoggerOptions {
  service: string;
  level?: LogLevel;
  enableConsole?: boolean;
  enableFile?: boolean;
  fileDir?: string;
  environment?: string;
}

/**
 * Log Metadata
 */
export interface LogMetadata {
  correlationId?: string;
  userId?: string;
  athleteId?: string;
  brandId?: string;
  duration?: number;
  error?: unknown;
  stack?: string;
  [key: string]: any;
}

/**
 * Custom log format for pretty printing in development
 */
const devFormat = winston.format.printf(({ level, message, timestamp, service, correlationId, ...metadata }) => {
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

/**
 * Production format - JSON for log aggregation
 */
const prodFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Development format - Pretty print for readability
 */
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.errors({ stack: true }),
  devFormat
);

/**
 * Create Winston logger instance
 */
export function createLogger(options: LoggerOptions): winston.Logger {
  const {
    service,
    level = LogLevel.INFO,
    enableConsole = true,
    enableFile = false,
    fileDir = './logs',
    environment = process.env.NODE_ENV || 'development',
  } = options;

  const transports: winston.transport[] = [];

  // Console transport
  if (enableConsole) {
    transports.push(
      new winston.transports.Console({
        format: environment === 'production' ? prodFormat : developmentFormat,
      })
    );
  }

  // File transports for production
  if (enableFile) {
    // Error log file
    transports.push(
      new winston.transports.File({
        filename: `${fileDir}/error.log`,
        level: 'error',
        format: prodFormat,
        maxsize: 10485760, // 10MB
        maxFiles: 5,
      })
    );

    // Combined log file
    transports.push(
      new winston.transports.File({
        filename: `${fileDir}/combined.log`,
        format: prodFormat,
        maxsize: 10485760, // 10MB
        maxFiles: 10,
      })
    );
  }

  return winston.createLogger({
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

/**
 * Logger Class with convenience methods
 */
export class Logger {
  private logger: winston.Logger;
  private defaultMeta: Record<string, any>;

  constructor(options: LoggerOptions) {
    this.logger = createLogger(options);
    this.defaultMeta = {};
  }

  /**
   * Create child logger with additional context
   */
  child(meta: Record<string, any>): Logger {
    const childLogger = new Logger({
      service: this.logger.defaultMeta?.service || 'app',
    });
    childLogger.logger = this.logger.child(meta);
    childLogger.defaultMeta = { ...this.defaultMeta, ...meta };
    return childLogger;
  }

  /**
   * Log error message with metadata
   */
  error(message: string, meta?: LogMetadata): void;
  /**
   * Log error message with error object (will be wrapped as { error })
   */
  error(message: string, error: unknown): void;
  error(message: string, metaOrError?: LogMetadata | unknown): void {
    // If meta is provided but doesn't look like LogMetadata (i.e., it's a plain error), wrap it
    const isLogMetadata = metaOrError && typeof metaOrError === 'object' && !Array.isArray(metaOrError) &&
                          ('correlationId' in metaOrError || 'userId' in metaOrError || 'athleteId' in metaOrError ||
                           'brandId' in metaOrError || 'duration' in metaOrError || 'error' in metaOrError || 'stack' in metaOrError);

    const metadata = isLogMetadata
      ? { ...this.defaultMeta, ...metaOrError as LogMetadata }
      : metaOrError !== undefined
        ? { ...this.defaultMeta, error: metaOrError }
        : this.defaultMeta;

    this.logger.error(message, metadata);
  }

  /**
   * Log warning message with metadata
   */
  warn(message: string, meta?: LogMetadata): void;
  /**
   * Log warning message with error object (will be wrapped as { error })
   */
  warn(message: string, error: unknown): void;
  warn(message: string, metaOrError?: LogMetadata | unknown): void {
    // If meta is provided but doesn't look like LogMetadata (i.e., it's a plain error), wrap it
    const isLogMetadata = metaOrError && typeof metaOrError === 'object' && !Array.isArray(metaOrError) &&
                          ('correlationId' in metaOrError || 'userId' in metaOrError || 'athleteId' in metaOrError ||
                           'brandId' in metaOrError || 'duration' in metaOrError || 'error' in metaOrError || 'stack' in metaOrError);

    const metadata = isLogMetadata
      ? { ...this.defaultMeta, ...metaOrError as LogMetadata }
      : metaOrError !== undefined
        ? { ...this.defaultMeta, error: metaOrError }
        : this.defaultMeta;

    this.logger.warn(message, metadata);
  }

  /**
   * Log info message
   */
  info(message: string, meta?: LogMetadata): void {
    this.logger.info(message, { ...this.defaultMeta, ...meta });
  }

  /**
   * Log debug message
   */
  debug(message: string, meta?: LogMetadata): void {
    this.logger.debug(message, { ...this.defaultMeta, ...meta });
  }

  /**
   * Log with correlation ID
   */
  withCorrelation(correlationId: string): Logger {
    return this.child({ correlationId });
  }

  /**
   * Log with user context
   */
  withUser(userId: string, email?: string): Logger {
    return this.child({ userId, email });
  }

  /**
   * Log HTTP request
   */
  logRequest(method: string, path: string, meta?: LogMetadata): void {
    this.info(`HTTP ${method} ${path}`, { type: 'http_request', method, path, ...meta });
  }

  /**
   * Log HTTP response
   */
  logResponse(method: string, path: string, statusCode: number, duration: number, meta?: LogMetadata): void {
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

  /**
   * Log database query
   */
  logQuery(query: string, duration: number, meta?: LogMetadata): void {
    this.debug('Database query executed', {
      type: 'database_query',
      query: query.substring(0, 200), // Truncate long queries
      duration,
      ...meta,
    });
  }

  /**
   * Log external API call
   */
  logExternalCall(service: string, endpoint: string, duration: number, success: boolean, meta?: LogMetadata): void {
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

  /**
   * Log job processing
   */
  logJob(jobType: string, jobId: string, status: string, meta?: LogMetadata): void {
    const level = status === 'failed' ? 'error' : 'info';
    this[level](`Job ${jobType} ${status}`, {
      type: 'job',
      jobType,
      jobId,
      status,
      ...meta,
    });
  }

  /**
   * Log authentication event
   */
  logAuth(event: string, userId?: string, meta?: LogMetadata): void {
    this.info(`Auth: ${event}`, {
      type: 'auth',
      event,
      userId,
      ...meta,
    });
  }

  /**
   * Log security event
   */
  logSecurity(event: string, severity: 'low' | 'medium' | 'high' | 'critical', meta?: LogMetadata): void {
    const level = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
    this[level](`Security: ${event}`, {
      type: 'security',
      event,
      severity,
      ...meta,
    });
  }

  /**
   * Generate correlation ID
   */
  static generateCorrelationId(): string {
    return uuidv4();
  }

  /**
   * Get underlying Winston logger
   */
  getWinstonLogger(): winston.Logger {
    return this.logger;
  }
}

/**
 * Default logger instance
 */
export const logger = new Logger({
  service: process.env.SERVICE_NAME || 'icon-radar',
  level: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
  enableConsole: true,
  enableFile: !!process.env.LOG_DIR, // Only enable file logging when LOG_DIR is explicitly set
  fileDir: process.env.LOG_DIR || './logs',
  environment: process.env.NODE_ENV || 'development',
});

/**
 * Create a logger for a specific service
 */
export function createServiceLogger(serviceName: string): Logger {
  return new Logger({
    service: serviceName,
    level: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
    enableConsole: true,
    enableFile: !!process.env.LOG_DIR, // Only enable file logging when LOG_DIR is explicitly set
    fileDir: process.env.LOG_DIR || './logs',
    environment: process.env.NODE_ENV || 'development',
  });
}

export default logger;

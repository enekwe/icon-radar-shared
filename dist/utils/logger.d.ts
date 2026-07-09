import winston from 'winston';
export declare enum LogLevel {
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    DEBUG = "debug"
}
export interface LoggerOptions {
    service: string;
    level?: LogLevel;
    enableConsole?: boolean;
    enableFile?: boolean;
    fileDir?: string;
    environment?: string;
}
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
export declare function createLogger(options: LoggerOptions): winston.Logger;
export declare class Logger {
    private logger;
    private defaultMeta;
    constructor(options: LoggerOptions);
    child(meta: Record<string, any>): Logger;
    error(message: string, meta?: LogMetadata): void;
    error(message: string, error: unknown): void;
    warn(message: string, meta?: LogMetadata): void;
    warn(message: string, error: unknown): void;
    info(message: string, meta?: LogMetadata): void;
    debug(message: string, meta?: LogMetadata): void;
    withCorrelation(correlationId: string): Logger;
    withUser(userId: string, email?: string): Logger;
    logRequest(method: string, path: string, meta?: LogMetadata): void;
    logResponse(method: string, path: string, statusCode: number, duration: number, meta?: LogMetadata): void;
    logQuery(query: string, duration: number, meta?: LogMetadata): void;
    logExternalCall(service: string, endpoint: string, duration: number, success: boolean, meta?: LogMetadata): void;
    logJob(jobType: string, jobId: string, status: string, meta?: LogMetadata): void;
    logAuth(event: string, userId?: string, meta?: LogMetadata): void;
    logSecurity(event: string, severity: 'low' | 'medium' | 'high' | 'critical', meta?: LogMetadata): void;
    static generateCorrelationId(): string;
    getWinstonLogger(): winston.Logger;
}
export declare const logger: Logger;
export declare function createServiceLogger(serviceName: string): Logger;
export default logger;
//# sourceMappingURL=logger.d.ts.map
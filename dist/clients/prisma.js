"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.createPrismaClient = createPrismaClient;
exports.transaction = transaction;
exports.query = query;
exports.isDatabaseHealthy = isDatabaseHealthy;
exports.disconnectDatabase = disconnectDatabase;
exports.setupDatabaseShutdownHandlers = setupDatabaseShutdownHandlers;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const errors_1 = require("../utils/errors");
class PrismaClientSingleton {
    static instance = null;
    static isConnected = false;
    static getInstance(config = {}) {
        if (!this.instance) {
            this.instance = this.createClient(config);
            this.setupEventHandlers(this.instance);
        }
        return this.instance;
    }
    static createClient(config) {
        const logLevel = config.logLevel || (process.env.NODE_ENV === 'production' ? 'warn' : 'info');
        return new client_1.PrismaClient({
            datasources: {
                db: {
                    url: config.datasourceUrl || process.env.DATABASE_URL,
                },
            },
            log: [
                { level: 'query', emit: 'event' },
                { level: logLevel, emit: 'stdout' },
                { level: 'error', emit: 'stdout' },
                { level: 'warn', emit: 'stdout' },
            ],
        });
    }
    static setupEventHandlers(client) {
        if (process.env.NODE_ENV !== 'production') {
            client.$on('query', (e) => {
                logger_1.logger.logQuery(e.query, e.duration, {
                    params: e.params,
                    target: e.target,
                });
            });
        }
        client.$connect().then(() => {
            this.isConnected = true;
            logger_1.logger.info('Prisma client connected to database', {
                service: process.env.SERVICE_NAME || 'unknown',
            });
        }).catch((error) => {
            this.isConnected = false;
            logger_1.logger.error('Failed to connect to database', {
                error: error.message,
                service: process.env.SERVICE_NAME || 'unknown',
            });
        });
    }
    static async isHealthy() {
        if (!this.instance)
            return false;
        try {
            await this.instance.$queryRaw `SELECT 1`;
            this.isConnected = true;
            return true;
        }
        catch (error) {
            this.isConnected = false;
            logger_1.logger.error('Database health check failed', {
                error: error instanceof Error ? error.message : String(error),
            });
            return false;
        }
    }
    static async disconnect() {
        if (this.instance) {
            await this.instance.$disconnect();
            this.isConnected = false;
            logger_1.logger.info('Prisma client disconnected from database');
        }
    }
    static async transaction(fn, correlationId) {
        const client = this.getInstance();
        try {
            const result = await client.$transaction(async (tx) => {
                return await fn(tx);
            }, {
                maxWait: 5000,
                timeout: 30000,
            });
            logger_1.logger.debug('Transaction completed successfully', { correlationId });
            return result;
        }
        catch (error) {
            logger_1.logger.error('Transaction failed', {
                correlationId,
                error: error instanceof Error ? error.message : String(error),
            });
            throw new errors_1.DatabaseError('Transaction failed', 'transaction', error, correlationId);
        }
    }
    static async query(fn, operation, correlationId) {
        const client = this.getInstance();
        const startTime = Date.now();
        try {
            const result = await fn(client);
            const duration = Date.now() - startTime;
            logger_1.logger.debug(`Database query completed: ${operation}`, {
                correlationId,
                duration,
                operation,
            });
            return result;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            logger_1.logger.error(`Database query failed: ${operation}`, {
                correlationId,
                duration,
                operation,
                error: error instanceof Error ? error.message : String(error),
            });
            throw new errors_1.DatabaseError(`Database operation failed: ${operation}`, operation, error, correlationId);
        }
    }
    static getConnectionStatus() {
        return this.isConnected;
    }
}
exports.prisma = PrismaClientSingleton.getInstance();
function createPrismaClient(config = {}) {
    return PrismaClientSingleton.getInstance(config);
}
async function transaction(fn, correlationId) {
    return PrismaClientSingleton.transaction(fn, correlationId);
}
async function query(fn, operation, correlationId) {
    return PrismaClientSingleton.query(fn, operation, correlationId);
}
async function isDatabaseHealthy() {
    return PrismaClientSingleton.isHealthy();
}
async function disconnectDatabase() {
    return PrismaClientSingleton.disconnect();
}
function setupDatabaseShutdownHandlers() {
    const shutdown = async (signal) => {
        logger_1.logger.info(`Received ${signal}, closing database connection...`);
        await disconnectDatabase();
        process.exit(0);
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('beforeExit', () => shutdown('beforeExit'));
}
exports.default = exports.prisma;

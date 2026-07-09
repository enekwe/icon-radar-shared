/**
 * Shared Prisma Client
 * Singleton Prisma client instance with connection pooling and error handling
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { DatabaseError } from '../utils/errors';

/**
 * Prisma Client Configuration
 */
interface PrismaConfig {
  datasourceUrl?: string;
  logLevel?: 'info' | 'warn' | 'error';
  connectionLimit?: number;
  queryTimeout?: number;
}

/**
 * Prisma Client Singleton
 */
class PrismaClientSingleton {
  private static instance: PrismaClient | null = null;
  private static isConnected = false;

  /**
   * Get Prisma client instance
   */
  public static getInstance(config: PrismaConfig = {}): PrismaClient {
    if (!this.instance) {
      this.instance = this.createClient(config);
      this.setupEventHandlers(this.instance);
    }
    return this.instance;
  }

  /**
   * Create new Prisma client
   */
  private static createClient(config: PrismaConfig): PrismaClient {
    const logLevel = config.logLevel || (process.env.NODE_ENV === 'production' ? 'warn' : 'info');

    return new PrismaClient({
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

  /**
   * Setup event handlers for logging and monitoring
   */
  private static setupEventHandlers(client: PrismaClient): void {
    // Log queries in development
    if (process.env.NODE_ENV !== 'production') {
      // @ts-ignore - Prisma query event
      client.$on('query', (e: any) => {
        logger.logQuery(e.query, e.duration, {
          params: e.params,
          target: e.target,
        });
      });
    }

    // Log connection events
    client.$connect().then(() => {
      this.isConnected = true;
      logger.info('Prisma client connected to database', {
        service: process.env.SERVICE_NAME || 'unknown',
      });
    }).catch((error) => {
      this.isConnected = false;
      logger.error('Failed to connect to database', {
        error: error.message,
        service: process.env.SERVICE_NAME || 'unknown',
      });
    });
  }

  /**
   * Check if connected to database
   */
  public static async isHealthy(): Promise<boolean> {
    if (!this.instance) return false;

    try {
      await this.instance.$queryRaw`SELECT 1`;
      this.isConnected = true;
      return true;
    } catch (error) {
      this.isConnected = false;
      logger.error('Database health check failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Disconnect from database
   */
  public static async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.$disconnect();
      this.isConnected = false;
      logger.info('Prisma client disconnected from database');
    }
  }

  /**
   * Execute transaction with error handling
   */
  public static async transaction<T>(
    fn: (prisma: PrismaClient) => Promise<T>,
    correlationId?: string
  ): Promise<T> {
    const client = this.getInstance();

    try {
      const result = await client.$transaction(
        async (tx) => {
          return await fn(tx as PrismaClient);
        },
        {
          maxWait: 5000, // Wait max 5s for transaction to start
          timeout: 30000, // Transaction timeout 30s
        }
      );

      logger.debug('Transaction completed successfully', { correlationId });
      return result;
    } catch (error) {
      logger.error('Transaction failed', {
        correlationId,
        error: error instanceof Error ? error.message : String(error),
      });

      throw new DatabaseError(
        'Transaction failed',
        'transaction',
        error,
        correlationId
      );
    }
  }

  /**
   * Execute query with error handling
   */
  public static async query<T>(
    fn: (prisma: PrismaClient) => Promise<T>,
    operation: string,
    correlationId?: string
  ): Promise<T> {
    const client = this.getInstance();
    const startTime = Date.now();

    try {
      const result = await fn(client);
      const duration = Date.now() - startTime;

      logger.debug(`Database query completed: ${operation}`, {
        correlationId,
        duration,
        operation,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      logger.error(`Database query failed: ${operation}`, {
        correlationId,
        duration,
        operation,
        error: error instanceof Error ? error.message : String(error),
      });

      throw new DatabaseError(
        `Database operation failed: ${operation}`,
        operation,
        error,
        correlationId
      );
    }
  }

  /**
   * Get connection status
   */
  public static getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

/**
 * Default Prisma client instance
 */
export const prisma = PrismaClientSingleton.getInstance();

/**
 * Create Prisma client with custom configuration
 */
export function createPrismaClient(config: PrismaConfig = {}): PrismaClient {
  return PrismaClientSingleton.getInstance(config);
}

/**
 * Execute database transaction
 */
export async function transaction<T>(
  fn: (prisma: PrismaClient) => Promise<T>,
  correlationId?: string
): Promise<T> {
  return PrismaClientSingleton.transaction(fn, correlationId);
}

/**
 * Execute database query with error handling
 */
export async function query<T>(
  fn: (prisma: PrismaClient) => Promise<T>,
  operation: string,
  correlationId?: string
): Promise<T> {
  return PrismaClientSingleton.query(fn, operation, correlationId);
}

/**
 * Check database health
 */
export async function isDatabaseHealthy(): Promise<boolean> {
  return PrismaClientSingleton.isHealthy();
}

/**
 * Disconnect from database
 */
export async function disconnectDatabase(): Promise<void> {
  return PrismaClientSingleton.disconnect();
}

/**
 * Graceful shutdown handler
 */
export function setupDatabaseShutdownHandlers(): void {
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, closing database connection...`);
    await disconnectDatabase();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('beforeExit', () => shutdown('beforeExit'));
}

export default prisma;

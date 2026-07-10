import { PrismaClient } from '@prisma/client';
interface PrismaConfig {
    datasourceUrl?: string;
    logLevel?: 'info' | 'warn' | 'error';
    connectionLimit?: number;
    queryTimeout?: number;
}
export declare class PrismaClientSingleton {
    private static instance;
    private static isConnected;
    static getInstance(config?: PrismaConfig): PrismaClient;
    private static createClient;
    private static setupEventHandlers;
    static isHealthy(): Promise<boolean>;
    static disconnect(): Promise<void>;
    static transaction<T>(fn: (prisma: PrismaClient) => Promise<T>, correlationId?: string): Promise<T>;
    static query<T>(fn: (prisma: PrismaClient) => Promise<T>, operation: string, correlationId?: string): Promise<T>;
    static getConnectionStatus(): boolean;
}
export declare function createPrismaClient(config?: PrismaConfig): PrismaClient;
export declare function transaction<T>(fn: (prisma: PrismaClient) => Promise<T>, correlationId?: string): Promise<T>;
export declare function query<T>(fn: (prisma: PrismaClient) => Promise<T>, operation: string, correlationId?: string): Promise<T>;
export declare function isDatabaseHealthy(): Promise<boolean>;
export declare function disconnectDatabase(): Promise<void>;
export declare function setupDatabaseShutdownHandlers(): void;
export {};
//# sourceMappingURL=prisma.d.ts.map
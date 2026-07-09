import { PrismaClient } from '@prisma/client';
interface PrismaConfig {
    datasourceUrl?: string;
    logLevel?: 'info' | 'warn' | 'error';
    connectionLimit?: number;
    queryTimeout?: number;
}
export declare const prisma: any;
export declare function createPrismaClient(config?: PrismaConfig): PrismaClient;
export declare function transaction<T>(fn: (prisma: PrismaClient) => Promise<T>, correlationId?: string): Promise<T>;
export declare function query<T>(fn: (prisma: PrismaClient) => Promise<T>, operation: string, correlationId?: string): Promise<T>;
export declare function isDatabaseHealthy(): Promise<boolean>;
export declare function disconnectDatabase(): Promise<void>;
export declare function setupDatabaseShutdownHandlers(): void;
export default prisma;
//# sourceMappingURL=prisma.d.ts.map
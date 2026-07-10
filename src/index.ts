/**
 * @enekwe/icon-radar-shared
 * Shared library for Icon Radar microservices
 *
 * This package provides common types, utilities, middleware, and clients
 * used across all Icon Radar microservices.
 */

// Export all modules
export * from './types';
export * from './utils';
export * from './middleware';
export * from './clients';
export * from './config';

// Re-export commonly used items for convenience
export { logger, createServiceLogger, Logger, LogLevel } from './utils/logger';
// Export Prisma utilities but not an instance - services should create their own
export {
  PrismaClientSingleton,
  createPrismaClient,
  transaction,
  query,
  isDatabaseHealthy,
  disconnectDatabase,
  setupDatabaseShutdownHandlers
} from './clients/prisma';
export { ServiceClient, createServiceClient } from './clients/ServiceClient';

// Error classes
export {
  ApiError,
  BadRequestError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  ExternalAPIError,
  DatabaseError,
  ErrorFactory,
} from './utils/errors';

// Validators
export {
  Validators,
  UserSchemas,
  AthleteSchemas,
  BrandSchemas,
  RelationshipSchemas,
  JobSchemas,
  SearchSchemas,
  AnalyticsSchemas,
  validate,
  safeValidate,
  transformZodErrors,
} from './utils/validators';

// Middleware
export {
  requireAuth,
  requireRole,
  optionalAuth,
  requireServiceAuth,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from './middleware/auth';

export {
  validateBody,
  validateQuery,
  validateParams,
  validateMultiple,
  validatePagination,
  validateId,
} from './middleware/validation';

export {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  setupErrorHandlers,
} from './middleware/errorHandler';

export {
  cors,
  devCors,
  prodCors,
  envCors,
  autoCors,
} from './middleware/cors';

export { correlationId } from './middleware/correlationId';
export { requestLogger } from './middleware/requestLogger';

// Helper functions
export {
  generateUUID,
  retry,
  calculatePagination,
  parsePaginationParams,
  getPaginationOffset,
  slugify,
  pick,
  omit,
  groupBy,
  unique,
  chunk,
  formatNumber,
  formatCurrency,
  formatPercentage,
  isWithinLast24Hours,
  sleep,
  delay,
} from './utils/helpers';

// Constants
export {
  HTTP_STATUS,
  SERVICE_NAMES,
  SERVICE_PORTS,
  ROLES,
  JOB_TYPES,
  JOB_STATUSES,
  ATHLETE_STATUSES,
  BRAND_STATUSES,
  RELATIONSHIP_TYPES,
  VERIFICATION_STATUSES,
  METRIC_TYPES,
  CACHE_TTL,
  PAGINATION,
  JWT,
  CIRCUIT_BREAKER,
  RETRY,
  TIMEOUTS,
  ERROR_CODES,
  HEALTH_STATUS,
  DEFAULT_CONFIG,
  getEnv,
  requireEnv,
  isProduction,
  isDevelopment,
  isTest,
} from './config/constants';

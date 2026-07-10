/**
 * Shared Constants
 * Application-wide constants and configuration values
 */

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

/**
 * API Versions
 */
export const API_VERSION = {
  V1: 'v1',
  CURRENT: 'v1',
} as const;

/**
 * Service Names
 */
export const SERVICE_NAMES = {
  API_GATEWAY: 'icon-radar-api-gateway',
  AUTH_SERVICE: 'icon-radar-auth-service',
  ATHLETE_SERVICE: 'icon-radar-athlete-service',
  BRAND_SERVICE: 'icon-radar-brand-service',
  ANALYTICS_SERVICE: 'icon-radar-analytics-service',
  SEARCH_SERVICE: 'icon-radar-search-service',
  UPLOAD_SERVICE: 'icon-radar-upload-service',
  JOB_SERVICE: 'icon-radar-job-service',
  EXTERNAL_APIS: 'icon-radar-external-apis',
  AI_AGENTS: 'icon-radar-ai-agents',
} as const;

/**
 * Service Ports (local development)
 * In production on Railway, each service gets its own URL via env vars.
 * Athlete, Brand, Analytics, Search, Upload, and Auth are all handled
 * by the main backend service. They were previously separate
 * microservices on ports 3002-3006 but have been consolidated.
 */
export const SERVICE_PORTS = {
  API_GATEWAY: 3000,
  BACKEND: 3001,        // Main backend handles: auth, athletes, brands, analytics, search, upload
  JOB_SERVICE: 3007,
  EXTERNAL_APIS: 3008,
  AI_AGENTS: 3009,
} as const;

/**
 * Production Service URLs (Railway)
 * Used as fallback defaults when env vars are not set
 */
export const PRODUCTION_SERVICE_URLS = {
  BACKEND: 'https://api.radar.passbook.vc',
  JOB_SERVICE: 'https://icon-radar-job-service.up.railway.app',
  AI_AGENTS: 'https://icon-radar-ai-agents.up.railway.app',
  EXTERNAL_APIS: 'https://icon-radar-external-apis.up.railway.app',
} as const;

/**
 * User Roles
 */
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  VIEWER: 'viewer',
} as const;

/**
 * Job Types
 */
export const JOB_TYPES = {
  BRAND_DISCOVERY: 'brand-discovery',
  VERIFICATION: 'verification',
  METRICS_COLLECTION: 'metrics-collection',
  SCORING: 'scoring',
  PIPELINE: 'pipeline',
} as const;

/**
 * Job Statuses
 */
export const JOB_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

/**
 * Job Priorities
 */
export const JOB_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

/**
 * Athlete Statuses
 */
export const ATHLETE_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  RETIRED: 'retired',
} as const;

/**
 * Brand Statuses
 */
export const BRAND_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

/**
 * Relationship Types
 */
export const RELATIONSHIP_TYPES = {
  OWNER: 'OWNER',
  FOUNDER: 'FOUNDER',
  CO_FOUNDER: 'CO_FOUNDER',
  INVESTOR: 'INVESTOR',
  ENDORSER: 'ENDORSER',
} as const;

/**
 * Verification Statuses
 */
export const VERIFICATION_STATUSES = {
  UNVERIFIED: 'UNVERIFIED',
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
} as const;

/**
 * Metric Types
 */
export const METRIC_TYPES = {
  INSTAGRAM_FOLLOWERS: 'instagram_followers',
  INSTAGRAM_ENGAGEMENT: 'instagram_engagement',
  TIKTOK_FOLLOWERS: 'tiktok_followers',
  TIKTOK_VIEWS: 'tiktok_views',
  LINKEDIN_FOLLOWERS: 'linkedin_followers',
  WEB_TRAFFIC: 'web_traffic',
  REVENUE: 'revenue',
  VALUATION: 'valuation',
  FUNDING: 'funding',
  EMPLOYEE_COUNT: 'employee_count',
} as const;

/**
 * Cache TTL (milliseconds)
 */
export const CACHE_TTL = {
  SHORT: 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 60 * 60 * 1000, // 1 hour
  DAY: 24 * 60 * 60 * 1000, // 24 hours
} as const;

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_SORT: 'createdAt',
  DEFAULT_ORDER: 'desc',
} as const;

/**
 * Rate Limiting
 */
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  SKIP_SUCCESSFUL_REQUESTS: false,
} as const;

/**
 * JWT Configuration
 */
export const JWT = {
  ACCESS_TOKEN_EXPIRES_IN: '24h',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  ALGORITHM: 'HS256',
} as const;

/**
 * File Upload Configuration
 */
export const UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_MIME_TYPES: ['text/csv', 'application/vnd.ms-excel'],
  ALLOWED_EXTENSIONS: ['.csv'],
} as const;

/**
 * Circuit Breaker Configuration
 */
export const CIRCUIT_BREAKER = {
  FAILURE_THRESHOLD: 5,
  SUCCESS_THRESHOLD: 2,
  TIMEOUT: 60000, // 1 minute
} as const;

/**
 * Retry Configuration
 */
export const RETRY = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY: 1000, // 1 second
  MAX_DELAY: 10000, // 10 seconds
  FACTOR: 2,
} as const;

/**
 * External API Timeouts (milliseconds)
 */
export const TIMEOUTS = {
  HTTP_REQUEST: 10000, // 10 seconds
  DATABASE_QUERY: 30000, // 30 seconds
  EXTERNAL_API: 15000, // 15 seconds
  JOB_PROCESSING: 300000, // 5 minutes
} as const;

/**
 * Log Levels
 */
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;

/**
 * Environments
 */
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

/**
 * Event Names
 */
export const EVENTS = {
  ATHLETE_CREATED: 'athlete.created',
  ATHLETE_UPDATED: 'athlete.updated',
  ATHLETE_DELETED: 'athlete.deleted',
  BRAND_DISCOVERED: 'brand.discovered',
  BRAND_VERIFIED: 'brand.verified',
  METRICS_COLLECTED: 'metrics.collected',
  CHAMPION_INDEX_CALCULATED: 'championindex.calculated',
  JOB_COMPLETED: 'job.completed',
  JOB_FAILED: 'job.failed',
} as const;

/**
 * Queue Names
 */
export const QUEUES = {
  BRAND_DISCOVERY: 'brand-discovery-queue',
  VERIFICATION: 'verification-queue',
  METRICS: 'metrics-queue',
  SCORING: 'scoring-queue',
  PIPELINE: 'pipeline-queue',
} as const;

/**
 * Error Codes
 */
export const ERROR_CODES = {
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  BAD_GATEWAY: 'BAD_GATEWAY',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  CIRCUIT_BREAKER_OPEN: 'CIRCUIT_BREAKER_OPEN',
  TOKEN_ERROR: 'TOKEN_ERROR',
} as const;

/**
 * Health Check Status
 */
export const HEALTH_STATUS = {
  HEALTHY: 'healthy',
  UNHEALTHY: 'unhealthy',
  DEGRADED: 'degraded',
} as const;

/**
 * Default Configuration
 */
export const DEFAULT_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT,
  SERVICE_NAME: process.env.SERVICE_NAME || 'icon-radar',
  PORT: parseInt(process.env.PORT || '3000', 10),
  LOG_LEVEL: process.env.LOG_LEVEL || LOG_LEVELS.INFO,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  SERVICE_API_KEY: process.env.SERVICE_API_KEY,
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || ['*'],
} as const;

/**
 * Get environment variable with fallback
 */
export function getEnv(key: string, fallback = ''): string {
  return process.env[key] || fallback;
}

/**
 * Get required environment variable (throws if not set)
 */
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION;
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT;
}

/**
 * Check if running in test
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === ENVIRONMENTS.TEST;
}

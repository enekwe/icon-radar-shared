"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = exports.HEALTH_STATUS = exports.ERROR_CODES = exports.QUEUES = exports.EVENTS = exports.ENVIRONMENTS = exports.LOG_LEVELS = exports.TIMEOUTS = exports.RETRY = exports.CIRCUIT_BREAKER = exports.UPLOAD = exports.JWT = exports.RATE_LIMIT = exports.PAGINATION = exports.CACHE_TTL = exports.METRIC_TYPES = exports.VERIFICATION_STATUSES = exports.RELATIONSHIP_TYPES = exports.BRAND_STATUSES = exports.ATHLETE_STATUSES = exports.JOB_PRIORITIES = exports.JOB_STATUSES = exports.JOB_TYPES = exports.ROLES = exports.SERVICE_PORTS = exports.SERVICE_NAMES = exports.API_VERSION = exports.HTTP_STATUS = void 0;
exports.getEnv = getEnv;
exports.requireEnv = requireEnv;
exports.isProduction = isProduction;
exports.isDevelopment = isDevelopment;
exports.isTest = isTest;
exports.HTTP_STATUS = {
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
};
exports.API_VERSION = {
    V1: 'v1',
    CURRENT: 'v1',
};
exports.SERVICE_NAMES = {
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
};
exports.SERVICE_PORTS = {
    API_GATEWAY: 3000,
    AUTH_SERVICE: 3001,
    ATHLETE_SERVICE: 3002,
    BRAND_SERVICE: 3003,
    ANALYTICS_SERVICE: 3004,
    SEARCH_SERVICE: 3005,
    UPLOAD_SERVICE: 3006,
    JOB_SERVICE: 3007,
    EXTERNAL_APIS: 3008,
    AI_AGENTS: 3009,
};
exports.ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    VIEWER: 'viewer',
};
exports.JOB_TYPES = {
    BRAND_DISCOVERY: 'brand-discovery',
    VERIFICATION: 'verification',
    METRICS_COLLECTION: 'metrics-collection',
    SCORING: 'scoring',
    PIPELINE: 'pipeline',
};
exports.JOB_STATUSES = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
};
exports.JOB_PRIORITIES = {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    CRITICAL: 'critical',
};
exports.ATHLETE_STATUSES = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    RETIRED: 'retired',
};
exports.BRAND_STATUSES = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    ARCHIVED: 'archived',
};
exports.RELATIONSHIP_TYPES = {
    OWNER: 'OWNER',
    FOUNDER: 'FOUNDER',
    CO_FOUNDER: 'CO_FOUNDER',
    INVESTOR: 'INVESTOR',
    ENDORSER: 'ENDORSER',
};
exports.VERIFICATION_STATUSES = {
    UNVERIFIED: 'UNVERIFIED',
    PENDING: 'PENDING',
    VERIFIED: 'VERIFIED',
    REJECTED: 'REJECTED',
};
exports.METRIC_TYPES = {
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
};
exports.CACHE_TTL = {
    SHORT: 60 * 1000,
    MEDIUM: 5 * 60 * 1000,
    LONG: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
};
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    DEFAULT_SORT: 'createdAt',
    DEFAULT_ORDER: 'desc',
};
exports.RATE_LIMIT = {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 100,
    SKIP_SUCCESSFUL_REQUESTS: false,
};
exports.JWT = {
    ACCESS_TOKEN_EXPIRES_IN: '24h',
    REFRESH_TOKEN_EXPIRES_IN: '7d',
    ALGORITHM: 'HS256',
};
exports.UPLOAD = {
    MAX_FILE_SIZE: 10 * 1024 * 1024,
    ALLOWED_MIME_TYPES: ['text/csv', 'application/vnd.ms-excel'],
    ALLOWED_EXTENSIONS: ['.csv'],
};
exports.CIRCUIT_BREAKER = {
    FAILURE_THRESHOLD: 5,
    SUCCESS_THRESHOLD: 2,
    TIMEOUT: 60000,
};
exports.RETRY = {
    MAX_ATTEMPTS: 3,
    INITIAL_DELAY: 1000,
    MAX_DELAY: 10000,
    FACTOR: 2,
};
exports.TIMEOUTS = {
    HTTP_REQUEST: 10000,
    DATABASE_QUERY: 30000,
    EXTERNAL_API: 15000,
    JOB_PROCESSING: 300000,
};
exports.LOG_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
};
exports.ENVIRONMENTS = {
    DEVELOPMENT: 'development',
    STAGING: 'staging',
    PRODUCTION: 'production',
    TEST: 'test',
};
exports.EVENTS = {
    ATHLETE_CREATED: 'athlete.created',
    ATHLETE_UPDATED: 'athlete.updated',
    ATHLETE_DELETED: 'athlete.deleted',
    BRAND_DISCOVERED: 'brand.discovered',
    BRAND_VERIFIED: 'brand.verified',
    METRICS_COLLECTED: 'metrics.collected',
    CHAMPION_INDEX_CALCULATED: 'championindex.calculated',
    JOB_COMPLETED: 'job.completed',
    JOB_FAILED: 'job.failed',
};
exports.QUEUES = {
    BRAND_DISCOVERY: 'brand-discovery-queue',
    VERIFICATION: 'verification-queue',
    METRICS: 'metrics-queue',
    SCORING: 'scoring-queue',
    PIPELINE: 'pipeline-queue',
};
exports.ERROR_CODES = {
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
};
exports.HEALTH_STATUS = {
    HEALTHY: 'healthy',
    UNHEALTHY: 'unhealthy',
    DEGRADED: 'degraded',
};
exports.DEFAULT_CONFIG = {
    NODE_ENV: process.env.NODE_ENV || exports.ENVIRONMENTS.DEVELOPMENT,
    SERVICE_NAME: process.env.SERVICE_NAME || 'icon-radar',
    PORT: parseInt(process.env.PORT || '3000', 10),
    LOG_LEVEL: process.env.LOG_LEVEL || exports.LOG_LEVELS.INFO,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    SERVICE_API_KEY: process.env.SERVICE_API_KEY,
    CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || ['*'],
};
function getEnv(key, fallback = '') {
    return process.env[key] || fallback;
}
function requireEnv(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Required environment variable ${key} is not set`);
    }
    return value;
}
function isProduction() {
    return process.env.NODE_ENV === exports.ENVIRONMENTS.PRODUCTION;
}
function isDevelopment() {
    return process.env.NODE_ENV === exports.ENVIRONMENTS.DEVELOPMENT;
}
function isTest() {
    return process.env.NODE_ENV === exports.ENVIRONMENTS.TEST;
}

export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly BAD_GATEWAY: 502;
    readonly SERVICE_UNAVAILABLE: 503;
    readonly GATEWAY_TIMEOUT: 504;
};
export declare const API_VERSION: {
    readonly V1: "v1";
    readonly CURRENT: "v1";
};
export declare const SERVICE_NAMES: {
    readonly API_GATEWAY: "icon-radar-api-gateway";
    readonly AUTH_SERVICE: "icon-radar-auth-service";
    readonly ATHLETE_SERVICE: "icon-radar-athlete-service";
    readonly BRAND_SERVICE: "icon-radar-brand-service";
    readonly ANALYTICS_SERVICE: "icon-radar-analytics-service";
    readonly SEARCH_SERVICE: "icon-radar-search-service";
    readonly UPLOAD_SERVICE: "icon-radar-upload-service";
    readonly JOB_SERVICE: "icon-radar-job-service";
    readonly EXTERNAL_APIS: "icon-radar-external-apis";
    readonly AI_AGENTS: "icon-radar-ai-agents";
};
export declare const SERVICE_PORTS: {
    readonly API_GATEWAY: 3000;
    readonly AUTH_SERVICE: 3001;
    readonly ATHLETE_SERVICE: 3002;
    readonly BRAND_SERVICE: 3003;
    readonly ANALYTICS_SERVICE: 3004;
    readonly SEARCH_SERVICE: 3005;
    readonly UPLOAD_SERVICE: 3006;
    readonly JOB_SERVICE: 3007;
    readonly EXTERNAL_APIS: 3008;
    readonly AI_AGENTS: 3009;
};
export declare const ROLES: {
    readonly ADMIN: "admin";
    readonly USER: "user";
    readonly VIEWER: "viewer";
};
export declare const JOB_TYPES: {
    readonly BRAND_DISCOVERY: "brand-discovery";
    readonly VERIFICATION: "verification";
    readonly METRICS_COLLECTION: "metrics-collection";
    readonly SCORING: "scoring";
    readonly PIPELINE: "pipeline";
};
export declare const JOB_STATUSES: {
    readonly PENDING: "pending";
    readonly PROCESSING: "processing";
    readonly COMPLETED: "completed";
    readonly FAILED: "failed";
    readonly CANCELLED: "cancelled";
};
export declare const JOB_PRIORITIES: {
    readonly LOW: "low";
    readonly NORMAL: "normal";
    readonly HIGH: "high";
    readonly CRITICAL: "critical";
};
export declare const ATHLETE_STATUSES: {
    readonly ACTIVE: "active";
    readonly INACTIVE: "inactive";
    readonly RETIRED: "retired";
};
export declare const BRAND_STATUSES: {
    readonly ACTIVE: "active";
    readonly INACTIVE: "inactive";
    readonly ARCHIVED: "archived";
};
export declare const RELATIONSHIP_TYPES: {
    readonly OWNER: "OWNER";
    readonly FOUNDER: "FOUNDER";
    readonly CO_FOUNDER: "CO_FOUNDER";
    readonly INVESTOR: "INVESTOR";
    readonly ENDORSER: "ENDORSER";
};
export declare const VERIFICATION_STATUSES: {
    readonly UNVERIFIED: "UNVERIFIED";
    readonly PENDING: "PENDING";
    readonly VERIFIED: "VERIFIED";
    readonly REJECTED: "REJECTED";
};
export declare const METRIC_TYPES: {
    readonly INSTAGRAM_FOLLOWERS: "instagram_followers";
    readonly INSTAGRAM_ENGAGEMENT: "instagram_engagement";
    readonly TIKTOK_FOLLOWERS: "tiktok_followers";
    readonly TIKTOK_VIEWS: "tiktok_views";
    readonly LINKEDIN_FOLLOWERS: "linkedin_followers";
    readonly WEB_TRAFFIC: "web_traffic";
    readonly REVENUE: "revenue";
    readonly VALUATION: "valuation";
    readonly FUNDING: "funding";
    readonly EMPLOYEE_COUNT: "employee_count";
};
export declare const CACHE_TTL: {
    readonly SHORT: number;
    readonly MEDIUM: number;
    readonly LONG: number;
    readonly DAY: number;
};
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 20;
    readonly MAX_LIMIT: 100;
    readonly DEFAULT_SORT: "createdAt";
    readonly DEFAULT_ORDER: "desc";
};
export declare const RATE_LIMIT: {
    readonly WINDOW_MS: number;
    readonly MAX_REQUESTS: 100;
    readonly SKIP_SUCCESSFUL_REQUESTS: false;
};
export declare const JWT: {
    readonly ACCESS_TOKEN_EXPIRES_IN: "24h";
    readonly REFRESH_TOKEN_EXPIRES_IN: "7d";
    readonly ALGORITHM: "HS256";
};
export declare const UPLOAD: {
    readonly MAX_FILE_SIZE: number;
    readonly ALLOWED_MIME_TYPES: readonly ["text/csv", "application/vnd.ms-excel"];
    readonly ALLOWED_EXTENSIONS: readonly [".csv"];
};
export declare const CIRCUIT_BREAKER: {
    readonly FAILURE_THRESHOLD: 5;
    readonly SUCCESS_THRESHOLD: 2;
    readonly TIMEOUT: 60000;
};
export declare const RETRY: {
    readonly MAX_ATTEMPTS: 3;
    readonly INITIAL_DELAY: 1000;
    readonly MAX_DELAY: 10000;
    readonly FACTOR: 2;
};
export declare const TIMEOUTS: {
    readonly HTTP_REQUEST: 10000;
    readonly DATABASE_QUERY: 30000;
    readonly EXTERNAL_API: 15000;
    readonly JOB_PROCESSING: 300000;
};
export declare const LOG_LEVELS: {
    readonly ERROR: "error";
    readonly WARN: "warn";
    readonly INFO: "info";
    readonly DEBUG: "debug";
};
export declare const ENVIRONMENTS: {
    readonly DEVELOPMENT: "development";
    readonly STAGING: "staging";
    readonly PRODUCTION: "production";
    readonly TEST: "test";
};
export declare const EVENTS: {
    readonly ATHLETE_CREATED: "athlete.created";
    readonly ATHLETE_UPDATED: "athlete.updated";
    readonly ATHLETE_DELETED: "athlete.deleted";
    readonly BRAND_DISCOVERED: "brand.discovered";
    readonly BRAND_VERIFIED: "brand.verified";
    readonly METRICS_COLLECTED: "metrics.collected";
    readonly CHAMPION_INDEX_CALCULATED: "championindex.calculated";
    readonly JOB_COMPLETED: "job.completed";
    readonly JOB_FAILED: "job.failed";
};
export declare const QUEUES: {
    readonly BRAND_DISCOVERY: "brand-discovery-queue";
    readonly VERIFICATION: "verification-queue";
    readonly METRICS: "metrics-queue";
    readonly SCORING: "scoring-queue";
    readonly PIPELINE: "pipeline-queue";
};
export declare const ERROR_CODES: {
    readonly BAD_REQUEST: "BAD_REQUEST";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly CONFLICT: "CONFLICT";
    readonly UNPROCESSABLE_ENTITY: "UNPROCESSABLE_ENTITY";
    readonly TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS";
    readonly INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR";
    readonly BAD_GATEWAY: "BAD_GATEWAY";
    readonly SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE";
    readonly GATEWAY_TIMEOUT: "GATEWAY_TIMEOUT";
    readonly EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR";
    readonly DATABASE_ERROR: "DATABASE_ERROR";
    readonly CIRCUIT_BREAKER_OPEN: "CIRCUIT_BREAKER_OPEN";
    readonly TOKEN_ERROR: "TOKEN_ERROR";
};
export declare const HEALTH_STATUS: {
    readonly HEALTHY: "healthy";
    readonly UNHEALTHY: "unhealthy";
    readonly DEGRADED: "degraded";
};
export declare const DEFAULT_CONFIG: {
    readonly NODE_ENV: string;
    readonly SERVICE_NAME: string;
    readonly PORT: number;
    readonly LOG_LEVEL: string;
    readonly DATABASE_URL: string | undefined;
    readonly REDIS_URL: string | undefined;
    readonly JWT_SECRET: string | undefined;
    readonly JWT_REFRESH_SECRET: string | undefined;
    readonly SERVICE_API_KEY: string | undefined;
    readonly CORS_ORIGINS: string[];
};
export declare function getEnv(key: string, fallback?: string): string;
export declare function requireEnv(key: string): string;
export declare function isProduction(): boolean;
export declare function isDevelopment(): boolean;
export declare function isTest(): boolean;
//# sourceMappingURL=constants.d.ts.map
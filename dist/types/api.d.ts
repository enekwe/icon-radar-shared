import { Request as ExpressRequest } from 'express';
import { UserContext } from './user';
import { Pagination, ServiceResponse, ErrorResponse } from './common';
export interface AuthenticatedRequest extends ExpressRequest {
    user?: UserContext;
    correlationId?: string;
}
export interface ApiSuccessResponse<T = any> extends ServiceResponse<T> {
    success: true;
    data: T;
    message?: string;
    meta?: Pagination;
}
export interface ApiErrorResponse extends ErrorResponse {
    success: false;
    error: string;
    errors?: Array<{
        field: string;
        message: string;
    }>;
    code?: string;
    correlationId?: string;
}
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
export interface HealthCheckResponse {
    status: 'healthy' | 'unhealthy' | 'degraded';
    service: string;
    timestamp: string;
    uptime: number;
    checks: {
        database?: HealthCheckStatus;
        redis?: HealthCheckStatus;
        memory?: MemoryUsage;
    };
}
export interface HealthCheckStatus {
    status: 'healthy' | 'unhealthy';
    message?: string;
    latency?: number;
}
export interface MemoryUsage {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
}
export interface ServiceRequestOptions {
    correlationId?: string;
    token?: string;
    timeout?: number;
    cache?: boolean;
    cacheTTL?: number;
    retry?: boolean;
    retryCount?: number;
    headers?: Record<string, string>;
}
export interface SearchRequest {
    query: string;
    type?: 'all' | 'athletes' | 'brands';
    limit?: number;
    offset?: number;
}
export interface SearchResult {
    type: 'athlete' | 'brand';
    id: string;
    name: string;
    description?: string;
    relevance: number;
    metadata?: Record<string, any>;
}
export interface UploadSession {
    id: string;
    userId: string;
    filename: string;
    status: 'uploading' | 'processing' | 'completed' | 'failed';
    recordsTotal: number;
    recordsProcessed: number;
    recordsSuccess: number;
    recordsFailed: number;
    errors: Array<{
        row: number;
        field: string;
        message: string;
    }>;
    createdAt: Date;
    completedAt?: Date;
}
export interface JobRequest {
    type: string;
    payload: Record<string, any>;
    priority?: 'low' | 'normal' | 'high' | 'critical';
    userId?: string;
}
export interface JobResponse {
    id: string;
    type: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    payload: Record<string, any>;
    result?: Record<string, any>;
    error?: string;
    attempts: number;
    progress?: number;
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
}
export interface AnalyticsParams {
    startDate?: Date | string;
    endDate?: Date | string;
    athleteId?: string;
    brandId?: string;
    category?: string;
    sport?: string;
    granularity?: 'day' | 'week' | 'month' | 'year';
}
export interface TrendDataPoint {
    date: Date | string;
    value: number;
    label?: string;
    metadata?: Record<string, any>;
}
export interface ComparisonData {
    entity: string;
    values: Record<string, number>;
    metadata?: Record<string, any>;
}
export interface ExternalApiResponse<T = any> {
    data: T;
    source: string;
    cached: boolean;
    timestamp: Date;
    requestId: string;
}
export interface WebhookPayload {
    event: string;
    timestamp: Date;
    data: Record<string, any>;
    correlationId?: string;
}
//# sourceMappingURL=api.d.ts.map
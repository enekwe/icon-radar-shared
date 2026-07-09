export type Role = 'admin' | 'user' | 'viewer';
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type JobType = 'brand-discovery' | 'verification' | 'metrics-collection' | 'scoring' | 'pipeline';
export type RelationshipType = 'OWNER' | 'FOUNDER' | 'CO_FOUNDER' | 'INVESTOR' | 'ENDORSER';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type AthleteStatus = 'active' | 'inactive' | 'retired';
export type BrandStatus = 'active' | 'inactive' | 'archived';
export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
}
export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}
export interface Timestamps {
    createdAt: Date;
    updatedAt: Date;
}
export interface SoftDelete {
    isArchived: boolean;
    archivedAt?: Date | null;
}
export interface SocialHandles {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    linkedin?: string;
    facebook?: string;
}
export interface ConfidenceScore {
    overall: number;
    sources: Array<{
        source: string;
        score: number;
        weight: number;
    }>;
}
export interface JobPayload {
    athleteId?: string;
    brandId?: string;
    userId?: string;
    priority?: 'low' | 'normal' | 'high' | 'critical';
    correlationId?: string;
    metadata?: Record<string, any>;
}
export interface JobResult {
    success: boolean;
    data?: any;
    error?: string;
    duration?: number;
    processedAt?: Date;
}
export interface ServiceResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    meta?: Pagination;
}
export interface ErrorResponse {
    success: false;
    error: string;
    errors?: Array<{
        field: string;
        message: string;
    }>;
    code?: string;
    correlationId?: string;
}
//# sourceMappingURL=common.d.ts.map
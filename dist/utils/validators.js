"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadSchemas = exports.AnalyticsSchemas = exports.SearchSchemas = exports.JobSchemas = exports.RelationshipSchemas = exports.BrandSchemas = exports.AthleteSchemas = exports.UserSchemas = exports.Validators = void 0;
exports.validate = validate;
exports.safeValidate = safeValidate;
exports.transformZodErrors = transformZodErrors;
const zod_1 = require("zod");
exports.Validators = {
    uuid: zod_1.z.string().uuid('Invalid UUID format'),
    email: zod_1.z.string().email('Invalid email address'),
    url: zod_1.z.string().url('Invalid URL'),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain at least one letter and one number'),
    name: zod_1.z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
    description: zod_1.z.string().max(2000, 'Description must be less than 2000 characters').optional(),
    phone: zod_1.z.string().regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number'),
    dateString: zod_1.z.string().datetime('Invalid date format'),
    pagination: zod_1.z.object({
        page: zod_1.z.number().int().min(1).default(1),
        limit: zod_1.z.number().int().min(1).max(100).default(20),
        sort: zod_1.z.string().optional(),
        order: zod_1.z.enum(['asc', 'desc']).default('asc'),
    }),
    positiveInt: zod_1.z.number().int().positive('Must be a positive integer'),
    positiveNumber: zod_1.z.number().positive('Must be a positive number'),
    uuidArray: zod_1.z.array(zod_1.z.string().uuid()),
};
exports.UserSchemas = {
    createUser: zod_1.z.object({
        email: exports.Validators.email,
        password: exports.Validators.password,
        role: zod_1.z.enum(['admin', 'user', 'viewer']).default('user'),
        firstName: zod_1.z.string().max(100).optional(),
        lastName: zod_1.z.string().max(100).optional(),
    }),
    updateUser: zod_1.z.object({
        firstName: zod_1.z.string().max(100).optional(),
        lastName: zod_1.z.string().max(100).optional(),
        avatarUrl: exports.Validators.url.optional(),
    }),
    login: zod_1.z.object({
        email: exports.Validators.email,
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
    register: zod_1.z.object({
        email: exports.Validators.email,
        password: exports.Validators.password,
        firstName: zod_1.z.string().max(100).optional(),
        lastName: zod_1.z.string().max(100).optional(),
    }),
    changePassword: zod_1.z.object({
        currentPassword: zod_1.z.string().min(1, 'Current password is required'),
        newPassword: exports.Validators.password,
    }),
    resetPassword: zod_1.z.object({
        token: zod_1.z.string().min(1, 'Reset token is required'),
        newPassword: exports.Validators.password,
    }),
};
exports.AthleteSchemas = {
    createAthlete: zod_1.z.object({
        name: exports.Validators.name,
        sport: zod_1.z.string().min(1, 'Sport is required').max(100),
        status: zod_1.z.enum(['active', 'inactive', 'retired']).default('active'),
        socialHandles: zod_1.z
            .object({
            instagram: zod_1.z.string().optional(),
            twitter: zod_1.z.string().optional(),
            tiktok: zod_1.z.string().optional(),
            linkedin: zod_1.z.string().optional(),
            facebook: zod_1.z.string().optional(),
        })
            .optional(),
        bio: exports.Validators.description,
        imageUrl: exports.Validators.url.optional(),
        website: exports.Validators.url.optional(),
    }),
    updateAthlete: zod_1.z.object({
        name: exports.Validators.name.optional(),
        sport: zod_1.z.string().min(1).max(100).optional(),
        status: zod_1.z.enum(['active', 'inactive', 'retired']).optional(),
        socialHandles: zod_1.z
            .object({
            instagram: zod_1.z.string().optional(),
            twitter: zod_1.z.string().optional(),
            tiktok: zod_1.z.string().optional(),
            linkedin: zod_1.z.string().optional(),
            facebook: zod_1.z.string().optional(),
        })
            .optional(),
        bio: exports.Validators.description,
        imageUrl: exports.Validators.url.optional(),
        website: exports.Validators.url.optional(),
    }),
    athleteSearch: zod_1.z.object({
        query: zod_1.z.string().optional(),
        sport: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'inactive', 'retired']).optional(),
        page: zod_1.z.number().int().min(1).default(1),
        limit: zod_1.z.number().int().min(1).max(100).default(20),
        sort: zod_1.z.enum(['name', 'createdAt', 'updatedAt']).default('name'),
        order: zod_1.z.enum(['asc', 'desc']).default('asc'),
    }),
};
exports.BrandSchemas = {
    createBrand: zod_1.z.object({
        name: exports.Validators.name,
        category: zod_1.z.string().max(100).optional(),
        website: exports.Validators.url.optional(),
        description: exports.Validators.description,
        status: zod_1.z.enum(['active', 'inactive', 'archived']).default('active'),
        logoUrl: exports.Validators.url.optional(),
        foundedYear: zod_1.z.number().int().min(1800).max(new Date().getFullYear()).optional(),
        headquarters: zod_1.z.string().max(200).optional(),
        industry: zod_1.z.string().max(100).optional(),
    }),
    updateBrand: zod_1.z.object({
        name: exports.Validators.name.optional(),
        category: zod_1.z.string().max(100).optional(),
        website: exports.Validators.url.optional(),
        description: exports.Validators.description,
        status: zod_1.z.enum(['active', 'inactive', 'archived']).optional(),
        logoUrl: exports.Validators.url.optional(),
        foundedYear: zod_1.z.number().int().min(1800).max(new Date().getFullYear()).optional(),
        headquarters: zod_1.z.string().max(200).optional(),
        industry: zod_1.z.string().max(100).optional(),
        isArchived: zod_1.z.boolean().optional(),
    }),
    brandSearch: zod_1.z.object({
        query: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'inactive', 'archived']).optional(),
        athleteId: exports.Validators.uuid.optional(),
        page: zod_1.z.number().int().min(1).default(1),
        limit: zod_1.z.number().int().min(1).max(100).default(20),
        sort: zod_1.z.enum(['name', 'createdAt', 'rank']).default('name'),
        order: zod_1.z.enum(['asc', 'desc']).default('asc'),
    }),
    createBrandMetric: zod_1.z.object({
        brandId: exports.Validators.uuid,
        metricType: zod_1.z.enum([
            'instagram_followers',
            'instagram_engagement',
            'tiktok_followers',
            'tiktok_views',
            'linkedin_followers',
            'web_traffic',
            'revenue',
            'valuation',
            'funding',
            'employee_count',
        ]),
        value: exports.Validators.positiveNumber,
        source: zod_1.z.string().min(1, 'Source is required'),
        collectedAt: zod_1.z.date().default(() => new Date()),
        metadata: zod_1.z.record(zod_1.z.any()).optional(),
    }),
};
exports.RelationshipSchemas = {
    createRelationship: zod_1.z.object({
        athleteId: exports.Validators.uuid,
        brandId: exports.Validators.uuid,
        relationshipType: zod_1.z.enum(['OWNER', 'FOUNDER', 'CO_FOUNDER', 'INVESTOR', 'ENDORSER']),
        verificationStatus: zod_1.z.enum(['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED']).default('UNVERIFIED'),
        confidence: zod_1.z.number().min(0).max(1).optional(),
        source: zod_1.z.string().optional(),
        notes: zod_1.z.string().max(1000).optional(),
    }),
    updateRelationship: zod_1.z.object({
        relationshipType: zod_1.z.enum(['OWNER', 'FOUNDER', 'CO_FOUNDER', 'INVESTOR', 'ENDORSER']).optional(),
        verificationStatus: zod_1.z.enum(['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED']).optional(),
        confidence: zod_1.z.number().min(0).max(1).optional(),
        source: zod_1.z.string().optional(),
        notes: zod_1.z.string().max(1000).optional(),
    }),
};
exports.JobSchemas = {
    createJob: zod_1.z.object({
        type: zod_1.z.enum(['brand-discovery', 'verification', 'metrics-collection', 'scoring', 'pipeline']),
        payload: zod_1.z.record(zod_1.z.any()),
        priority: zod_1.z.enum(['low', 'normal', 'high', 'critical']).default('normal'),
        userId: exports.Validators.uuid.optional(),
    }),
    jobQuery: zod_1.z.object({
        type: zod_1.z.string().optional(),
        status: zod_1.z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']).optional(),
        userId: exports.Validators.uuid.optional(),
        page: zod_1.z.number().int().min(1).default(1),
        limit: zod_1.z.number().int().min(1).max(100).default(20),
    }),
};
exports.SearchSchemas = {
    search: zod_1.z.object({
        query: zod_1.z.string().min(1, 'Search query is required'),
        type: zod_1.z.enum(['all', 'athletes', 'brands']).default('all'),
        limit: zod_1.z.number().int().min(1).max(50).default(10),
        offset: zod_1.z.number().int().min(0).default(0),
    }),
    suggest: zod_1.z.object({
        query: zod_1.z.string().min(1, 'Query is required'),
        limit: zod_1.z.number().int().min(1).max(10).default(5),
    }),
};
exports.AnalyticsSchemas = {
    analyticsQuery: zod_1.z.object({
        startDate: zod_1.z.date().or(zod_1.z.string().datetime()).optional(),
        endDate: zod_1.z.date().or(zod_1.z.string().datetime()).optional(),
        athleteId: exports.Validators.uuid.optional(),
        brandId: exports.Validators.uuid.optional(),
        category: zod_1.z.string().optional(),
        sport: zod_1.z.string().optional(),
        granularity: zod_1.z.enum(['day', 'week', 'month', 'year']).default('day'),
    }),
    comparison: zod_1.z.object({
        brandIds: zod_1.z.array(exports.Validators.uuid).min(2, 'At least 2 brands required').max(5, 'Maximum 5 brands allowed'),
        startDate: zod_1.z.date().or(zod_1.z.string().datetime()).optional(),
        endDate: zod_1.z.date().or(zod_1.z.string().datetime()).optional(),
    }),
};
exports.UploadSchemas = {
    csvUpload: zod_1.z.object({
        filename: zod_1.z.string().min(1, 'Filename is required'),
        recordsTotal: exports.Validators.positiveInt,
    }),
};
function validate(schema, data) {
    return schema.parse(data);
}
function safeValidate(schema, data) {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, errors: result.error };
}
function transformZodErrors(zodError) {
    return zodError.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
    }));
}

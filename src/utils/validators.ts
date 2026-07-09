/**
 * Zod Validators
 * Reusable validation schemas for common data structures
 */

import { z } from 'zod';

/**
 * Common Field Validators
 */
export const Validators = {
  // UUID validation
  uuid: z.string().uuid('Invalid UUID format'),

  // Email validation
  email: z.string().email('Invalid email address'),

  // URL validation
  url: z.string().url('Invalid URL'),

  // Password validation (min 8 chars, at least one letter and one number)
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain at least one letter and one number'),

  // Name validation (1-255 chars)
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),

  // Description validation (max 2000 chars)
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),

  // Phone number validation (basic)
  phone: z.string().regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number'),

  // Date string validation
  dateString: z.string().datetime('Invalid date format'),

  // Pagination parameters
  pagination: z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('asc'),
  }),

  // Positive integer
  positiveInt: z.number().int().positive('Must be a positive integer'),

  // Positive number (including decimals)
  positiveNumber: z.number().positive('Must be a positive number'),

  // Array of UUIDs
  uuidArray: z.array(z.string().uuid()),
};

/**
 * User Validation Schemas
 */
export const UserSchemas = {
  createUser: z.object({
    email: Validators.email,
    password: Validators.password,
    role: z.enum(['admin', 'user', 'viewer']).default('user'),
    firstName: z.string().max(100).optional(),
    lastName: z.string().max(100).optional(),
  }),

  updateUser: z.object({
    firstName: z.string().max(100).optional(),
    lastName: z.string().max(100).optional(),
    avatarUrl: Validators.url.optional(),
  }),

  login: z.object({
    email: Validators.email,
    password: z.string().min(1, 'Password is required'),
  }),

  register: z.object({
    email: Validators.email,
    password: Validators.password,
    firstName: z.string().max(100).optional(),
    lastName: z.string().max(100).optional(),
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: Validators.password,
  }),

  resetPassword: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: Validators.password,
  }),
};

/**
 * Athlete Validation Schemas
 */
export const AthleteSchemas = {
  createAthlete: z.object({
    name: Validators.name,
    sport: z.string().min(1, 'Sport is required').max(100),
    status: z.enum(['active', 'inactive', 'retired']).default('active'),
    socialHandles: z
      .object({
        instagram: z.string().optional(),
        twitter: z.string().optional(),
        tiktok: z.string().optional(),
        linkedin: z.string().optional(),
        facebook: z.string().optional(),
      })
      .optional(),
    bio: Validators.description,
    imageUrl: Validators.url.optional(),
    website: Validators.url.optional(),
  }),

  updateAthlete: z.object({
    name: Validators.name.optional(),
    sport: z.string().min(1).max(100).optional(),
    status: z.enum(['active', 'inactive', 'retired']).optional(),
    socialHandles: z
      .object({
        instagram: z.string().optional(),
        twitter: z.string().optional(),
        tiktok: z.string().optional(),
        linkedin: z.string().optional(),
        facebook: z.string().optional(),
      })
      .optional(),
    bio: Validators.description,
    imageUrl: Validators.url.optional(),
    website: Validators.url.optional(),
  }),

  athleteSearch: z.object({
    query: z.string().optional(),
    sport: z.string().optional(),
    status: z.enum(['active', 'inactive', 'retired']).optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
    sort: z.enum(['name', 'createdAt', 'updatedAt']).default('name'),
    order: z.enum(['asc', 'desc']).default('asc'),
  }),
};

/**
 * Brand Validation Schemas
 */
export const BrandSchemas = {
  createBrand: z.object({
    name: Validators.name,
    category: z.string().max(100).optional(),
    website: Validators.url.optional(),
    description: Validators.description,
    status: z.enum(['active', 'inactive', 'archived']).default('active'),
    logoUrl: Validators.url.optional(),
    foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
    headquarters: z.string().max(200).optional(),
    industry: z.string().max(100).optional(),
  }),

  updateBrand: z.object({
    name: Validators.name.optional(),
    category: z.string().max(100).optional(),
    website: Validators.url.optional(),
    description: Validators.description,
    status: z.enum(['active', 'inactive', 'archived']).optional(),
    logoUrl: Validators.url.optional(),
    foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
    headquarters: z.string().max(200).optional(),
    industry: z.string().max(100).optional(),
    isArchived: z.boolean().optional(),
  }),

  brandSearch: z.object({
    query: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional(),
    athleteId: Validators.uuid.optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
    sort: z.enum(['name', 'createdAt', 'rank']).default('name'),
    order: z.enum(['asc', 'desc']).default('asc'),
  }),

  createBrandMetric: z.object({
    brandId: Validators.uuid,
    metricType: z.enum([
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
    value: Validators.positiveNumber,
    source: z.string().min(1, 'Source is required'),
    collectedAt: z.date().default(() => new Date()),
    metadata: z.record(z.any()).optional(),
  }),
};

/**
 * Relationship Validation Schemas
 */
export const RelationshipSchemas = {
  createRelationship: z.object({
    athleteId: Validators.uuid,
    brandId: Validators.uuid,
    relationshipType: z.enum(['OWNER', 'FOUNDER', 'CO_FOUNDER', 'INVESTOR', 'ENDORSER']),
    verificationStatus: z.enum(['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED']).default('UNVERIFIED'),
    confidence: z.number().min(0).max(1).optional(),
    source: z.string().optional(),
    notes: z.string().max(1000).optional(),
  }),

  updateRelationship: z.object({
    relationshipType: z.enum(['OWNER', 'FOUNDER', 'CO_FOUNDER', 'INVESTOR', 'ENDORSER']).optional(),
    verificationStatus: z.enum(['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED']).optional(),
    confidence: z.number().min(0).max(1).optional(),
    source: z.string().optional(),
    notes: z.string().max(1000).optional(),
  }),
};

/**
 * Job Validation Schemas
 */
export const JobSchemas = {
  createJob: z.object({
    type: z.enum(['brand-discovery', 'verification', 'metrics-collection', 'scoring', 'pipeline']),
    payload: z.record(z.any()),
    priority: z.enum(['low', 'normal', 'high', 'critical']).default('normal'),
    userId: Validators.uuid.optional(),
  }),

  jobQuery: z.object({
    type: z.string().optional(),
    status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']).optional(),
    userId: Validators.uuid.optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
  }),
};

/**
 * Search Validation Schemas
 */
export const SearchSchemas = {
  search: z.object({
    query: z.string().min(1, 'Search query is required'),
    type: z.enum(['all', 'athletes', 'brands']).default('all'),
    limit: z.number().int().min(1).max(50).default(10),
    offset: z.number().int().min(0).default(0),
  }),

  suggest: z.object({
    query: z.string().min(1, 'Query is required'),
    limit: z.number().int().min(1).max(10).default(5),
  }),
};

/**
 * Analytics Validation Schemas
 */
export const AnalyticsSchemas = {
  analyticsQuery: z.object({
    startDate: z.date().or(z.string().datetime()).optional(),
    endDate: z.date().or(z.string().datetime()).optional(),
    athleteId: Validators.uuid.optional(),
    brandId: Validators.uuid.optional(),
    category: z.string().optional(),
    sport: z.string().optional(),
    granularity: z.enum(['day', 'week', 'month', 'year']).default('day'),
  }),

  comparison: z.object({
    brandIds: z.array(Validators.uuid).min(2, 'At least 2 brands required').max(5, 'Maximum 5 brands allowed'),
    startDate: z.date().or(z.string().datetime()).optional(),
    endDate: z.date().or(z.string().datetime()).optional(),
  }),
};

/**
 * Upload Validation Schemas
 */
export const UploadSchemas = {
  csvUpload: z.object({
    filename: z.string().min(1, 'Filename is required'),
    recordsTotal: Validators.positiveInt,
  }),
};

/**
 * Helper function to validate data with a schema
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Helper function to safely validate data (returns errors instead of throwing)
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Transform Zod errors to validation error format
 */
export function transformZodErrors(zodError: z.ZodError): Array<{ field: string; message: string }> {
  return zodError.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}

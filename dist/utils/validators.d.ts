import { z } from 'zod';
export declare const Validators: {
    uuid: z.ZodString;
    email: z.ZodString;
    url: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    phone: z.ZodString;
    dateString: z.ZodString;
    pagination: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        sort: z.ZodOptional<z.ZodString>;
        order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        order: "asc" | "desc";
        sort?: string | undefined;
    }, {
        page?: number | undefined;
        limit?: number | undefined;
        sort?: string | undefined;
        order?: "asc" | "desc" | undefined;
    }>;
    positiveInt: z.ZodNumber;
    positiveNumber: z.ZodNumber;
    uuidArray: z.ZodArray<z.ZodString, "many">;
};
export declare const UserSchemas: {
    createUser: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        role: z.ZodDefault<z.ZodEnum<["admin", "user", "viewer"]>>;
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
        role: "admin" | "user" | "viewer";
        firstName?: string | undefined;
        lastName?: string | undefined;
    }, {
        email: string;
        password: string;
        role?: "admin" | "user" | "viewer" | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
    }>;
    updateUser: z.ZodObject<{
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        avatarUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        firstName?: string | undefined;
        lastName?: string | undefined;
        avatarUrl?: string | undefined;
    }, {
        firstName?: string | undefined;
        lastName?: string | undefined;
        avatarUrl?: string | undefined;
    }>;
    login: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
    }, {
        email: string;
        password: string;
    }>;
    register: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
        firstName?: string | undefined;
        lastName?: string | undefined;
    }, {
        email: string;
        password: string;
        firstName?: string | undefined;
        lastName?: string | undefined;
    }>;
    changePassword: z.ZodObject<{
        currentPassword: z.ZodString;
        newPassword: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        currentPassword: string;
        newPassword: string;
    }, {
        currentPassword: string;
        newPassword: string;
    }>;
    resetPassword: z.ZodObject<{
        token: z.ZodString;
        newPassword: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        newPassword: string;
        token: string;
    }, {
        newPassword: string;
        token: string;
    }>;
};
export declare const AthleteSchemas: {
    createAthlete: z.ZodObject<{
        name: z.ZodString;
        sport: z.ZodString;
        status: z.ZodDefault<z.ZodEnum<["active", "inactive", "retired"]>>;
        socialHandles: z.ZodOptional<z.ZodObject<{
            instagram: z.ZodOptional<z.ZodString>;
            twitter: z.ZodOptional<z.ZodString>;
            tiktok: z.ZodOptional<z.ZodString>;
            linkedin: z.ZodOptional<z.ZodString>;
            facebook: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            instagram?: string | undefined;
            twitter?: string | undefined;
            tiktok?: string | undefined;
            linkedin?: string | undefined;
            facebook?: string | undefined;
        }, {
            instagram?: string | undefined;
            twitter?: string | undefined;
            tiktok?: string | undefined;
            linkedin?: string | undefined;
            facebook?: string | undefined;
        }>>;
        bio: z.ZodOptional<z.ZodString>;
        imageUrl: z.ZodOptional<z.ZodString>;
        website: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        status: "active" | "inactive" | "retired";
        sport: string;
        socialHandles?: {
            instagram?: string | undefined;
            twitter?: string | undefined;
            tiktok?: string | undefined;
            linkedin?: string | undefined;
            facebook?: string | undefined;
        } | undefined;
        bio?: string | undefined;
        imageUrl?: string | undefined;
        website?: string | undefined;
    }, {
        name: string;
        sport: string;
        status?: "active" | "inactive" | "retired" | undefined;
        socialHandles?: {
            instagram?: string | undefined;
            twitter?: string | undefined;
            tiktok?: string | undefined;
            linkedin?: string | undefined;
            facebook?: string | undefined;
        } | undefined;
        bio?: string | undefined;
        imageUrl?: string | undefined;
        website?: string | undefined;
    }>;
    updateAthlete: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        sport: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["active", "inactive", "retired"]>>;
        socialHandles: z.ZodOptional<z.ZodObject<{
            instagram: z.ZodOptional<z.ZodString>;
            twitter: z.ZodOptional<z.ZodString>;
            tiktok: z.ZodOptional<z.ZodString>;
            linkedin: z.ZodOptional<z.ZodString>;
            facebook: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            instagram?: string | undefined;
            twitter?: string | undefined;
            tiktok?: string | undefined;
            linkedin?: string | undefined;
            facebook?: string | undefined;
        }, {
            instagram?: string | undefined;
            twitter?: string | undefined;
            tiktok?: string | undefined;
            linkedin?: string | undefined;
            facebook?: string | undefined;
        }>>;
        bio: z.ZodOptional<z.ZodString>;
        imageUrl: z.ZodOptional<z.ZodString>;
        website: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        status?: "active" | "inactive" | "retired" | undefined;
        sport?: string | undefined;
        socialHandles?: {
            instagram?: string | undefined;
            twitter?: string | undefined;
            tiktok?: string | undefined;
            linkedin?: string | undefined;
            facebook?: string | undefined;
        } | undefined;
        bio?: string | undefined;
        imageUrl?: string | undefined;
        website?: string | undefined;
    }, {
        name?: string | undefined;
        status?: "active" | "inactive" | "retired" | undefined;
        sport?: string | undefined;
        socialHandles?: {
            instagram?: string | undefined;
            twitter?: string | undefined;
            tiktok?: string | undefined;
            linkedin?: string | undefined;
            facebook?: string | undefined;
        } | undefined;
        bio?: string | undefined;
        imageUrl?: string | undefined;
        website?: string | undefined;
    }>;
    athleteSearch: z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        sport: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["active", "inactive", "retired"]>>;
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        sort: z.ZodDefault<z.ZodEnum<["name", "createdAt", "updatedAt"]>>;
        order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        sort: "name" | "createdAt" | "updatedAt";
        order: "asc" | "desc";
        query?: string | undefined;
        status?: "active" | "inactive" | "retired" | undefined;
        sport?: string | undefined;
    }, {
        query?: string | undefined;
        status?: "active" | "inactive" | "retired" | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        sort?: "name" | "createdAt" | "updatedAt" | undefined;
        order?: "asc" | "desc" | undefined;
        sport?: string | undefined;
    }>;
};
export declare const BrandSchemas: {
    createBrand: z.ZodObject<{
        name: z.ZodString;
        category: z.ZodOptional<z.ZodString>;
        website: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["active", "inactive", "archived"]>>;
        logoUrl: z.ZodOptional<z.ZodString>;
        foundedYear: z.ZodOptional<z.ZodNumber>;
        headquarters: z.ZodOptional<z.ZodString>;
        industry: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        status: "active" | "inactive" | "archived";
        website?: string | undefined;
        category?: string | undefined;
        description?: string | undefined;
        logoUrl?: string | undefined;
        foundedYear?: number | undefined;
        headquarters?: string | undefined;
        industry?: string | undefined;
    }, {
        name: string;
        status?: "active" | "inactive" | "archived" | undefined;
        website?: string | undefined;
        category?: string | undefined;
        description?: string | undefined;
        logoUrl?: string | undefined;
        foundedYear?: number | undefined;
        headquarters?: string | undefined;
        industry?: string | undefined;
    }>;
    updateBrand: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        website: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["active", "inactive", "archived"]>>;
        logoUrl: z.ZodOptional<z.ZodString>;
        foundedYear: z.ZodOptional<z.ZodNumber>;
        headquarters: z.ZodOptional<z.ZodString>;
        industry: z.ZodOptional<z.ZodString>;
        isArchived: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        status?: "active" | "inactive" | "archived" | undefined;
        website?: string | undefined;
        category?: string | undefined;
        description?: string | undefined;
        logoUrl?: string | undefined;
        foundedYear?: number | undefined;
        headquarters?: string | undefined;
        industry?: string | undefined;
        isArchived?: boolean | undefined;
    }, {
        name?: string | undefined;
        status?: "active" | "inactive" | "archived" | undefined;
        website?: string | undefined;
        category?: string | undefined;
        description?: string | undefined;
        logoUrl?: string | undefined;
        foundedYear?: number | undefined;
        headquarters?: string | undefined;
        industry?: string | undefined;
        isArchived?: boolean | undefined;
    }>;
    brandSearch: z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["active", "inactive", "archived"]>>;
        athleteId: z.ZodOptional<z.ZodString>;
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        sort: z.ZodDefault<z.ZodEnum<["name", "createdAt", "rank"]>>;
        order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        sort: "name" | "createdAt" | "rank";
        order: "asc" | "desc";
        athleteId?: string | undefined;
        query?: string | undefined;
        status?: "active" | "inactive" | "archived" | undefined;
        category?: string | undefined;
    }, {
        athleteId?: string | undefined;
        query?: string | undefined;
        status?: "active" | "inactive" | "archived" | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        sort?: "name" | "createdAt" | "rank" | undefined;
        order?: "asc" | "desc" | undefined;
        category?: string | undefined;
    }>;
    createBrandMetric: z.ZodObject<{
        brandId: z.ZodString;
        metricType: z.ZodEnum<["instagram_followers", "instagram_engagement", "tiktok_followers", "tiktok_views", "linkedin_followers", "web_traffic", "revenue", "valuation", "funding", "employee_count"]>;
        value: z.ZodNumber;
        source: z.ZodString;
        collectedAt: z.ZodDefault<z.ZodDate>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        brandId: string;
        value: number;
        metricType: "instagram_followers" | "instagram_engagement" | "tiktok_followers" | "tiktok_views" | "linkedin_followers" | "web_traffic" | "revenue" | "valuation" | "funding" | "employee_count";
        source: string;
        collectedAt: Date;
        metadata?: Record<string, any> | undefined;
    }, {
        brandId: string;
        value: number;
        metricType: "instagram_followers" | "instagram_engagement" | "tiktok_followers" | "tiktok_views" | "linkedin_followers" | "web_traffic" | "revenue" | "valuation" | "funding" | "employee_count";
        source: string;
        metadata?: Record<string, any> | undefined;
        collectedAt?: Date | undefined;
    }>;
};
export declare const RelationshipSchemas: {
    createRelationship: z.ZodObject<{
        athleteId: z.ZodString;
        brandId: z.ZodString;
        relationshipType: z.ZodEnum<["OWNER", "FOUNDER", "CO_FOUNDER", "INVESTOR", "ENDORSER"]>;
        verificationStatus: z.ZodDefault<z.ZodEnum<["UNVERIFIED", "PENDING", "VERIFIED", "REJECTED"]>>;
        confidence: z.ZodOptional<z.ZodNumber>;
        source: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        athleteId: string;
        brandId: string;
        relationshipType: "OWNER" | "FOUNDER" | "CO_FOUNDER" | "INVESTOR" | "ENDORSER";
        verificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
        source?: string | undefined;
        confidence?: number | undefined;
        notes?: string | undefined;
    }, {
        athleteId: string;
        brandId: string;
        relationshipType: "OWNER" | "FOUNDER" | "CO_FOUNDER" | "INVESTOR" | "ENDORSER";
        source?: string | undefined;
        verificationStatus?: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED" | undefined;
        confidence?: number | undefined;
        notes?: string | undefined;
    }>;
    updateRelationship: z.ZodObject<{
        relationshipType: z.ZodOptional<z.ZodEnum<["OWNER", "FOUNDER", "CO_FOUNDER", "INVESTOR", "ENDORSER"]>>;
        verificationStatus: z.ZodOptional<z.ZodEnum<["UNVERIFIED", "PENDING", "VERIFIED", "REJECTED"]>>;
        confidence: z.ZodOptional<z.ZodNumber>;
        source: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        source?: string | undefined;
        relationshipType?: "OWNER" | "FOUNDER" | "CO_FOUNDER" | "INVESTOR" | "ENDORSER" | undefined;
        verificationStatus?: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED" | undefined;
        confidence?: number | undefined;
        notes?: string | undefined;
    }, {
        source?: string | undefined;
        relationshipType?: "OWNER" | "FOUNDER" | "CO_FOUNDER" | "INVESTOR" | "ENDORSER" | undefined;
        verificationStatus?: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED" | undefined;
        confidence?: number | undefined;
        notes?: string | undefined;
    }>;
};
export declare const JobSchemas: {
    createJob: z.ZodObject<{
        type: z.ZodEnum<["brand-discovery", "verification", "metrics-collection", "scoring", "pipeline"]>;
        payload: z.ZodRecord<z.ZodString, z.ZodAny>;
        priority: z.ZodDefault<z.ZodEnum<["low", "normal", "high", "critical"]>>;
        userId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "brand-discovery" | "verification" | "metrics-collection" | "scoring" | "pipeline";
        payload: Record<string, any>;
        priority: "low" | "normal" | "high" | "critical";
        userId?: string | undefined;
    }, {
        type: "brand-discovery" | "verification" | "metrics-collection" | "scoring" | "pipeline";
        payload: Record<string, any>;
        userId?: string | undefined;
        priority?: "low" | "normal" | "high" | "critical" | undefined;
    }>;
    jobQuery: z.ZodObject<{
        type: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["pending", "processing", "completed", "failed", "cancelled"]>>;
        userId: z.ZodOptional<z.ZodString>;
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        userId?: string | undefined;
        type?: string | undefined;
        status?: "pending" | "processing" | "completed" | "failed" | "cancelled" | undefined;
    }, {
        userId?: string | undefined;
        type?: string | undefined;
        status?: "pending" | "processing" | "completed" | "failed" | "cancelled" | undefined;
        page?: number | undefined;
        limit?: number | undefined;
    }>;
};
export declare const SearchSchemas: {
    search: z.ZodObject<{
        query: z.ZodString;
        type: z.ZodDefault<z.ZodEnum<["all", "athletes", "brands"]>>;
        limit: z.ZodDefault<z.ZodNumber>;
        offset: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: "all" | "athletes" | "brands";
        query: string;
        limit: number;
        offset: number;
    }, {
        query: string;
        type?: "all" | "athletes" | "brands" | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    }>;
    suggest: z.ZodObject<{
        query: z.ZodString;
        limit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        query: string;
        limit: number;
    }, {
        query: string;
        limit?: number | undefined;
    }>;
};
export declare const AnalyticsSchemas: {
    analyticsQuery: z.ZodObject<{
        startDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
        endDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
        athleteId: z.ZodOptional<z.ZodString>;
        brandId: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        sport: z.ZodOptional<z.ZodString>;
        granularity: z.ZodDefault<z.ZodEnum<["day", "week", "month", "year"]>>;
    }, "strip", z.ZodTypeAny, {
        granularity: "day" | "week" | "month" | "year";
        athleteId?: string | undefined;
        brandId?: string | undefined;
        sport?: string | undefined;
        category?: string | undefined;
        startDate?: string | Date | undefined;
        endDate?: string | Date | undefined;
    }, {
        athleteId?: string | undefined;
        brandId?: string | undefined;
        sport?: string | undefined;
        category?: string | undefined;
        startDate?: string | Date | undefined;
        endDate?: string | Date | undefined;
        granularity?: "day" | "week" | "month" | "year" | undefined;
    }>;
    comparison: z.ZodObject<{
        brandIds: z.ZodArray<z.ZodString, "many">;
        startDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
        endDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    }, "strip", z.ZodTypeAny, {
        brandIds: string[];
        startDate?: string | Date | undefined;
        endDate?: string | Date | undefined;
    }, {
        brandIds: string[];
        startDate?: string | Date | undefined;
        endDate?: string | Date | undefined;
    }>;
};
export declare const UploadSchemas: {
    csvUpload: z.ZodObject<{
        filename: z.ZodString;
        recordsTotal: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        filename: string;
        recordsTotal: number;
    }, {
        filename: string;
        recordsTotal: number;
    }>;
};
export declare function validate<T>(schema: z.ZodSchema<T>, data: unknown): T;
export declare function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: true;
    data: T;
} | {
    success: false;
    errors: z.ZodError;
};
export declare function transformZodErrors(zodError: z.ZodError): Array<{
    field: string;
    message: string;
}>;
//# sourceMappingURL=validators.d.ts.map
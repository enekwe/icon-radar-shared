import { AthleteStatus, RelationshipType, VerificationStatus, SocialHandles, Timestamps } from './common';
export interface Athlete extends Timestamps {
    id: string;
    name: string;
    sport: string;
    status: AthleteStatus;
    socialHandles?: SocialHandles | null;
    bio?: string | null;
    imageUrl?: string | null;
    website?: string | null;
    lastBrandSearchAt?: Date | null;
    brandSearchStatus?: string | null;
}
export interface CreateAthleteInput {
    name: string;
    sport: string;
    status?: AthleteStatus;
    socialHandles?: SocialHandles;
    bio?: string;
    imageUrl?: string;
    website?: string;
}
export interface UpdateAthleteInput {
    name?: string;
    sport?: string;
    status?: AthleteStatus;
    socialHandles?: SocialHandles;
    bio?: string;
    imageUrl?: string;
    website?: string;
}
export interface AthleteBrandRelationship extends Timestamps {
    id: string;
    athleteId: string;
    brandId: string;
    relationshipType: RelationshipType;
    verificationStatus: VerificationStatus;
    verifiedAt?: Date | null;
    verifiedBy?: string | null;
    confidence?: number | null;
    source?: string | null;
    notes?: string | null;
}
export interface CreateRelationshipInput {
    athleteId: string;
    brandId: string;
    relationshipType: RelationshipType;
    verificationStatus?: VerificationStatus;
    confidence?: number;
    source?: string;
    notes?: string;
}
export interface AthleteWithBrands extends Athlete {
    brandRelationships: Array<AthleteBrandRelationship & {
        brand?: any;
    }>;
}
export interface AthleteSearchParams {
    query?: string;
    sport?: string;
    status?: AthleteStatus;
    page?: number;
    limit?: number;
    sort?: 'name' | 'createdAt' | 'updatedAt';
    order?: 'asc' | 'desc';
}
export interface BulkAthleteOperation {
    operation: 'create' | 'update' | 'delete';
    athletes: Array<CreateAthleteInput | UpdateAthleteInput>;
}
export interface AthleteStats {
    totalAthletes: number;
    activeAthletes: number;
    inactiveAthletes: number;
    retiredAthletes: number;
    athletesBySport: Record<string, number>;
    totalBrands: number;
    verifiedRelationships: number;
}
//# sourceMappingURL=athlete.d.ts.map
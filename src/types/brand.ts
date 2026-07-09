/**
 * Brand Domain Types
 * Type definitions for brand-related entities
 */

import { BrandStatus, Timestamps, SoftDelete, ConfidenceScore } from './common';

export interface Brand extends Timestamps, SoftDelete {
  id: string;
  name: string;
  category?: string | null;
  website?: string | null;
  description?: string | null;
  status: BrandStatus;
  logoUrl?: string | null;
  foundedYear?: number | null;
  headquarters?: string | null;
  industry?: string | null;
}

export interface CreateBrandInput {
  name: string;
  category?: string;
  website?: string;
  description?: string;
  status?: BrandStatus;
  logoUrl?: string;
  foundedYear?: number;
  headquarters?: string;
  industry?: string;
}

export interface UpdateBrandInput {
  name?: string;
  category?: string;
  website?: string;
  description?: string;
  status?: BrandStatus;
  logoUrl?: string;
  foundedYear?: number;
  headquarters?: string;
  industry?: string;
  isArchived?: boolean;
}

export type MetricType =
  | 'instagram_followers'
  | 'instagram_engagement'
  | 'tiktok_followers'
  | 'tiktok_views'
  | 'linkedin_followers'
  | 'web_traffic'
  | 'revenue'
  | 'valuation'
  | 'funding'
  | 'employee_count';

export interface BrandMetric {
  id: string;
  brandId: string;
  metricType: MetricType;
  value: number;
  source: string;
  collectedAt: Date;
  metadata?: Record<string, any>;
}

export interface CreateBrandMetricInput {
  brandId: string;
  metricType: MetricType;
  value: number;
  source: string;
  collectedAt?: Date;
  metadata?: Record<string, any>;
}

export interface ChampionIndexScore {
  id: string;
  brandId: string;
  score: number;
  rank: number | null;
  calculationDate: Date;
  metrics: Record<string, number>;
  weights: Record<string, number>;
}

export interface BrandDiscoveryLog extends Timestamps {
  id: string;
  brandId: string;
  athleteId: string;
  discoveryDate: Date;
  confidence: ConfidenceScore;
  source: string;
  rawData?: Record<string, any>;
}

export interface BrandWithMetrics extends Brand {
  metrics: BrandMetric[];
  championIndexScore?: ChampionIndexScore;
  athleteRelationships?: any[];
}

export interface BrandSearchParams {
  query?: string;
  category?: string;
  status?: BrandStatus;
  athleteId?: string;
  page?: number;
  limit?: number;
  sort?: 'name' | 'createdAt' | 'rank';
  order?: 'asc' | 'desc';
}

export interface BrandStats {
  totalBrands: number;
  activeBrands: number;
  archivedBrands: number;
  brandsByCategory: Record<string, number>;
  averageChampionIndexScore: number;
  topBrands: Array<{ brandId: string; name: string; score: number; rank: number }>;
}

export interface BrandComparison {
  brands: Array<{
    id: string;
    name: string;
    championIndexScore: number;
    rank: number;
    metrics: Record<string, number>;
  }>;
  comparisonDate: Date;
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  avgRating: number;
  ratingStrictness: 'harsh' | 'moderate' | 'lenient';
  ratingVariance: number;
  reviewLengthAvg: number;
  tone: string;
  styleDescription: string;
  commonWords: string;
  sentimentBias: 'critical' | 'balanced' | 'positive';
  preferences: string;
  dislikes: string;
}

export interface ProductInfo {
  productName: string;
  category: string;
  priceRange: string;
  features: string;
  likelyIssues: string;
}

export type StyleLevel = 'none' | 'light' | 'medium' | 'strong';

export interface GenerationConfig {
  userProfile: UserProfile;
  productInfo: ProductInfo;
  styleLevel: StyleLevel;
}

export interface GeneratedReview {
  rating: number;
  review: string;
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, ProductInfo, StyleLevel } from "./types";

export const DEFAULT_USER_PROFILE: UserProfile = {
  avgRating: 3.5,
  ratingStrictness: 'moderate',
  ratingVariance: 0.5,
  reviewLengthAvg: 50,
  tone: 'casual, balanced',
  styleDescription: 'Clear and informative, uses bullet points occasionally.',
  commonWords: 'overall, decent, but, worth it',
  sentimentBias: 'balanced',
  preferences: 'Value for money, durability, clean design.',
  dislikes: 'Slow shipping, poor customer service, bloated software.',
};

export const DEFAULT_PRODUCT_INFO: ProductInfo = {
  productName: 'EcoTrack Smartwatch V2',
  category: 'Electronics / Wearables',
  priceRange: '$150 - $200',
  features: 'Heart rate monitoring, Solar charging, Waterproof (50m), Sleep tracking.',
  likelyIssues: 'Interface can be laggy, bulky design for small wrists.',
};

export const PERSONA_PRESETS: { name: string; profile: UserProfile }[] = [
  {
    name: "The Critical Techie",
    profile: {
      avgRating: 2.5,
      ratingStrictness: 'harsh',
      ratingVariance: 0.8,
      reviewLengthAvg: 120,
      tone: 'technical, blunt, skeptical',
      styleDescription: 'Uses technical specs to justify ratings. Focuses on performance flaws.',
      commonWords: 'latency, throughput, suboptimal, thermal throttling',
      sentimentBias: 'critical',
      preferences: 'High performance, repairability, open-source compatibility.',
      dislikes: 'Proprietary connectors, locked bootloaders, plastic build quality.',
    }
  },
  {
    name: "The Easy-going Shopper",
    profile: {
      avgRating: 4.5,
      ratingStrictness: 'lenient',
      ratingVariance: 0.3,
      reviewLengthAvg: 30,
      tone: 'friendly, brief, positive',
      styleDescription: 'Short, upbeat sentences. Often ignores small flaws.',
      commonWords: 'love it, great buy, super fast, works well',
      sentimentBias: 'positive',
      preferences: 'Ease of use, pretty packaging, fast delivery.',
      dislikes: 'Complicated setups, expensive shipping.',
    }
  },
  {
    name: "The Detail-Oriented Mom",
    profile: {
      avgRating: 3.8,
      ratingStrictness: 'moderate',
      ratingVariance: 0.4,
      reviewLengthAvg: 80,
      tone: 'practical, concerned, thorough',
      styleDescription: 'Focuses on safety, cleaning, and longevity for kids.',
      commonWords: 'safe for kids, easy to wash, durable, loud',
      sentimentBias: 'balanced',
      preferences: 'Safety certs, washable materials, quiet operation.',
      dislikes: 'Small parts, sharp edges, loud noises.',
    }
  }
];

export const STYLE_LEVELS: { value: StyleLevel; label: string }[] = [
  { value: 'none', label: 'Global English' },
  { value: 'light', label: 'Light Nigerian (Expressions)' },
  { value: 'medium', label: 'Medium (Natural Mix/Pidgin)' },
  { value: 'strong', label: 'Strong (Mostly Pidgin)' },
];

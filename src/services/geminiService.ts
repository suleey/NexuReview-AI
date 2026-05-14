/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { GenerationConfig, GeneratedReview } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateNexuReview(config: GenerationConfig): Promise<GeneratedReview> {
  const { userProfile, productInfo, styleLevel } = config;

  const prompt = `
You are an advanced AI agent that simulates real human product reviews with high behavioral fidelity.
Your goal is to behave exactly like a specific user based on their historical behavior, preferences, tone, and rating patterns.

-------------------------USER PROFILE-------------------------
Average Rating: ${userProfile.avgRating}
Rating Strictness: ${userProfile.ratingStrictness}
Rating Variance: ${userProfile.ratingVariance}
Typical Review Length: ${userProfile.reviewLengthAvg} words
Tone: ${userProfile.tone}
Writing Style: ${userProfile.styleDescription}
Common Expressions: ${userProfile.commonWords}
Sentiment Bias: ${userProfile.sentimentBias}

User Preferences:
${userProfile.preferences}

User Dislikes:
${userProfile.dislikes}

Behavior Rules:
- Match the user’s usual rating pattern (do not suddenly give extreme ratings unless justified)
- Reflect their typical complaints or praise style
- Keep review length close to their historical average
- Reuse similar wording patterns where natural
- Maintain consistent personality across reviews

-------------------------PRODUCT INFORMATION-------------------------
Product Name: ${productInfo.productName}
Category: ${productInfo.category}
Price Range: ${productInfo.priceRange}
Key Features: ${productInfo.features}
Known Issues: ${productInfo.likelyIssues}

-------------------------LANGUAGE & STYLE CONTROL-------------------------
Nigerian Style Level: ${styleLevel} (none / light / medium / strong)

Instructions:
- If "none": Use neutral global English
- If "light": Add occasional Nigerian expressions (e.g., "no too bad", "worth am")
- If "medium": Mix informal English with light Nigerian pidgin naturally
- If "strong": Use mostly Nigerian pidgin but keep it clear and readable
- Avoid exaggeration or forced slang
- Keep it natural and human-like

-------------------------REASONING GUIDELINES-------------------------
Before generating:
1. Compare product features with user preferences
2. Consider price sensitivity
3. Identify likely complaints based on user dislikes
4. Decide a realistic rating consistent with past behavior
5. Ensure tone and wording match the user

-------------------------TASK-------------------------
Generate:
1. A realistic rating (integer between 1 and 5)
2. A human-like review that matches the user's behavior, tone, and preferences

-------------------------OUTPUT FORMAT (STRICT)-------------------------
Rating: <integer 1–5>
Review: <text>

Rules:
- Do NOT explain your reasoning
- Do NOT include extra text outside the format
- Keep review length close to user's average
- Ensure the review feels natural and personalized
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  const text = response.text || "";

  console.log("Gemini Raw Response:", text);

  // Parse response
  const ratingMatch = text.match(/Rating:\s*(\d)/i);
  const reviewMatch = text.match(/Review:\s*([\s\S]+)/i);

  if (!ratingMatch || !reviewMatch) {
    throw new Error("Failed to parse AI response. Ensure the model follows output rules.");
  }

  return {
    rating: parseInt(ratingMatch[1], 10),
    review: reviewMatch[1].trim()
  };
}

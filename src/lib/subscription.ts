// Subscription tier types and pure utility functions
// Safe to import from both client and server components

export type UserTier = "free" | "single" | "pro";

// Free tier content limits
export const FREE_TIER_LIMITS = {
  showFullDimensions: false,
  showAllStrengths: false,
  showAllWeaknesses: false,
  showUndervalued: false,
  showMissingElements: false,
  showNextSteps: false,
  showJustifications: false,
  allowPdfExport: false,
  maxStrengths: 1,
  maxWeaknesses: 1,
} as const;

export const PAID_TIER_LIMITS = {
  showFullDimensions: true,
  showAllStrengths: true,
  showAllWeaknesses: true,
  showUndervalued: true,
  showMissingElements: true,
  showNextSteps: true,
  showJustifications: true,
  allowPdfExport: true,
  maxStrengths: 3,
  maxWeaknesses: 3,
} as const;

export function getTierLimits(tier: UserTier) {
  return tier === "free" ? FREE_TIER_LIMITS : PAID_TIER_LIMITS;
}

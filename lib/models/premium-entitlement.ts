/**
 * Premium Entitlement System
 * Manages access control for MY WAR ROOM feature
 * Designed to integrate with payment providers (Stripe, etc.)
 */

export type PremiumTier = "free" | "pro" | "premium";
export type EntitlementType = "MY_WAR_ROOM" | "UNLIMITED_WAR_ROOMS" | "ADVANCED_ALERTS";

export interface UserEntitlement {
  userId: string;
  tier: PremiumTier;
  features: EntitlementType[];
  hasAccess: (feature: EntitlementType) => boolean;
  isPremium: boolean;
  createdAt: number;
  updatedAt: number;
  expiresAt?: number; // For subscriptions
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface PremiumConfig {
  enabled: boolean;
  mode: "ENABLED" | "DISABLED" | "BETA" | "WAITLIST";
  betaUserIds?: string[];
  waitlistOnly: boolean;
}

/**
 * Create a free tier user entitlement
 */
export function createFreeUserEntitlement(userId: string): UserEntitlement {
  const now = Date.now();

  return {
    userId,
    tier: "free",
    features: [],
    hasAccess: (feature: EntitlementType) => {
      // Free tier has no premium features
      return false;
    },
    isPremium: false,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Create a premium user entitlement
 */
export function createPremiumUserEntitlement(
  userId: string,
  tier: PremiumTier = "pro",
  expiresAt?: number
): UserEntitlement {
  const now = Date.now();

  const features: EntitlementType[] = [];
  if (tier === "pro" || tier === "premium") {
    features.push("MY_WAR_ROOM");
  }
  if (tier === "premium") {
    features.push("UNLIMITED_WAR_ROOMS", "ADVANCED_ALERTS");
  }

  return {
    userId,
    tier,
    features,
    hasAccess: (feature: EntitlementType) => features.includes(feature),
    isPremium: true,
    createdAt: now,
    updatedAt: now,
    expiresAt,
  };
}

/**
 * Upgrade a user's entitlement
 * Called by payment webhook after successful subscription
 */
export function upgradeUserEntitlement(
  entitlement: UserEntitlement,
  tier: PremiumTier,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string,
  expiresAt?: number
): UserEntitlement {
  const features: EntitlementType[] = [];
  if (tier === "pro" || tier === "premium") {
    features.push("MY_WAR_ROOM");
  }
  if (tier === "premium") {
    features.push("UNLIMITED_WAR_ROOMS", "ADVANCED_ALERTS");
  }

  return {
    ...entitlement,
    tier,
    features,
    isPremium: tier !== "free",
    stripeCustomerId,
    stripeSubscriptionId,
    expiresAt,
    updatedAt: Date.now(),
    hasAccess: (feature: EntitlementType) => features.includes(feature),
  };
}

/**
 * Check if a user has access to a specific feature
 */
export function userHasFeatureAccess(
  entitlement: UserEntitlement,
  feature: EntitlementType
): boolean {
  // Check if subscription is expired
  if (entitlement.expiresAt && entitlement.expiresAt < Date.now()) {
    return false;
  }

  return entitlement.hasAccess(feature);
}

/**
 * Check if My War Room feature is available
 */
export function canAccessMyWarRoom(
  entitlement: UserEntitlement,
  config: PremiumConfig
): boolean {
  // Feature must be enabled in config
  if (!config.enabled || config.mode === "DISABLED") {
    return false;
  }

  // Beta mode: only beta users
  if (config.mode === "BETA") {
    return (
      config.betaUserIds?.includes(entitlement.userId) &&
      userHasFeatureAccess(entitlement, "MY_WAR_ROOM")
    );
  }

  // Waitlist mode: no access
  if (config.mode === "WAITLIST" || config.waitlistOnly) {
    return false;
  }

  // Normal mode: check entitlement
  return userHasFeatureAccess(entitlement, "MY_WAR_ROOM");
}

/**
 * Get the UI state for My War Room feature
 */
export function getMyWarRoomUIState(
  entitlement: UserEntitlement,
  config: PremiumConfig
): "AVAILABLE" | "LOCKED" | "BETA" | "WAITLIST_ONLY" | "DISABLED" {
  if (!config.enabled) {
    return "DISABLED";
  }

  if (config.mode === "WAITLIST" || config.waitlistOnly) {
    return "WAITLIST_ONLY";
  }

  if (config.mode === "BETA") {
    if (config.betaUserIds?.includes(entitlement.userId)) {
      return "BETA";
    }
    return "LOCKED";
  }

  if (canAccessMyWarRoom(entitlement, config)) {
    return "AVAILABLE";
  }

  return "LOCKED";
}

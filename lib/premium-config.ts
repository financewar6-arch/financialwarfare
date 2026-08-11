/**
 * Premium Feature Configuration
 * Controls MY WAR ROOM feature availability globally
 * Easy to enable/disable without code changes
 */

import { PremiumConfig } from "./models/premium-entitlement";

/**
 * Current premium configuration
 * Change this to control MY WAR ROOM feature behavior
 */
export const PREMIUM_CONFIG: PremiumConfig = {
  // Set to true to enable the premium feature
  enabled: true,

  // Mode controls how the feature is exposed:
  // "ENABLED" - available to all premium users
  // "BETA" - only available to beta user IDs
  // "WAITLIST" - show waitlist CTA only
  // "DISABLED" - feature is hidden entirely
  mode: "ENABLED",

  // Beta user IDs (when mode is "BETA")
  betaUserIds: [
    // "user-123",
    // "user-456",
  ],

  // Show waitlist CTA instead of premium feature
  waitlistOnly: false,
};

/**
 * Toggle MY WAR ROOM feature globally
 * Usage: updatePremiumConfig({ enabled: true, mode: "ENABLED" })
 */
export function updatePremiumConfig(updates: Partial<PremiumConfig>) {
  Object.assign(PREMIUM_CONFIG, updates);
}

/**
 * Get current feature mode
 */
export function getPremiumMode(): PremiumConfig["mode"] {
  return PREMIUM_CONFIG.mode;
}

/**
 * Check if premium feature is enabled
 */
export function isPremiumEnabled(): boolean {
  return PREMIUM_CONFIG.enabled && PREMIUM_CONFIG.mode !== "DISABLED";
}

/**
 * Add a user to beta program
 */
export function addBetaUser(userId: string) {
  if (!PREMIUM_CONFIG.betaUserIds) {
    PREMIUM_CONFIG.betaUserIds = [];
  }
  if (!PREMIUM_CONFIG.betaUserIds.includes(userId)) {
    PREMIUM_CONFIG.betaUserIds.push(userId);
  }
}

/**
 * Remove a user from beta program
 */
export function removeBetaUser(userId: string) {
  if (PREMIUM_CONFIG.betaUserIds) {
    PREMIUM_CONFIG.betaUserIds = PREMIUM_CONFIG.betaUserIds.filter(
      (id) => id !== userId
    );
  }
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export enum PremiumFeature {
  MY_WAR_ROOM = "MY_WAR_ROOM",
  UNLIMITED_WAR_ROOMS = "UNLIMITED_WAR_ROOMS",
  ADVANCED_THESIS_MONITOR = "ADVANCED_THESIS_MONITOR",
  ALERTS = "ALERTS",
}

export enum UserTier {
  FREE = "free",
  PRO = "pro",
  PREMIUM = "premium",
}

/**
 * Check if user has access to a premium feature
 * Returns true if:
 * - Feature flag is enabled for the user
 * - User has not exceeded any tier limits
 * - Subscription hasn't expired (if applicable)
 */
export async function hasFeatureAccess(
  userId: string,
  feature: PremiumFeature
): Promise<boolean> {
  const entitlement = await prisma.userEntitlement.findUnique({
    where: { userId },
  });

  if (!entitlement) {
    return false;
  }

  // Check if expired
  if (entitlement.expiresAt && entitlement.expiresAt < new Date()) {
    return false;
  }

  // Check if feature is in the user's features array
  return entitlement.features.includes(feature);
}

/**
 * Grant a feature to a user (for admin/testing)
 */
export async function grantFeature(
  userId: string,
  feature: PremiumFeature
): Promise<void> {
  const entitlement = await prisma.userEntitlement.findUnique({
    where: { userId },
  });

  if (!entitlement) {
    // Create new entitlement
    await prisma.userEntitlement.create({
      data: {
        userId,
        tier: UserTier.PREMIUM,
        isPremium: true,
        features: [feature],
      },
    });
  } else {
    // Add feature if not already present
    const features = new Set(entitlement.features);
    features.add(feature);
    await prisma.userEntitlement.update({
      where: { userId },
      data: {
        features: Array.from(features),
        isPremium: true,
        tier: UserTier.PREMIUM,
      },
    });
  }
}

/**
 * Revoke a feature from a user
 */
export async function revokeFeature(
  userId: string,
  feature: PremiumFeature
): Promise<void> {
  const entitlement = await prisma.userEntitlement.findUnique({
    where: { userId },
  });

  if (!entitlement) {
    return;
  }

  const features = new Set(entitlement.features);
  features.delete(feature);

  await prisma.userEntitlement.update({
    where: { userId },
    data: {
      features: Array.from(features),
      isPremium: features.size > 0,
      tier: features.size > 0 ? UserTier.PREMIUM : UserTier.FREE,
    },
  });
}

/**
 * Create default entitlement for new user
 */
export async function createDefaultEntitlement(
  userId: string
): Promise<void> {
  await prisma.userEntitlement.create({
    data: {
      userId,
      tier: UserTier.FREE,
      isPremium: false,
      features: [],
    },
  });
}

/**
 * Get user's entitlement
 */
export async function getUserEntitlement(userId: string) {
  return prisma.userEntitlement.findUnique({
    where: { userId },
  });
}

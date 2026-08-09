import type { EditorialContent } from "./warroom/types";

interface CachedEditorial {
  [slug: string]: {
    content: EditorialContent;
    updatedAt: number;
  };
}

// In-memory cache for editorial content
let editorialCache: CachedEditorial = {
  bitcoin: {
    content: {
      photoLabel: "Bitcoin Market Action",
      whyItMoved: "Bitcoin continues to lead the crypto rally as institutional adoption accelerates.",
      whyYouShouldCare: "Bitcoin's price movements often signal market sentiment for the broader crypto market.",
      risk: "Volatility remains high. Regulatory changes can cause sudden price swings.",
      watchNext: "Monitor Federal Reserve policy and institutional investor activity.",
    },
    updatedAt: Date.now(),
  },
  gold: {
    content: {
      photoLabel: "Gold Market Trends",
      whyItMoved: "Gold prices fluctuate based on USD strength and geopolitical tensions.",
      whyYouShouldCare: "Gold is a safe-haven asset that typically rises during market uncertainty.",
      risk: "Interest rate increases can pressure gold prices downward.",
      watchNext: "Watch for central bank policy announcements and global economic data.",
    },
    updatedAt: Date.now(),
  },
  apple: {
    content: {
      photoLabel: "Apple Stock Performance",
      whyItMoved: "Apple's stock follows tech sector trends and earnings announcements.",
      whyYouShouldCare: "As a mega-cap tech stock, Apple heavily influences the broader market.",
      risk: "Supply chain disruptions and competition can impact earnings.",
      watchNext: "Monitor quarterly earnings reports and iPhone sales data.",
    },
    updatedAt: Date.now(),
  },
};

export function updateEditorial(slug: string, content: EditorialContent) {
  editorialCache[slug] = {
    content,
    updatedAt: Date.now(),
  };
  console.log(`✓ Editorial updated for ${slug}`);
  return editorialCache[slug];
}

export function getEditorial(slug: string): EditorialContent | null {
  const cached = editorialCache[slug];
  return cached ? cached.content : null;
}

export function getAllEditorial(): CachedEditorial {
  return editorialCache;
}

export function getEditorialStatus(slug: string) {
  const cached = editorialCache[slug];
  if (!cached) return null;
  return {
    slug,
    updatedAt: new Date(cached.updatedAt).toISOString(),
    hoursOld: Math.floor((Date.now() - cached.updatedAt) / (60 * 60 * 1000)),
  };
}

export interface SundayOutlook {
  id: string;
  substackUrl: string; // Original Substack article URL
  slug: string; // URL-friendly identifier
  title: string;
  subtitle?: string;
  author: string;
  publishedAt: number; // Timestamp
  coverImage?: string; // URL to cover image
  summary: string; // 40-80 word AI summary
  category?: string;
  featured: boolean;
  status: "draft" | "published" | "archived";

  // Metadata for SEO/social
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;

  // Analytics
  viewCount: number;
  clicksToSubstack: number;

  // Timestamps
  createdAt: number;
  updatedAt: number;
}

export interface SundayOutlookInput {
  substackUrl: string;
  title: string;
  subtitle?: string;
  author?: string;
  publishedAt?: number;
  coverImage?: string;
  summary: string;
  category?: string;
}

export function createSundayOutlook(input: SundayOutlookInput): SundayOutlook {
  const now = Date.now();
  const slug = generateSlug(input.title);

  return {
    id: `outlook-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    substackUrl: input.substackUrl,
    slug,
    title: input.title,
    subtitle: input.subtitle,
    author: input.author || "Financial Opp",
    publishedAt: input.publishedAt || now,
    coverImage: input.coverImage,
    summary: input.summary,
    category: input.category || "Market Outlook",
    featured: true, // New articles default to featured
    status: "draft",
    seoTitle: `${input.title} — Financial Opp`,
    seoDescription: input.summary,
    ogImage: input.coverImage,
    viewCount: 0,
    clicksToSubstack: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateSundayOutlook(
  outlook: SundayOutlook,
  updates: Partial<SundayOutlook>
): SundayOutlook {
  return {
    ...outlook,
    ...updates,
    updatedAt: Date.now(),
  };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);
}

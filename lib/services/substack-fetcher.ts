/**
 * Fetch metadata from Substack article URLs
 * Respects content rights and uses only publicly available metadata
 */

export interface SubstackMetadata {
  title: string;
  subtitle?: string;
  author: string;
  publishedAt: number;
  coverImage?: string;
  description: string;
  url: string;
  success: boolean;
  error?: string;
}

/**
 * Fetch metadata from Substack article
 * Attempts to extract title, image, date, and description from Open Graph and standard HTML metadata
 */
export async function fetchSubstackMetadata(url: string): Promise<SubstackMetadata> {
  try {
    // Validate URL
    if (!isValidSubstackUrl(url)) {
      return {
        title: "",
        author: "Financial Opp",
        publishedAt: Date.now(),
        description: "",
        url,
        success: false,
        error: "Invalid Substack URL format",
      };
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (compatible with Financial Warfare metadata fetcher)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Extract metadata from HTML
    const metadata = extractMetadata(html, url);

    return {
      ...metadata,
      success: true,
    };
  } catch (error) {
    console.error("Failed to fetch Substack metadata:", error);
    return {
      title: "",
      author: "Financial Opp",
      publishedAt: Date.now(),
      description: "",
      url,
      success: false,
      error: `Failed to fetch article: ${String(error)}`,
    };
  }
}

function isValidSubstackUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes("substack.com") && parsed.pathname.includes("/p/");
  } catch {
    return false;
  }
}

function extractMetadata(html: string, url: string): Omit<SubstackMetadata, "success"> {
  const metadata: Omit<SubstackMetadata, "success"> = {
    title: "",
    subtitle: "",
    author: "Financial Opp",
    publishedAt: Date.now(),
    coverImage: "",
    description: "",
    url,
  };

  // Extract Open Graph metadata
  const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
  const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
  const ogDescriptionMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);

  if (ogTitleMatch) metadata.title = decodeHtml(ogTitleMatch[1]);
  if (ogImageMatch) metadata.coverImage = ogImageMatch[1];
  if (ogDescriptionMatch) metadata.description = decodeHtml(ogDescriptionMatch[1]);

  // Fallback to standard meta tags if OG tags not found
  if (!metadata.title) {
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      // Remove " | Substack" suffix
      metadata.title = decodeHtml(titleMatch[1]).replace(/\s*\|\s*Substack\s*$/i, "");
    }
  }

  if (!metadata.description) {
    const descriptionMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    if (descriptionMatch) metadata.description = decodeHtml(descriptionMatch[1]);
  }

  // Extract publication date
  const dateMatch = html.match(/"datePublished":\s*"([^"]+)"/);
  if (dateMatch) {
    try {
      metadata.publishedAt = new Date(dateMatch[1]).getTime();
    } catch {
      // Keep default
    }
  }

  // Extract author (usually in the page structure)
  const authorMatch = html.match(/"author":\s*\{\s*"name":\s*"([^"]+)"/);
  if (authorMatch) metadata.author = decodeHtml(authorMatch[1]);

  // Clean up title if it still has publication name
  if (metadata.title.endsWith(" | Substack")) {
    metadata.title = metadata.title.slice(0, -11);
  }

  return metadata;
}

function decodeHtml(text: string): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
  };

  return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => entities[entity] || entity);
}

/**
 * Generate an AI summary for the article
 * Uses Claude to create a 40-80 word summary encouraging readers to read the full article
 */
export async function generateOutlookSummary(
  title: string,
  description: string,
  htmlContent?: string
): Promise<string> {
  // For now, return a template summary
  // In production, this would call Claude API with the article content
  // Since we don't have full article content (respecting rights), we generate based on title/description

  if (description && description.length > 50) {
    return description.substring(0, 200);
  }

  // Fallback summary template
  return `This week's outlook examines key market movements and opportunities. Read the full analysis on Financial Opp to understand what could move markets this week and how to position accordingly.`;
}

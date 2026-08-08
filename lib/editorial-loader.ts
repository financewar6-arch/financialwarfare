// Loads editorial content from generated files or falls back to static content
// Enables daily auto-updating of war room analysis

import { EditorialContent } from "@/content/types";
import * as fs from "fs/promises";
import * as path from "path";

const EDITORIAL_DATA_DIR = path.join(process.cwd(), ".data", "editorial");

export async function loadEditorialContent(
  assetSlug: string,
  staticContent: EditorialContent
): Promise<EditorialContent> {
  try {
    const filePath = path.join(EDITORIAL_DATA_DIR, `${assetSlug}.json`);
    const data = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(data);

    // Validate the structure
    if (
      parsed.whyItMoved &&
      parsed.whyYouShouldCare &&
      parsed.risk &&
      parsed.watchNext
    ) {
      return {
        photoLabel: parsed.photoLabel || staticContent.photoLabel,
        whyItMoved: parsed.whyItMoved,
        whyYouShouldCare: parsed.whyYouShouldCare,
        risk: parsed.risk,
        watchNext: parsed.watchNext,
      };
    }
  } catch (error) {
    // Silently fall back to static content if file doesn't exist or is invalid
  }

  return staticContent;
}

export async function saveEditorialContent(
  assetSlug: string,
  content: EditorialContent
): Promise<void> {
  try {
    // Ensure directory exists
    await fs.mkdir(EDITORIAL_DATA_DIR, { recursive: true });

    const filePath = path.join(EDITORIAL_DATA_DIR, `${assetSlug}.json`);
    await fs.writeFile(filePath, JSON.stringify(content, null, 2), "utf-8");
  } catch (error) {
    console.error(`Failed to save editorial content for ${assetSlug}:`, error);
  }
}

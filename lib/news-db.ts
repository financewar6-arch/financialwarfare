// News Article Storage & Management
// JSON-based persistence for processed articles and clusters

import * as fs from "fs";
import * as path from "path";
import { ProcessedNewsArticle, NewsCluster } from "./models/news-article";
import { generateId } from "./utils/id-generator";

const DATA_DIR = path.join(process.cwd(), ".data");
const NEWS_ARTICLES_FILE = path.join(DATA_DIR, "news-articles.json");
const NEWS_CLUSTERS_FILE = path.join(DATA_DIR, "news-clusters.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadNewsArticles(): ProcessedNewsArticle[] {
  ensureDataDir();
  if (!fs.existsSync(NEWS_ARTICLES_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(NEWS_ARTICLES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveNewsArticles(articles: ProcessedNewsArticle[]) {
  ensureDataDir();
  fs.writeFileSync(NEWS_ARTICLES_FILE, JSON.stringify(articles, null, 2));
}

function loadNewsClusters(): NewsCluster[] {
  ensureDataDir();
  if (!fs.existsSync(NEWS_CLUSTERS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(NEWS_CLUSTERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveNewsClusters(clusters: NewsCluster[]) {
  ensureDataDir();
  fs.writeFileSync(NEWS_CLUSTERS_FILE, JSON.stringify(clusters, null, 2));
}

export async function createNewsArticle(article: Omit<ProcessedNewsArticle, "id">) {
  const articles = loadNewsArticles();

  // Check for duplicate by articleHash
  const existing = articles.find((a) => a.articleHash === article.articleHash);
  if (existing) {
    return existing;
  }

  const newArticle: ProcessedNewsArticle = {
    ...article,
    id: generateId(),
  };

  articles.push(newArticle);
  saveNewsArticles(articles);
  return newArticle;
}

export async function getNewsArticle(id: string) {
  const articles = loadNewsArticles();
  return articles.find((a) => a.id === id);
}

export async function updateNewsArticle(id: string, updates: Partial<ProcessedNewsArticle>) {
  const articles = loadNewsArticles();
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return null;

  articles[index] = { ...articles[index], ...updates, processedAt: Date.now() };
  saveNewsArticles(articles);
  return articles[index];
}

export async function getNewsArticlesByStatus(status: ProcessedNewsArticle["status"]) {
  const articles = loadNewsArticles();
  return articles.filter((a) => a.status === status);
}

export async function getNewsArticlesByAsset(slug: string) {
  const articles = loadNewsArticles();
  return articles.filter((a) => a.mentionedAssets.includes(slug));
}

export async function createNewsCluster(cluster: Omit<NewsCluster, "id">) {
  const clusters = loadNewsClusters();

  // Check for existing cluster with same hash
  const existing = clusters.find((c) => c.clusterHash === cluster.clusterHash);
  if (existing) {
    return existing;
  }

  const newCluster: NewsCluster = {
    ...cluster,
    id: generateId(),
  };

  clusters.push(newCluster);
  saveNewsClusters(clusters);
  return newCluster;
}

export async function getNewsCluster(id: string) {
  const clusters = loadNewsClusters();
  return clusters.find((c) => c.id === id);
}

export async function getNewsClusterByHash(hash: string) {
  const clusters = loadNewsClusters();
  return clusters.find((c) => c.clusterHash === hash);
}

export async function updateNewsCluster(id: string, updates: Partial<NewsCluster>) {
  const clusters = loadNewsClusters();
  const index = clusters.findIndex((c) => c.id === id);
  if (index === -1) return null;

  clusters[index] = { ...clusters[index], ...updates };
  saveNewsClusters(clusters);
  return clusters[index];
}

export async function getUnprocessedArticles() {
  const articles = loadNewsArticles();
  return articles.filter((a) => a.status === "ingested");
}

export async function getRecent(minutes = 60) {
  const articles = loadNewsArticles();
  const cutoff = Date.now() - minutes * 60 * 1000;
  return articles.filter((a) => a.processedAt >= cutoff);
}

export async function archiveOldArticles(olderThanHours = 48) {
  const articles = loadNewsArticles();
  const cutoff = Date.now() - olderThanHours * 3600 * 1000;

  const recent = articles.filter((a) => a.processedAt >= cutoff);
  const archived = articles.filter((a) => a.processedAt < cutoff);

  if (archived.length > 0) {
    saveNewsArticles(recent);
  }

  return archived.length;
}

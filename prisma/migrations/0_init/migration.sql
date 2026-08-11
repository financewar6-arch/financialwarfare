-- CreateTable
CREATE TABLE "DailyDispatchArticle" (
    "id" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "marketImpact" TEXT NOT NULL,
    "tactical" TEXT NOT NULL,
    "keyNumbers" TEXT[],
    "originalUrl" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyDispatchArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyDispatchArticle_publishedAt_idx" ON "DailyDispatchArticle"("publishedAt");

-- CreateIndex
CREATE INDEX "DailyDispatchArticle_source_idx" ON "DailyDispatchArticle"("source");

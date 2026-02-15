-- CreateTable
CREATE TABLE "DesignUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "designerTier" TEXT NOT NULL DEFAULT 'free',
    "stripeDesignerId" TEXT,
    "designerSubStatus" TEXT,
    "designerPeriodEnd" TIMESTAMP(3),
    "designsCreatedThisMonth" INTEGER NOT NULL DEFAULT 0,
    "designLimit" INTEGER,
    "features" JSONB NOT NULL DEFAULT '{"aiAssistant": false, "aiImageGen": false, "multiProductPreview": false, "customBranding": false}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomDesign" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "canvasData" JSONB NOT NULL,
    "thumbnail" TEXT,
    "printifyProductId" TEXT,
    "printifyProductUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "tier" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "aiGeneratedElements" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customDesignId" TEXT NOT NULL,
    "sanityProductId" TEXT,
    "printifyOrderId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "trackingNumber" TEXT,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "shippingAddress" JSONB NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "priceInCents" INTEGER NOT NULL,
    "totalAmount" DOUBLE PRECISION,
    "stripePaymentIntentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "canvasData" JSONB NOT NULL,
    "thumbnail" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignUsageLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCache" (
    "id" TEXT NOT NULL,
    "sanityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "inStock" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchLog" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "userId" TEXT,
    "resultsCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalizedContent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalizedContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DesignUser_email_key" ON "DesignUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DesignUser_stripeDesignerId_key" ON "DesignUser"("stripeDesignerId");

-- CreateIndex
CREATE INDEX "DesignUser_email_idx" ON "DesignUser"("email");

-- CreateIndex
CREATE INDEX "DesignUser_designerTier_idx" ON "DesignUser"("designerTier");

-- CreateIndex
CREATE UNIQUE INDEX "CustomDesign_shareToken_key" ON "CustomDesign"("shareToken");

-- CreateIndex
CREATE INDEX "CustomDesign_userId_idx" ON "CustomDesign"("userId");

-- CreateIndex
CREATE INDEX "CustomDesign_status_idx" ON "CustomDesign"("status");

-- CreateIndex
CREATE INDEX "CustomDesign_createdAt_idx" ON "CustomDesign"("createdAt");

-- CreateIndex
CREATE INDEX "CustomDesign_isPublic_idx" ON "CustomDesign"("isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "CustomOrder_printifyOrderId_key" ON "CustomOrder"("printifyOrderId");

-- CreateIndex
CREATE INDEX "CustomOrder_userId_idx" ON "CustomOrder"("userId");

-- CreateIndex
CREATE INDEX "CustomOrder_customDesignId_idx" ON "CustomOrder"("customDesignId");

-- CreateIndex
CREATE INDEX "CustomOrder_sanityProductId_idx" ON "CustomOrder"("sanityProductId");

-- CreateIndex
CREATE INDEX "CustomOrder_printifyOrderId_idx" ON "CustomOrder"("printifyOrderId");

-- CreateIndex
CREATE INDEX "CustomOrder_status_idx" ON "CustomOrder"("status");

-- CreateIndex
CREATE INDEX "CustomOrder_paymentStatus_idx" ON "CustomOrder"("paymentStatus");

-- CreateIndex
CREATE INDEX "DesignTemplate_category_idx" ON "DesignTemplate"("category");

-- CreateIndex
CREATE INDEX "DesignTemplate_isPublic_idx" ON "DesignTemplate"("isPublic");

-- CreateIndex
CREATE INDEX "DesignUsageLog_userId_idx" ON "DesignUsageLog"("userId");

-- CreateIndex
CREATE INDEX "DesignUsageLog_action_idx" ON "DesignUsageLog"("action");

-- CreateIndex
CREATE INDEX "DesignUsageLog_timestamp_idx" ON "DesignUsageLog"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCache_sanityId_key" ON "ProductCache"("sanityId");

-- CreateIndex
CREATE INDEX "ProductCache_sanityId_idx" ON "ProductCache"("sanityId");

-- CreateIndex
CREATE INDEX "ProductCache_inStock_idx" ON "ProductCache"("inStock");

-- CreateIndex
CREATE INDEX "SearchLog_userId_idx" ON "SearchLog"("userId");

-- CreateIndex
CREATE INDEX "SearchLog_createdAt_idx" ON "SearchLog"("createdAt");

-- CreateIndex
CREATE INDEX "PersonalizedContent_userId_idx" ON "PersonalizedContent"("userId");

-- CreateIndex
CREATE INDEX "PersonalizedContent_productId_idx" ON "PersonalizedContent"("productId");

-- CreateIndex
CREATE INDEX "PersonalizedContent_generatedAt_idx" ON "PersonalizedContent"("generatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalizedContent_userId_productId_key" ON "PersonalizedContent"("userId", "productId");

-- AddForeignKey
ALTER TABLE "CustomDesign" ADD CONSTRAINT "CustomDesign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "DesignUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomOrder" ADD CONSTRAINT "CustomOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "DesignUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomOrder" ADD CONSTRAINT "CustomOrder_customDesignId_fkey" FOREIGN KEY ("customDesignId") REFERENCES "CustomDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

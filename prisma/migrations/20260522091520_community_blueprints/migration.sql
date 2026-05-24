-- CreateEnum
CREATE TYPE "CommunityBlueprintStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'NEEDS_CHANGES');

-- AlterTable
ALTER TABLE "SavedBlueprint" ADD COLUMN     "communityBlueprintId" TEXT;

-- AlterTable
ALTER TABLE "UserProject" ADD COLUMN     "communityBlueprintId" TEXT;

-- CreateTable
CREATE TABLE "CommunityBlueprint" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "developerFields" JSONB NOT NULL,
    "categories" JSONB NOT NULL,
    "goals" JSONB NOT NULL,
    "stacks" JSONB NOT NULL,
    "difficulty" TEXT NOT NULL,
    "estimatedTime" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "recommendedStack" JSONB NOT NULL,
    "portfolioValue" INTEGER NOT NULL,
    "learningValue" INTEGER NOT NULL,
    "buildability" INTEGER NOT NULL,
    "uniqueness" INTEGER NOT NULL,
    "marketPotential" INTEGER NOT NULL,
    "richContent" JSONB NOT NULL,
    "status" "CommunityBlueprintStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityBlueprint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunityBlueprint_authorId_idx" ON "CommunityBlueprint"("authorId");

-- CreateIndex
CREATE INDEX "CommunityBlueprint_status_idx" ON "CommunityBlueprint"("status");

-- CreateIndex
CREATE INDEX "CommunityBlueprint_slug_idx" ON "CommunityBlueprint"("slug");

-- CreateIndex
CREATE INDEX "SavedBlueprint_communityBlueprintId_idx" ON "SavedBlueprint"("communityBlueprintId");

-- CreateIndex
CREATE INDEX "UserProject_communityBlueprintId_idx" ON "UserProject"("communityBlueprintId");

-- AddForeignKey
ALTER TABLE "SavedBlueprint" ADD CONSTRAINT "SavedBlueprint_communityBlueprintId_fkey" FOREIGN KEY ("communityBlueprintId") REFERENCES "CommunityBlueprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_communityBlueprintId_fkey" FOREIGN KEY ("communityBlueprintId") REFERENCES "CommunityBlueprint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityBlueprint" ADD CONSTRAINT "CommunityBlueprint_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

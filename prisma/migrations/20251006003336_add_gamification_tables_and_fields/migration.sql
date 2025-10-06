-- CreateEnum
CREATE TYPE "PointLogSourceType" AS ENUM ('BEST_ANSWER', 'UPVOTE', 'BADGE_AWARD', 'DAILY_LOGIN', 'CHALLENGE_COMPLETION');

-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('SUBJECT_ANSWERS', 'TOTAL_ANSWERS', 'BEST_ANSWERS', 'PROFILE_ACTION', 'MISSION');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "point_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pointsGained" INTEGER NOT NULL,
    "sourceType" "PointLogSourceType" NOT NULL,
    "sourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "point_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "BadgeType" NOT NULL,
    "threshold" INTEGER NOT NULL,
    "subjectId" TEXT,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_subject_stats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "answersCount" INTEGER NOT NULL DEFAULT 0,
    "bestAnswersCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_subject_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "badges_name_key" ON "badges"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_userId_badgeId_key" ON "user_badges"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "user_subject_stats_userId_subjectId_key" ON "user_subject_stats"("userId", "subjectId");

-- AddForeignKey
ALTER TABLE "point_logs" ADD CONSTRAINT "point_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subject_stats" ADD CONSTRAINT "user_subject_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subject_stats" ADD CONSTRAINT "user_subject_stats_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

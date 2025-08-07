/*
  Warnings:

  - You are about to drop the `_PersonToSubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `people` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PersonToSubject" DROP CONSTRAINT "_PersonToSubject_A_fkey";

-- DropForeignKey
ALTER TABLE "_PersonToSubject" DROP CONSTRAINT "_PersonToSubject_B_fkey";

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_authorId_fkey";

-- DropForeignKey
ALTER TABLE "people" DROP CONSTRAINT "people_userId_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_authorId_fkey";

-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_authorId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePicture" TEXT;

-- DropTable
DROP TABLE "_PersonToSubject";

-- DropTable
DROP TABLE "people";

-- CreateTable
CREATE TABLE "_SubjectToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SubjectToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SubjectToUser_B_index" ON "_SubjectToUser"("B");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToUser" ADD CONSTRAINT "_SubjectToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToUser" ADD CONSTRAINT "_SubjectToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

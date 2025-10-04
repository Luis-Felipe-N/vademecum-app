/*
  Warnings:

  - You are about to drop the column `subjectId` on the `questions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_subjectId_fkey";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "subjectId";

-- CreateTable
CREATE TABLE "_QuestionToSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_QuestionToSubject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_QuestionToSubject_B_index" ON "_QuestionToSubject"("B");

-- AddForeignKey
ALTER TABLE "_QuestionToSubject" ADD CONSTRAINT "_QuestionToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToSubject" ADD CONSTRAINT "_QuestionToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

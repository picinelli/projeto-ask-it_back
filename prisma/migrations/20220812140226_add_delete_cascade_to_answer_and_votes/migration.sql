-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_questionId_fkey";

-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_questionId_fkey";

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

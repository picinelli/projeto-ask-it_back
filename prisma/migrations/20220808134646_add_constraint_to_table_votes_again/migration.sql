/*
  Warnings:

  - A unique constraint covering the columns `[questionId,username]` on the table `votes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "votes_questionId_username_key" ON "votes"("questionId", "username");

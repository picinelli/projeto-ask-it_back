/*
  Warnings:

  - A unique constraint covering the columns `[teacherDisciplineId]` on the table `tests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tests_teacherDisciplineId_key" ON "tests"("teacherDisciplineId");

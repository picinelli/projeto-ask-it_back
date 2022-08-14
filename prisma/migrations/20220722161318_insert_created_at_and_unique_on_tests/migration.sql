/*
  Warnings:

  - A unique constraint covering the columns `[teacherDisciplineId,id]` on the table `tests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tests_teacherDisciplineId_id_key" ON "tests"("teacherDisciplineId", "id");

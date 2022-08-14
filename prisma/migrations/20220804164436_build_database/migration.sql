/*
  Warnings:

  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `disciplines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teachers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teachersDisciplines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `terms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tests` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "disciplines" DROP CONSTRAINT "disciplines_termId_fkey";

-- DropForeignKey
ALTER TABLE "teachersDisciplines" DROP CONSTRAINT "teachersDisciplines_disciplineId_fkey";

-- DropForeignKey
ALTER TABLE "teachersDisciplines" DROP CONSTRAINT "teachersDisciplines_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "tests" DROP CONSTRAINT "tests_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "tests" DROP CONSTRAINT "tests_teacherDisciplineId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "disciplines";

-- DropTable
DROP TABLE "teachers";

-- DropTable
DROP TABLE "teachersDisciplines";

-- DropTable
DROP TABLE "terms";

-- DropTable
DROP TABLE "tests";

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "views" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

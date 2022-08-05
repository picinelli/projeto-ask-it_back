import { QuestionData } from "../controllers/questionController.js";
import prisma from "../database.js";

export async function createNewQuestion(questionData: QuestionData) {
  return await prisma.question.create({
    data: {
      description: questionData.description,
      userId: questionData.userId,
      views: 0,
    },
  });
}

export async function getQuestion(id: number) {
  return await prisma.question.findUnique({ where: { id } });
}

export async function getPaginatedQuestions(page: number) {
  return await prisma.question.findMany({
    skip: (page - 1) * 10,
    take: 10,
    orderBy: {
      createdAt: 'desc'
    }
  })
}
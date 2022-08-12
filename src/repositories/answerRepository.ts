import { AnswerData } from "../controllers/answerController.js";
import prisma from "../database.js";

async function insertAnswer(answerData: AnswerData) {
  return await prisma.answer.create({
    data: {
      description: answerData.description,
      username: answerData.username,
      questionId: answerData.questionId,
    },
  });
}

async function getAnswers(id: number) {
  return await prisma.answer.findMany({
    where: {
      questionId: id,
    },
  });
}

async function getQuestionAnswersAmount(id: number) {
  return await prisma.answer.aggregate({
    _count: true,
    where: {
      questionId: id
    }
  })
}

export const answerRepository = {
  insertAnswer,
  getAnswers,
  getQuestionAnswersAmount
}



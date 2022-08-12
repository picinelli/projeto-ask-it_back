import { QuestionData, VoteData } from "../controllers/questionController.js";
import prisma from "../database.js";

async function createNewQuestion(questionData: QuestionData) {
  return await prisma.question.create({
    data: {
      description: questionData.description,
      userId: questionData.userId,
      views: 0,
    },
  });
}

async function insertViewQuestion(id: number) {
  return await prisma.question.update({
    data: {
      views: { increment: 1 },
    },
    where: {
      id,
    },
  });
}

async function checkVotedQuestion(voteData: VoteData) {
  return await prisma.question.findFirst({
    where: {
      votes: {
        some: {
          username: voteData.username,
          questionId: voteData.questionId,
        },
      },
    },
  });
}

async function insertVoteQuestion(voteData: VoteData) {
  return await prisma.vote.create({
    data: {
      questionId: voteData.questionId,
      username: voteData.username,
    },
  });
}

async function deleteVoteQuestion(voteData: VoteData) {
  return await prisma.vote.delete({
    where: {
      questionId_username: {
        questionId: voteData.questionId,
        username: voteData.username,
      },
    },
  });
}

async function getQuestion(id: number) {
  return await prisma.question.findUnique({
    include: {
      user: {
        select: {
          username: true,
        },
      },
      answers: true,
      votes: {
        select: {
          id: true,
        },
        where: {
          questionId: id,
        },
      },
    },
    where: {
      id,
    },
  });
}

async function getPaginatedQuestions(page: number) {
  return await prisma.question.findMany({
    skip: (page - 1) * 10,
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
      answers: true,
      votes: true,
    },
  });
}

async function getIlikeQuestions(description: string) {
  return await prisma.question.findMany({
    select: {
      id: true,
      description: true
    },
    where: {
      description: {
        contains: description,
        mode: "insensitive",
      },
    },
  });
}

async function getQuestionsAmount() {
  return await prisma.question.aggregate({
    _count: true,
  });
}

export const questionRepository = {
  createNewQuestion,
  insertViewQuestion,
  checkVotedQuestion,
  insertVoteQuestion,
  deleteVoteQuestion,
  getQuestion,
  getPaginatedQuestions,
  getIlikeQuestions,
  getQuestionsAmount
}

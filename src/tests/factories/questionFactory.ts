import { faker } from "@faker-js/faker";

function createQuestion() {
  return {
    id: 1,
    description: faker.lorem.word(100),
    views: 0,
    userId: 0,
    createdAt: new Date(Date.now()),
  };
}

function createQuestionData() {
  return {
    description: faker.lorem.word(100),
    userId: 0,
  };
}

function createTenQuestions() {
  let questions = []
  for (let i = 0; i < 10; i++) {
    questions.push(
      {
        id: 1,
        description: faker.lorem.word(100),
        views: 0,
        userId: 0,
        createdAt: new Date(Date.now()),
      }
    )
  }
  return questions
}

function createSpecificQuestion() {
  return {
    id: 1,
    description: faker.lorem.word(100),
    views: 0,
    userId: 0,
    createdAt: new Date(Date.now()),
    user: {
      username: faker.internet.userName()
    },
    answers: [],
    votes: []
  }
}

export const questionFactory = {
  createQuestion,
  createQuestionData,
  createTenQuestions,
  createSpecificQuestion
}
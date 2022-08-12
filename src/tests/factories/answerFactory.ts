import { faker } from "@faker-js/faker";

function createAnswer() {
  return {
    id: 1,
    description: faker.lorem.word(100),
    username: faker.internet.userName(),
    questionId: Number(faker.random.numeric()),
    createdAt: new Date(Date.now()),
  };
}

function createAnswerData() {
  return {
    description: faker.lorem.word(100),
    username: faker.internet.userName(),
    questionId: Number(faker.random.numeric())
  };
}

export const answerFactory = {
  createAnswer,
  createAnswerData
}
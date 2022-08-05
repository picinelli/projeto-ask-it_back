import { QuestionData } from "../controllers/questionController.js";
import { createNewQuestion, getPaginatedQuestions } from "../repositories/questionRepository.js";

async function createQuestion(questionData: QuestionData) {
  return await createNewQuestion(questionData)
}

async function getQuestionsPage(page: number) {
  return await getPaginatedQuestions(page)
}

export default {
  createQuestion,
  getQuestionsPage
}
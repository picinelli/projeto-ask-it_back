import { QuestionData } from "../controllers/questionController.js";
import { createNewQuestion } from "../repositories/questionRepository.js";

async function createQuestion(questionData: QuestionData) {
  return await createNewQuestion(questionData)
}

export default {
  createQuestion
}
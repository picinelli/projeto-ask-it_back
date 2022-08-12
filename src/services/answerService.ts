import { AnswerData } from "../controllers/answerController.js"
import { answerRepository } from "../repositories/answerRepository.js"
import { questionRepository } from "../repositories/questionRepository.js";
import throwError from "../utils/throwError.js";

async function createAnswer(answerData: AnswerData) {
  return await answerRepository.insertAnswer(answerData)
}

async function getQuestionAnswers(id: number) {
  const question = await questionRepository.getQuestion(id);
  if (!question) throwError("Question not found", 404);

  return await answerRepository.getAnswers(id)
}

export default {
  createAnswer,
  getQuestionAnswers
}
import { AnswerData } from "../controllers/answerController.js"
import { getAnswers, insertAnswer } from "../repositories/answerRepository.js"

async function createAnswer(answerData: AnswerData) {
  return await insertAnswer(answerData)
}

async function getQuestionAnswers(id: number) {
  return await getAnswers(id)
}

export default {
  createAnswer,
  getQuestionAnswers
}
import { QuestionData, VoteData } from "../controllers/questionController.js";
import {
  checkVotedQuestion,
  createNewQuestion,
  deleteVoteQuestion,
  getIlikeQuestions,
  getPaginatedQuestions,
  getQuestion,
  getQuestionsAmount,
  insertViewQuestion,
  insertVoteQuestion,
} from "../repositories/questionRepository.js";
import throwError from "../utils/throwError.js";

async function createQuestion(questionData: QuestionData) {
  return await createNewQuestion(questionData);
}

async function getQuestionsPage(page: number) {
  const questions = {
    questions: await getPaginatedQuestions(page),
    amount: await getQuestionsAmount(),
  };
  return questions;
}

async function getSpecificQuestion(id: number) {
  const question = await getQuestion(id);
  if (!question) throwError("Question not found", 404);

  return question;
}

async function getQuestionsBySearch(description: string) {
  const questions = await getIlikeQuestions(description);

  return questions;
}

async function viewQuestion(id: number) {
  const question = await insertViewQuestion(id);
  if (!question) throwError("Question not found", 404);

  return question;
}

async function voteQuestion(voteData: VoteData) {
  const question = await getSpecificQuestion(voteData.questionId);
  if (!question) throwError("Question not found", 404);

  const alreadyVoted = await checkVotedQuestion(voteData);
  if (alreadyVoted) {
    return await deleteVoteQuestion(voteData);
  } else {
    return await insertVoteQuestion(voteData)
  }
}

export default {
  createQuestion,
  getQuestionsPage,
  getSpecificQuestion,
  viewQuestion,
  voteQuestion,
  getQuestionsBySearch
};

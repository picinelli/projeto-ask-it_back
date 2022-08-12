import { QuestionData, VoteData } from "../controllers/questionController.js";
import {questionRepository} from "../repositories/questionRepository.js";
import throwError from "../utils/throwError.js";

async function createQuestion(questionData: QuestionData) {
  return await questionRepository.createNewQuestion(questionData);
}

async function getQuestionsPage(page: number) {
  const questions = {
    questions: await questionRepository.getPaginatedQuestions(page),
    amount: await questionRepository.getQuestionsAmount(),
  };
  return questions;
}

async function getSpecificQuestion(id: number) {
  const question = await questionRepository.getQuestion(id);
  if (!question) throwError("Question not found", 404);

  return question;
}

async function getQuestionsBySearch(description: string) {
  const questions = await questionRepository.getIlikeQuestions(description);

  return questions;
}

async function viewQuestion(id: number) {
  const isQuestionExist = await questionRepository.getQuestion(id)
  if (!isQuestionExist) throwError("Question not found", 404);

  const question = await questionRepository.insertViewQuestion(id);

  return question;
}

async function voteQuestion(voteData: VoteData) {
  const question = await questionRepository.getQuestion(voteData.questionId);
  if (!question) throwError("Question not found", 404);

  const alreadyVoted = await questionRepository.checkVotedQuestion(voteData);

  if (alreadyVoted) {
    return await questionRepository.deleteVoteQuestion(voteData);
  } else {
    return await questionRepository.insertVoteQuestion(voteData)
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

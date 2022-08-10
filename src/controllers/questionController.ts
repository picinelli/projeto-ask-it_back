import { Question, Vote } from "@prisma/client";
import { Request, Response } from "express";
import questionService from "../services/questionService.js";

export type QuestionData = Omit<Question, "createdAt" | "views" | "id">;
export type VoteData = Omit<Vote, "createdAt" | "id">;

export async function createQuestion(req: Request, res: Response) {
  const questionData: QuestionData = req.body;

  const question = await questionService.createQuestion(questionData);

  res.status(201).send(question);
}

export async function viewQuestion(req: Request, res: Response) {
  const questionId = Number(req.params.id);

  console.log(questionId, "AAAAAAAAAAAAAAAAAAAAA")
  await questionService.viewQuestion(questionId);

  res.sendStatus(201);
}

export async function voteQuestion(req: Request, res: Response) {
  let voteData: VoteData = req.body;
  voteData = { ...voteData, questionId: Number(voteData.questionId) };
  await questionService.voteQuestion(voteData);

  res.sendStatus(201);
}

export async function getQuestionsPage(req: Request, res: Response) {
  const page = Number(req.params.page);

  const questions = await questionService.getQuestionsPage(page);

  res.status(201).send(questions);
}

export async function getSpecificQuestion(req: Request, res: Response) {
  const questionId = Number(req.params.id);

  const question = await questionService.getSpecificQuestion(questionId);

  res.status(200).send(question);
}

export async function getQuestionsBySearch(req: Request, res: Response) {
  const description: string = req.body.description

  const question = await questionService.getQuestionsBySearch(description);

  res.status(200).send(question);
}

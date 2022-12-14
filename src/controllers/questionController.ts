import { Question, User, Vote } from "@prisma/client";
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

  if(page < 0) return res.status(400).send("Insert a valid page number")

  const questions = await questionService.getQuestionsPage(page);

  res.status(200).send(questions);
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

export async function deleteQuestion(req: Request, res: Response) {
  const questionId = Number(req.params.id);
  const user: User = res.locals.user

  await questionService.deleteSpecificQuestion(questionId, user);

  res.sendStatus(200);
}

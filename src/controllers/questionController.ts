import { Question } from "@prisma/client";
import { Request, Response } from "express";
import questionService from "../services/questionService.js";

export type QuestionData = Omit<Question, "createdAt" | "views" | "id">

export async function createQuestion(req: Request, res: Response) {
  const questionData: QuestionData = req.body

  const question = await questionService.createQuestion(questionData);

  res.status(201).send(question);
}

export async function getQuestionsPage(req: Request, res: Response) {
  const page = Number(req.params.page)

  const questions = await questionService.getQuestionsPage(page);

  res.status(201).send(questions);
}



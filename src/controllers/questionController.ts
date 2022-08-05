import { Question } from "@prisma/client";
import { Request, Response } from "express";
import questionService from "../services/questionService.js";
import userService from "../services/userService.js";

export type QuestionData = Omit<Question, "createdAt" | "views" | "id">

export async function createQuestion(req: Request, res: Response) {
  const questionData: QuestionData = req.body

  const question = await questionService.createQuestion(questionData);

  res.status(201).send(question);
}


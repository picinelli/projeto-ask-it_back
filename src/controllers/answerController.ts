import { Answer } from "@prisma/client";
import { Request, Response } from "express";
import answerService from "../services/answerService.js";

export type AnswerData = Omit<Answer, "createdAt" | "id">

export async function createAnswer(req: Request, res: Response) {
  const answerData: AnswerData = req.body

  console.log(answerData, "AAAAAAAAAAAAAAAAA")

  await answerService.createAnswer(answerData);

  res.sendStatus(201);
}

export async function getQuestionAnswers(req: Request, res: Response) {
  const id = Number(req.params.id)

  const answers = await answerService.getQuestionAnswers(id);

  res.status(200).send(answers);
}
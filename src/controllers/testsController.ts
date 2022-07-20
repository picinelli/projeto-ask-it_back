import { Request, Response } from "express";
import { testsService } from "../services/testsService.js";

export async function getTestsByDiscipline(req: Request, res: Response) {
  const tests = await testsService.getTestsByDiscipline()

  return res.status(200).send(tests)
}
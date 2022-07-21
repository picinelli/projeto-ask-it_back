import { Request, Response } from "express";
import { testsService } from "../services/testsService.js";

export async function getTestsByDiscipline(req: Request, res: Response) {
  const tests = await testsService.getTestsByDiscipline()

  return res.status(200).send(tests)
}

export async function getTestsByTeacher(req: Request, res: Response) {
  const tests = await testsService.getTestsByTeacher()

  return res.status(200).send(tests)
}

export async function getDisciplines(req: Request, res: Response) {
  const disciplines = await testsService.getDisciplines()

  return res.status(200).send(disciplines)
}
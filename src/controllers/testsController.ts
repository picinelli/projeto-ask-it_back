import { Request, Response } from "express";
import { testsService } from "../services/testsService.js";
import throwError from "../utils/throwError.js";

export async function getTests(req: Request, res: Response) {
  if (!req.query.groupBy)
    throwError("You need to specify how to GroupBy the tests", 403);
  if (req.query.groupBy === "disciplines") {
    const tests = await testsService.getTestsByDiscipline();
    return res.status(200).send(tests);
  }
  if (req.query.groupBy === "teachers") {
    const tests = await testsService.getTestsByTeacher();
    return res.status(200).send(tests);
  } else {
    throwError("You need to choose a valid GroupBy query string", 403);
  }
}

export async function getDisciplines(req: Request, res: Response) {
  const disciplines = await testsService.getDisciplines();

  return res.status(200).send(disciplines);
}

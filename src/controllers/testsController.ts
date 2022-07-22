import { Request, Response } from "express";
import { TestInfo } from "../schemas/testSchemas.js";
import { testsService } from "../services/testsService.js";
import throwError from "../utils/throwError.js";

export async function postTest(req: Request, res: Response) {
  const testInfo: TestInfo = req.body

  const data = await testsService.postTest(testInfo);
  const id = data.id.toString()

  console.log(id)

  return res.status(201).send(id)
}

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
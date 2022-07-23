import { Request, Response } from "express";
import { disciplinesService } from "../services/disciplinesService.js";

export async function getDisciplines(req: Request, res: Response) {
  const disciplines = await disciplinesService.getDisciplines();

  return res.status(200).send(disciplines);
}
import { Request, Response } from "express";
import { teachersService } from "../services/teachersService.js";
import throwError from "../utils/throwError.js";

export async function getTeachers(req: Request, res: Response) {
  const teachers = await teachersService.getTeachers();

  return res.status(200).send({teachers});
}

export async function getTeachersByDisciplineId(req: Request, res: Response) {
  const disciplineId = req.params.id
  const numId = Number(disciplineId)

  if(isNaN(numId) || typeof(numId) !== 'number') throwError("You need to send a valid format Id", 403)
  if(!disciplineId) throwError("You need to send a disciplineId", 403)

  const teachers = await teachersService.getTeachersByDisciplineId(numId);

  return res.status(200).send({teachers});
}
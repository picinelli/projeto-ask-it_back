import { Request, Response } from "express";
import { categoriesService } from "../services/categoriesService.js";

export async function getCategories(req: Request, res: Response) {
  const categories = await categoriesService.getCategories();

  return res.status(200).send({categories});
}
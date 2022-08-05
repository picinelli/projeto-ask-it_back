import { User } from "@prisma/client";
import { Request, Response } from "express";
import userService from "../services/userService.js";

export async function getUserInfo(req: Request, res: Response) {
  const userId = res.locals.token.userId

  const userInfo = await userService.getUserInfo(userId);

  res.status(200).send(userInfo);
}


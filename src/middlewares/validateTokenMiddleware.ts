import { NextFunction, Request, Response } from "express";
import throwError from "../utils/throwError.js";
import jwt from "jsonwebtoken"

export async function validateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;
    if (!authorization) return throwError("Token not found", 401);
  
    const token = authorization.replace("Bearer", "").trim();
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decodedToken)

    res.locals.token = decodedToken
  
    next();
  } catch(err) {
    console.log(err)
    res.status(400).send("Token format incorrect")
  }
  
}

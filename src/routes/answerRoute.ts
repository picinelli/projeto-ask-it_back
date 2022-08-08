import { Router } from "express";
import { createAnswer, getQuestionAnswers } from "../controllers/answerController.js";
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import { validateToken } from "../middlewares/validateTokenMiddleware.js";
import { answerSchema } from "../schemas/answerSchema.js";

const answerRoute = Router()

answerRoute.post("/answer", validateSchema(answerSchema), validateToken, createAnswer)
answerRoute.get("/answers/:id", getQuestionAnswers)

export default answerRoute
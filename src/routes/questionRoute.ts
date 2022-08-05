import { Router } from "express";
import { createQuestion } from "../controllers/questionController.js";
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import { questionSchema } from "../schemas/questionSchemas.js";

const questionRoute = Router()

questionRoute.post("/question", validateSchema(questionSchema), createQuestion)

export default questionRoute
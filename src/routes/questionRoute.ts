import { Router } from "express";
import { createQuestion, getQuestionsPage } from "../controllers/questionController.js";
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import { questionSchema } from "../schemas/questionSchemas.js";

const questionRoute = Router()

questionRoute.post("/question", validateSchema(questionSchema), createQuestion)
questionRoute.get("/questions/:page", getQuestionsPage)

export default questionRoute
import { Router } from "express";
import {
  createQuestion,
  deleteQuestion,
  getQuestionsBySearch,
  getQuestionsPage,
  getSpecificQuestion,
  viewQuestion,
  voteQuestion,
} from "../controllers/questionController.js";
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import { validateToken } from "../middlewares/validateTokenMiddleware.js";
import { questionSchema, searchQuestionSchema } from "../schemas/questionSchemas.js";
import { voteSchema } from "../schemas/voteSchema.js";

const questionRoute = Router();

questionRoute.post("/question", validateSchema(questionSchema), validateToken, createQuestion);
questionRoute.post("/question/view/:id", viewQuestion);
questionRoute.post("/question/vote", validateSchema(voteSchema), validateToken, voteQuestion);
questionRoute.post("/search/questions", validateSchema(searchQuestionSchema), getQuestionsBySearch);
questionRoute.get("/question/:id", getSpecificQuestion);
questionRoute.get("/questions/:page", getQuestionsPage);
questionRoute.delete("/question/:id", validateToken, deleteQuestion)

export default questionRoute;

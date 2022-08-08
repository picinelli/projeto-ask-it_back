import { Router } from "express";
import {
  createQuestion,
  getQuestionsPage,
  getSpecificQuestion,
  viewQuestion,
  voteQuestion,
} from "../controllers/questionController.js";
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import { validateToken } from "../middlewares/validateTokenMiddleware.js";
import { questionSchema } from "../schemas/questionSchemas.js";
import { voteSchema } from "../schemas/voteSchema.js";

const questionRoute = Router();

questionRoute.post(
  "/question",
  validateSchema(questionSchema),
  validateToken,
  createQuestion
);
questionRoute.post("/question/view/:id", viewQuestion);
questionRoute.post(
  "/question/vote",
  validateSchema(voteSchema),
  validateToken,
  voteQuestion
);
questionRoute.get("/question/:id", getSpecificQuestion);
questionRoute.get("/questions/:page", getQuestionsPage);

export default questionRoute;

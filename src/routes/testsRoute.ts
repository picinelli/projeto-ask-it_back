import { Router } from "express";
import { getCategories, getTests, postTest } from "../controllers/testsController.js";
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import { validateToken } from "../middlewares/validateTokenMiddleware.js";
import { createTestSchema } from "../schemas/testSchemas.js";

const testsRoute = Router()

testsRoute.post("/test", validateToken, validateSchema(createTestSchema), postTest)
testsRoute.get("/tests", validateToken, getTests)
testsRoute.get("/categories", validateToken, getCategories)

export default testsRoute
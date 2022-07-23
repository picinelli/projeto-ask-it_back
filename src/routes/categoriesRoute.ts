import { Router } from "express";
import { getCategories } from "../controllers/categoriesController.js";
import { validateToken } from "../middlewares/validateTokenMiddleware.js";

const categoriesRoute = Router()

categoriesRoute.get("/categories", validateToken, getCategories)

export default categoriesRoute
import { Router } from "express";
import { getDisciplines } from "../controllers/disciplinesController.js";
import { validateToken } from "../middlewares/validateTokenMiddleware.js";

const disciplineRoute = Router()

disciplineRoute.get("/disciplines", validateToken, getDisciplines)

export default disciplineRoute
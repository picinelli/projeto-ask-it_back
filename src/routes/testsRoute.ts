import { Router } from "express";
import { getTestsByDiscipline } from "../controllers/testsController.js";

const testsRoute = Router()

testsRoute.get("/tests/discipline", getTestsByDiscipline)

export default testsRoute
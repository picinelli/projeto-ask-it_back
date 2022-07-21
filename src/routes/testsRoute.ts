import { Router } from "express";
import { getDisciplines, getTestsByDiscipline, getTestsByTeacher } from "../controllers/testsController.js";

const testsRoute = Router()

testsRoute.get("/tests/discipline", getTestsByDiscipline)
testsRoute.get("/tests/teacher", getTestsByTeacher)
testsRoute.get("/disciplines", getDisciplines)

export default testsRoute
import { Router } from "express";
import { getDisciplines, getTests } from "../controllers/testsController.js";

const testsRoute = Router()

testsRoute.get("/tests", getTests)
testsRoute.get("/disciplines", getDisciplines)

export default testsRoute
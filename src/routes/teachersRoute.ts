import { Router } from "express";
import { getTeachers, getTeachersByDisciplineId } from "../controllers/teachersController.js";
import { validateToken } from "../middlewares/validateTokenMiddleware.js";

const teachersRoute = Router()

teachersRoute.get("/teachers", validateToken, getTeachers)
teachersRoute.get("/teachers/discipline/:id", validateToken, getTeachersByDisciplineId)

export default teachersRoute
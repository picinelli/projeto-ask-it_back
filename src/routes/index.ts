import { Router } from "express";
import authRoute from "./authRoute.js";
import categoriesRoute from "./categoriesRoute.js";
import disciplineRoute from "./disciplineRoute.js";
import teachersRoute from "./teachersRoute.js";
import testsRoute from "./testsRoute.js";

const router = Router()

router.use(authRoute)
router.use(testsRoute)
router.use(categoriesRoute)
router.use(disciplineRoute)
router.use(teachersRoute)

export default router
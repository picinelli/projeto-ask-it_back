import { Router } from "express";
import authRoute from "./authRoute.js";
import testsRoute from "./testsRoute.js";

const router = Router()

router.use(authRoute)
router.use(testsRoute)

export default router
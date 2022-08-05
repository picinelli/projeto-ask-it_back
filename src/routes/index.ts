import { Router } from "express";
import authRoute from "./authRoute.js";
import questionRoute from "./questionRoute.js";
import userRoute from "./userRoute.js";

const router = Router()

router.use(authRoute)
router.use(userRoute)
router.use(questionRoute)

export default router
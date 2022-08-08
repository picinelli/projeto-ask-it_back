import { Router } from "express";
import answerRoute from "./answerRoute.js";
import authRoute from "./authRoute.js";
import questionRoute from "./questionRoute.js";
import userRoute from "./userRoute.js";

const router = Router()

router.use(authRoute)
router.use(userRoute)
router.use(questionRoute)
router.use(answerRoute)

export default router
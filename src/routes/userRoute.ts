import { Router } from "express";
import { getUserInfo } from "../controllers/userController.js";
import { validateToken } from "../middlewares/validateTokenMiddleware.js";

const userRoute = Router()

userRoute.get("/user/info", validateToken, getUserInfo)

export default userRoute
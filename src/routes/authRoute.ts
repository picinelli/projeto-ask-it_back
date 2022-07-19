import { Router } from "express";
import { signUp, signIn } from "../controllers/authController.js";
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import { signinSchema, signupSchema } from "../schemas/authSchemas.js";

const authRoute = Router()

authRoute.post("/sign-up", validateSchema(signupSchema), signUp)
authRoute.post("/sign-in", validateSchema(signinSchema), signIn)

export default authRoute
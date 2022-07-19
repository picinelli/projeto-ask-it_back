import joi from "joi"

export const signupSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(5).required(),
  confirm_password: joi.ref("password")
})

export const signinSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(5).required()
})
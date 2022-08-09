import joi from "joi"

export const questionSchema = joi.object({
  description: joi.string().min(50).max(2000).required(),
  userId: joi.number().required()
})

export const searchQuestionSchema = joi.object({
  description: joi.string().max(2000).required(),
})
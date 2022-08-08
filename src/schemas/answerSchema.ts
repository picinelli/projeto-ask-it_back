import joi from "joi"

export const answerSchema = joi.object({
  description: joi.string().min(30).max(2000).required(),
  username: joi.string().required(),
  questionId: joi.number().required()
})
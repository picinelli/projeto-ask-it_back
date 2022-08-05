import joi from "joi"

export const questionSchema = joi.object({
  description: joi.string().max(2000).required(),
  userId: joi.number().required()
})
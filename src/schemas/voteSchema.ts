import joi from "joi";

export const voteSchema = joi.object({
  questionId: joi.number().required(),
  username: joi.string().required(),
});

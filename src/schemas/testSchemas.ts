import { Test } from "@prisma/client"
import joi from "joi"

export type TestInfo = Test & {teacherId: number, disciplineId: number}

export const createTestSchema = joi.object<TestInfo>({
  name: joi.string().required(),
  pdfUrl: joi.string().uri().required(),
  categoryId: joi.number().required(),
  teacherId: joi.number().required(),
  disciplineId: joi.number().required()
})
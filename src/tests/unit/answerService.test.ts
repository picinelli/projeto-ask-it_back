import { jest } from "@jest/globals";
import { answerRepository } from "../../repositories/answerRepository";
import { questionRepository } from "../../repositories/questionRepository";
import answerService from "../../services/answerService";
import { answerFactory } from "../factories/answerFactory";
import { questionFactory } from "../factories/questionFactory";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("UNIT test - createAnswer", () => {
  it("should create answer", async () => {
    jest
      .spyOn(answerRepository, "insertAnswer")
      .mockResolvedValueOnce(answerFactory.createAnswer());

    answerService.createAnswer(answerFactory.createAnswerData());

    expect(answerRepository.insertAnswer).toBeCalled();
  });
});

describe("UNIT test - getQuestionAnswers", () => {
  it("given invalid questionId should throw error", async () => {
    jest.spyOn(questionRepository, "getQuestion").mockResolvedValue(null);

    const request = answerService.getQuestionAnswers(1);

    expect(request).rejects.toEqual({
      type: 404,
      message: "Question not found",
    });
  });

  it("given valid questionId should throw error", async () => {
    jest
      .spyOn(questionRepository, "getQuestion")
      .mockResolvedValue(questionFactory.createSpecificQuestion());
    jest
      .spyOn(answerRepository, "getAnswers")
      .mockResolvedValue([answerFactory.createAnswer()]);

    await answerService.getQuestionAnswers(1);

    expect(answerRepository.getAnswers).toBeCalled();
  });
});

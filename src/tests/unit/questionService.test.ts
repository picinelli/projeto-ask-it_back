import { jest } from "@jest/globals";
import { getQuestionsPage } from "../../controllers/questionController";
import { questionRepository } from "../../repositories/questionRepository";
import questionService from "../../services/questionService";
import { questionFactory } from "../factories/questionFactory";
import { __CreateQuestionAndReturnInfo } from "../integration/app.test";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("UNIT test - createQuestion", () => {
  it("should return question", async () => {
    jest
      .spyOn(questionRepository, "createNewQuestion")
      .mockResolvedValue(questionFactory.createQuestion());

    const question = await questionService.createQuestion(
      questionFactory.createQuestionData()
    );

    expect(question.id).toBeDefined();
  });
});

describe("UNIT test - getQuestionsPage", () => {
  it("should return 10 paginated questions", async () => {
    jest
      .spyOn(questionRepository, "getPaginatedQuestions")
      .mockResolvedValue(questionFactory.createTenQuestions());
    jest
      .spyOn(questionRepository, "getQuestionsAmount")
      .mockResolvedValue({ _count: 50 });

    const request = await questionService.getQuestionsPage(1);

    expect(request.questions.length).toBe(10);
  });
});

describe("UNIT test - getSpecificQuestion", () => {
  it("given invalid questionId should throw error", async () => {
    jest.spyOn(questionRepository, "getQuestion").mockResolvedValue(null);

    const request = questionService.getSpecificQuestion(1);

    expect(request).rejects.toEqual({
      type: 404,
      message: "Question not found",
    });
  });

  it("given valid questionId should throw error", async () => {
    jest
      .spyOn(questionRepository, "getQuestion")
      .mockResolvedValue(questionFactory.createSpecificQuestion());

    const request = await questionService.getSpecificQuestion(1);

    expect(request.id).toBeDefined();
  });
});

describe("UNIT test - getQuestionsBySearch", () => {
  it("should return question", async () => {
    jest
      .spyOn(questionRepository, "getIlikeQuestions")
      .mockResolvedValue(questionFactory.createTenQuestions());

    const question = await questionService.getQuestionsBySearch("test");

    expect(question.length).toBeGreaterThan(0);
  });
});

describe("UNIT test - viewQuestion", () => {
  it("given invalid questionId should throw error", async () => {
    jest.spyOn(questionRepository, "getQuestion").mockResolvedValue(null);

    const request = questionService.viewQuestion(1);

    expect(request).rejects.toEqual({
      type: 404,
      message: "Question not found",
    });
  });

  it("given valid questionId should increase views", async () => {
    const resolvedQuestion = questionFactory.createSpecificQuestion();
    jest
      .spyOn(questionRepository, "getQuestion")
      .mockResolvedValue(resolvedQuestion);
    jest.spyOn(questionRepository, "insertViewQuestion").mockResolvedValue({
      ...resolvedQuestion,
      views: resolvedQuestion.views + 1,
    });

    const request = await questionService.viewQuestion(1);

    expect(resolvedQuestion.views).toBeLessThan(request.views);
  });
});

describe("UNIT test - voteQuestion", () => {
  it("given invalid questionId should throw error", async () => {
    jest.spyOn(questionRepository, "getQuestion").mockResolvedValue(null);

    const request = questionService.voteQuestion({ username: "test", questionId: 1 });

    expect(request).rejects.toEqual({
      type: 404,
      message: "Question not found",
    });
  });

  it("given valid info, with already votes should delete vote", async () => {
    // const token
    // const question = await __CreateQuestionAndReturnInfo(userId: 1,)
    jest
      .spyOn(questionRepository, "getQuestion")
      .mockResolvedValue(questionFactory.createSpecificQuestion());
    jest
      .spyOn(questionRepository, "checkVotedQuestion")
      .mockResolvedValue(questionFactory.createSpecificQuestion());
    jest
      .spyOn(questionRepository, "deleteVoteQuestion")
      .mockResolvedValue(null);

    await questionService.voteQuestion({ username: "test", questionId: 1 });

    expect(questionRepository.deleteVoteQuestion).toBeCalled();
  });

  it("given valid info, on not voted question should create vote", async () => {
    // const token
    // const question = await __CreateQuestionAndReturnInfo(userId: 1,)
    jest
      .spyOn(questionRepository, "getQuestion")
      .mockResolvedValue(questionFactory.createSpecificQuestion());
    jest
      .spyOn(questionRepository, "checkVotedQuestion")
      .mockResolvedValue(null);
    jest
      .spyOn(questionRepository, "insertVoteQuestion")
      .mockResolvedValue(null);

    await questionService.voteQuestion({ username: "test", questionId: 1 });

    expect(questionRepository.insertVoteQuestion).toBeCalled();
  });
});

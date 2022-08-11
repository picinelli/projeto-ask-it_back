import { jest } from "@jest/globals";
import { userRepository } from "../../repositories/userRepository";
import userService from "../../services/userService";
import userFactory from "../factories/userFactory";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("UNIT test - getUserInfo", () => {
  it("given non-existent user, should throw error", async () => {
    jest.spyOn(userRepository, "getUserInfoById").mockResolvedValueOnce(null);

    const request = userService.getUserInfo(1);

    expect(request).rejects.toEqual({
      type: 404,
      message: "User not found",
    });
  });

  it("given existent user, should return userInfo", async () => {
    jest
      .spyOn(userRepository, "getUserInfoById")
      .mockResolvedValueOnce(userFactory.createUserData());

    const request = await userService.getUserInfo(1);

    expect(request).toStrictEqual(userFactory.crecateUserData());
  });
});

import { jest } from "@jest/globals";

import { authRepository } from "../../repositories/authRepository.js";
import { authService } from "../../services/authService.js";
import userFactory from "../factories/userFactory.js";

beforeEach(async () => {
  jest.clearAllMocks();
});

//FIXME: Esta sempre caindo no if
describe("UNIT test - signUp", () => {
  it("given existent email, should throw error", async () => {
    const userData = userFactory.createUser();
    jest
      .spyOn(authRepository, "getUserByEmail")
      .mockResolvedValueOnce(userFactory.createUser());

    const request = authService.signUp(userData);

    expect(request).rejects.toEqual({
      type: 409,
      message: "This email is already in use",
    });
  });

  it("given non-existent email, should create account", async () => {
    jest.spyOn(authRepository, "getUserByEmail").mockResolvedValueOnce(null);
    jest
      .spyOn(authRepository, "insertUser")
      .mockResolvedValueOnce(userFactory.createUser());

    await authService.signUp(userFactory.createLogin());

    expect(authRepository.insertUser).toBeCalledTimes(1);
  });
});

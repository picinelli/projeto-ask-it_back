import { jest } from "@jest/globals";

import { authRepository } from "../../repositories/authRepository.js";
import { authService } from "../../services/authService.js";
import userFactory from "../factories/userFactory.js";
import bcrypt from 'bcrypt'

beforeEach(() => {
  jest.clearAllMocks();
});

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

describe("UNIT test - signIn", () => {
  it("given non-existent email, should receive error", async () => {
    jest.spyOn(authRepository, "getUserByEmail").mockResolvedValueOnce(null);

    const request = authService.signIn(userFactory.createLogin());

    expect(request).rejects.toEqual({
      type: 404,
      message: "This account does not exists!",
    });
  });

  it("given existent email with correct pass, should return token", async () => {
    jest.spyOn(authRepository, "getUserByEmail").mockResolvedValueOnce(userFactory.createUser());
    jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => true)

    const request = await authService.signIn(userFactory.createLogin());

    expect(request.token).toBeTruthy()
  });

  it("given existent email with correct pass, should return token", async () => {
    jest.spyOn(authRepository, "getUserByEmail").mockResolvedValueOnce(userFactory.createUser());
    jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => false)

    const request = authService.signIn(userFactory.createLogin());

    expect(request).rejects.toEqual({
      type: 403,
      message: "Email or password incorrect",
    });
  });
});

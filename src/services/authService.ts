import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { authRepository } from "../repositories/authRepository.js";
import throwError from "../utils/throwError.js";
import { encryptBcrypt } from "../utils/encrypt.js";
import { UserInfo } from "../controllers/authController.js";

export interface tokenInfo {
  token: string;
  userId: number;
}

async function signUp(userInfo: UserInfo) {
  const user = await authRepository.getUserByEmail(userInfo.email);
  if (user) throwError("This email is already in use", 409);

  userInfo = { ...userInfo, password: await encryptBcrypt(userInfo.password) };

  await authRepository.insertUser(userInfo);
}

async function signIn(userInfo: UserInfo) {
  const { email, password } = userInfo;
  const user = await authRepository.getUserByEmail(email);
  if (!user) throwError("This account does not exists!", 404);

  const isPasswordCorrect = bcrypt.compareSync(password, user.password);
  if (!isPasswordCorrect) throwError("Email or password incorrect", 403);

  return { token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET) };
}

export const authService = {
  signUp,
  signIn,
};

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

import { User } from "@prisma/client";
import { getUserByEmail, insertUser } from "../repositories/authRepository.js";
import throwError from "../utils/throwError.js";
import { encryptBcrypt } from "../utils/encrypt.js";

export interface tokenInfo {
  token: string,
  userId: number
}

async function signUp(userInfo: User) {
  const user = await getUserByEmail(userInfo.email);
  if (user) throwError("This email is already in use", 409);

  userInfo = { ...userInfo, password: await encryptBcrypt(userInfo.password) };

  await insertUser(userInfo);
}

async function signIn(userInfo: User) {
  const { email, password } = userInfo;
  const user = await getUserByEmail(email);
  if (!user) throwError("This account does not exists!", 404);
  
  const isPasswordCorrect = bcrypt.compareSync(password, user.password)
  if (!isPasswordCorrect) throwError("Email or password incorrect", 400)

  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
}



export const authService = {
  signUp,
  signIn
};

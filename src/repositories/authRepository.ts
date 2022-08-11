import { UserInfo } from "../controllers/authController.js";
import prisma from "../database.js";

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: number) {
  return await prisma.user.findUnique({ where: { id } });
}

export async function insertUser(userInfo: UserInfo) {
  return await prisma.user.create({
    data: {
      email: userInfo.email,
      username: userInfo.username,
      password: userInfo.password
    },
  });
}

export const authRepository = {
  getUserByEmail,
  getUserById,
  insertUser
}

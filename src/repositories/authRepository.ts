import { UserInfo } from "../controllers/authController.js";
import prisma from "../database.js";

async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}

async function getUserById(id: number) {
  return await prisma.user.findUnique({ where: { id } });
}

async function insertUser(userInfo: UserInfo) {
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

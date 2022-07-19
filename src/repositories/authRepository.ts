import { User } from "@prisma/client";
import prisma from "../database.js";

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: number) {
  return await prisma.user.findUnique({ where: { id } });
}

export async function insertUser(userInfo: User) {
  return await prisma.user.create({
    data: {
      email: userInfo.email,
      password: userInfo.password,
    },
  });
}

import prisma from "../database.js";

export async function getUserInfoById(id: number) {
  return await prisma.user.findUnique({
    select: {
      id: true,
      username: true,
      email: true,
    },
    where: { id },
  });
}
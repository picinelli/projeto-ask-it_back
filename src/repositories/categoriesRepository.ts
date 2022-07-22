import prisma from "../database.js";

async function getCategoryById(categoryId: number) {
  return await prisma.category.findUnique({ where: { id: categoryId } });
}

const categoriesRepository = {
  getCategoryById
}

export default categoriesRepository

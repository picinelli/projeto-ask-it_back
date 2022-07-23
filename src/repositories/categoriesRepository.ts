import prisma from "../database.js";

async function getCategoryById(categoryId: number) {
  return await prisma.category.findUnique({ where: { id: categoryId } });
}

async function getCategories() {
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}

const categoriesRepository = {
  getCategoryById,
  getCategories
}

export default categoriesRepository

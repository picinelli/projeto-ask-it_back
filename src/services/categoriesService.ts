import categoriesRepository from "../repositories/categoriesRepository.js";

export async function getCategories() {
  const categories = await categoriesRepository.getCategories();

  return categories;
}

export const categoriesService = {
  getCategories,
};

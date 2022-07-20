import { testsRepository } from "../repositories/testsRepository.js";

async function getTestsByDiscipline() {
  const tests = await testsRepository.getTestsByDiscipline();

  return tests;
}

export const testsService = {
  getTestsByDiscipline,
};

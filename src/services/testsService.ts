import categoriesRepository from "../repositories/categoriesRepository.js";
import disciplinesRepository from "../repositories/disciplinesRepository.js";
import teachersRepository from "../repositories/teachersRepository.js";
import { testsRepository } from "../repositories/testsRepository.js";
import { TestInfo } from "../schemas/testSchemas.js";
import throwError from "../utils/throwError.js";

async function postTest(testInfo: TestInfo) {
  const { teacherId, disciplineId, categoryId } = testInfo;
  const teacher = await teachersRepository.getTeacherById(teacherId);
  const discipline = await disciplinesRepository.getDisciplineById(disciplineId);
  const category = await categoriesRepository.getCategoryById(categoryId);

  if (!teacher || !discipline || !category) {
    throwError("Teacher, discipline or category was not found", 404);
  }

  const teacherDiscipline = await teachersRepository.postTeacherDiscipline(teacherId, disciplineId);
  await testsRepository.createTest(testInfo, teacherDiscipline.id);

  return teacherDiscipline
}

async function getTestsByDiscipline() {
  const tests = await testsRepository.getTestsByDiscipline();

  return tests;
}

async function getTestsByTeacher() {
  const tests = await testsRepository.getTestsByTeacher();

  return tests;
}

async function getCisciplines() {
  const categories = await categoriesRepository.getCategories();

  return categories;
}

export const testsService = {
  getTestsByDiscipline,
  getTestsByTeacher,
  getCisciplines,
  postTest,
};

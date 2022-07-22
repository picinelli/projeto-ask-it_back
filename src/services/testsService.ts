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

  const formatedTests = changeTestsFormat(tests);

  return tests;
}

async function getTestsByTeacher() {
  const tests = await testsRepository.getTestsByTeacher();

  return tests;
}

async function getDisciplines() {
  const disciplines = await disciplinesRepository.getDisciplines();

  return disciplines;
}

export const testsService = {
  getTestsByDiscipline,
  getTestsByTeacher,
  getDisciplines,
  postTest,
};

function changeTestsFormat(tests) {
  return tests.map((e) => {
    return {
      number: e.number,
      disciplines: e.Discipline.map((e) => {
        return {
          disciplineName: e.name,
          disciplineInfo: e.TeacherDiscipline.map((e) => {
            return {
              teacherName: e.teacher.name,
              tests: e.Test.map((e) => {
                return {
                  ...e,
                  category: e.category.name,
                };
              }),
            };
          }),
        };
      }),
    };
  });
}

import { testsRepository } from "../repositories/testsRepository.js";


async function getTestsByDiscipline() {
  const tests = await testsRepository.getTestsByDiscipline();

  const formatedTests = changeTestsFormat(tests)

  return tests;
}

async function getTestsByTeacher() {
  const tests = await testsRepository.getTestsByTeacher();

  return tests;
}

async function getDisciplines() {
  const disciplines = await testsRepository.getDisciplines();

  return disciplines;
}

export const testsService = {
  getTestsByDiscipline,
  getTestsByTeacher,
  getDisciplines
};


function changeTestsFormat(tests) {
  return (
    tests.map(e => {
      return {
        number: e.number,
        disciplines: e.Discipline.map(e => {
          return {
            disciplineName: e.name,
            disciplineInfo: e.TeacherDiscipline.map(e => {
              return {
                teacherName: e.teacher.name,
                tests: e.Test.map(e => {
                  return {
                    ...e,
                    category: e.category.name
                  }
                })
              }
            })
          }
        })
      }
    })
  )
}

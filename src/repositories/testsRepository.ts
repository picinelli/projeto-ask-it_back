import prisma from "../database.js";
import { TestInfo } from "../schemas/testSchemas.js";

async function getTestsByDiscipline() {
  //TODO: Alterar Discipline para disciplines?
  const terms = await prisma.term.findMany({
    select: {
      id: true,
      number: true,
      Discipline: {
        select: {
          id: true,
          name: true,
          TeacherDiscipline: {
            select: {
              teacher: {
                select: {
                  name: true,
                },
              },
              Test: {
                select: {
                  id: true,
                  name: true,
                  pdfUrl: true,
                  createdAt: true,
                  category: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
                orderBy: {
                  categoryId: "asc",
                },
              },
            },
            where: {
              Test: {
                some: {
                  NOT: undefined,
                },
              },
            },
          },
        },
      },
    },
    where: {
      Discipline: {
        some: {
          TeacherDiscipline: {
            some: {
              NOT: undefined,
            },
          },
        },
      },
    },
    orderBy: {
      number: "asc",
    },
  });

  return terms;
}

async function getTestsByTeacher() {
  return await prisma.teacherDiscipline.findMany({
    select: {
      id: true,
      teacher: {
        select: {
          id: true,
          name: true,
        },
      },
      discipline: {
        select: {
          id: true,
          name: true,
        },
      },
      Test: {
        select: {
          id: true,
          pdfUrl: true,
          name: true,
          category: {
            select: {
              id: true,
            },
          },
        },
      },
    },
    where: {
      Test: {
        some: {
          NOT: undefined,
        },
      },
    },
  });
}

async function createTest(testInfo: TestInfo, teacherDisciplineId: number) {
  return await prisma.test.create({ data: {
    name: testInfo.name,
    pdfUrl: testInfo.pdfUrl,
    categoryId: testInfo.categoryId,
    teacherDisciplineId
  } });
}

export const testsRepository = {
  getTestsByDiscipline,
  getTestsByTeacher,
  createTest,
};

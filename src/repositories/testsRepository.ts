import prisma from "../database.js";
import { TestInfo } from "../schemas/testSchemas.js";

async function getTestsByDiscipline() {
  const terms = await prisma.term.findMany({
    select: {
      id: true,
      number: true,
      disciplines: {
        select: {
          id: true,
          name: true,
          teacherDisciplines: {
            select: {
              teacher: {
                select: {
                  name: true,
                },
              },
              tests: {
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
              tests: {
                some: {
                  NOT: undefined,
                },
              },
            },
          },
        },
        where: {
          teacherDisciplines: {
            some: {
              NOT: undefined
            }
          }
        }
      },
    },
    where: {
      disciplines: {
        some: {
          teacherDisciplines: {
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
      tests: {
        select: {
          id: true,
          pdfUrl: true,
          name: true,
          createdAt: true,
          category: {
            select: {
              id: true,
            },
          },
        },
      },
    },
    where: {
      tests: {
        some: {
          NOT: undefined,
        },
      },
    },
  });
}

async function createTest(testInfo: TestInfo, teacherDisciplineId: number) {
  return await prisma.test.create({
    data: {
      name: testInfo.name,
      pdfUrl: testInfo.pdfUrl,
      categoryId: testInfo.categoryId,
      teacherDisciplineId,
    },
  });
}

export const testsRepository = {
  getTestsByDiscipline,
  getTestsByTeacher,
  createTest,
};

import prisma from "../database.js";

async function getTestsByDiscipline() {
  // return await prisma.discipline.findMany({
  //   select: {

  //   }
  // })

//TODO: Alterar Discipline para disciplines?
  return await prisma.term.findMany({
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
                  name: true
                }
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
                    }
                  }
                },
                orderBy: {
                  categoryId: "asc"
                },
              }
            },
            where: {
              Test: {
                some: {
                  NOT: undefined
                }
              }
            }
          },
        },
      },
    },
    orderBy: {
      number: 'asc'
    },
  });
}

async function getTestsByTeacher() {
  return await prisma.teacherDiscipline.findMany({
    select: {
      id: true,
      teacher: {
        select: {
          id: true,
          name: true
        }
      },
      discipline: {
        select: {
          id: true,
          name: true,
        }
      },
      Test: {
        select: {
          id: true,
          pdfUrl: true,
          name: true,
          category: {
            select: {
              id: true
            }
          }
        }
      }
    },
    where: {
      Test: {
        some: {
          NOT: undefined
        }
      }
    },
    
  })
}

async function getDisciplines() {
  return await prisma.discipline.findMany({
    select: {
      id: true,
      name: true
    }
  })
}

export const testsRepository = {
  getTestsByDiscipline,
  getTestsByTeacher,
  getDisciplines
};

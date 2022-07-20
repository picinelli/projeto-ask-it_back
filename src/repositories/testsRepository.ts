import prisma from "../database.js";

async function getTestsByDiscipline() {
  return await prisma.term.findMany({
    select: {
      number: true,
      Discipline: {
        select: {
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
                  category: {
                    select: {
                      name: true
                    }
                  }
                },
                orderBy: {
                  categoryId: "asc"
                },
              }
            }, 
          }
        },
      },
    },
    orderBy: {
      number: 'asc'
    },
  });
}

export const testsRepository = {
  getTestsByDiscipline,
};

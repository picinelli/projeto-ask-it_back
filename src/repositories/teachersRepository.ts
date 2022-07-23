import prisma from "../database.js";

async function getTeachersByDisciplineId(id: number) {
  return await prisma.discipline.findMany({
    select: {
      teacherDisciplines: {
        select: {
          teacher: {
            select: {
              name: true,
              id: true
            }
          }
        },
      }
    },
    where: {
      teacherDisciplines: {
        some: {
          NOT: undefined
        }
      },
      AND : {
        id: id
      },
    }
  });
}

async function getTeachers() {
  return await prisma.teacher.findMany({});
}

async function getTeacherById(teacherId: number) {
  return await prisma.teacher.findUnique({ where: { id: teacherId } });
}

async function postTeacherDiscipline(teacherId: number, disciplineId: number) {
  return await prisma.teacherDiscipline.create({
    data: {
      teacherId,
      disciplineId,
    },
  });
}

const teachersRepository = {
  getTeacherById,
  postTeacherDiscipline,
  getTeachers,
  getTeachersByDisciplineId
};

export default teachersRepository;

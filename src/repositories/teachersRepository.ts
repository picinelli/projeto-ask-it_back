import prisma from "../database.js";

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
  postTeacherDiscipline
};

export default teachersRepository;

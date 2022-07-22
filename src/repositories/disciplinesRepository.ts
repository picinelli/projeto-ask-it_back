import prisma from "../database.js";

async function getDisciplines() {
  return await prisma.discipline.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}

async function getDisciplineById(disciplineId: number) {
  return await prisma.discipline.findUnique({ where: { id: disciplineId } });
}


const disciplinesRepository = {
  getDisciplines,
  getDisciplineById
}

export default disciplinesRepository
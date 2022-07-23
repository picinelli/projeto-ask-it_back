import prisma from "../database.js";

async function getDisciplineById(disciplineId: number) {
  return await prisma.discipline.findUnique({ where: { id: disciplineId } });
}

async function getDisciplines() {
  return await prisma.discipline.findMany({});
}


const disciplinesRepository = {
  getDisciplineById,
  getDisciplines
}

export default disciplinesRepository
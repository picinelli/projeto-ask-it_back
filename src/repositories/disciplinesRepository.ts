import prisma from "../database.js";

async function getDisciplineById(disciplineId: number) {
  return await prisma.discipline.findUnique({ where: { id: disciplineId } });
}


const disciplinesRepository = {
  getDisciplineById
}

export default disciplinesRepository
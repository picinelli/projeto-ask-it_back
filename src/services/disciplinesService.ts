import disciplinesRepository from "../repositories/disciplinesRepository.js";

export async function getDisciplines() {
  const disciplines = await disciplinesRepository.getDisciplines();

  return { disciplines };
}

export const disciplinesService = {
  getDisciplines,
};

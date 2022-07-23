import teachersRepository from "../repositories/teachersRepository.js";

export async function getTeachers() {
  const teachers = await teachersRepository.getTeachers();

  return teachers;
}

export async function getTeachersByDisciplineId(disciplineId: number) {
  const teachers = await teachersRepository.getTeachersByDisciplineId(disciplineId);

  if(teachers[0]) {
    const formattedTeachers = teachers[0].teacherDisciplines

    return handleObjectData(formattedTeachers)
  } else {
    return []
  }
}

function handleObjectData(formattedTeachers: any) {
  const hashTable = {}
  const newArr = []
  for(let i = 0; i < formattedTeachers.length; i++) {
    const el = formattedTeachers[i].teacher.name
    const elId = formattedTeachers[i].teacher.id
    if(!hashTable[elId]) hashTable[elId] = el
  }
  for(let i = 0; i < formattedTeachers.length; i++) {
    if(hashTable[i]) newArr.push({
      teacher: {
        id: i,
        name: hashTable[i]
      }
    })
    if(!hashTable[i] && i !== 0) break
  }

  return newArr;
}

export const teachersService = {
  getTeachers,
  getTeachersByDisciplineId
};

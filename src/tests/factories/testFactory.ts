import {faker} from "@faker-js/faker"

function createTestInfo() {
  return {
    name: faker.lorem.slug(3),
    pdfUrl: faker.internet.url(),
    categoryId: 1,
    teacherId: 1,
    disciplineId: 3
  }
}

const testFactory = {
  createTestInfo
}

export default testFactory
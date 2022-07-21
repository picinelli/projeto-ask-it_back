import {faker} from "@faker-js/faker"


function createLogin(email = 'teste99@teste99.com', passwordLength = 17) {
  return {
    email,
    password: faker.internet.password(passwordLength)
  }
}

const userFactory = {
  createLogin
}

export default userFactory
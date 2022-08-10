import { faker } from "@faker-js/faker";

function createLogin(email = "teste99@teste99.com", passwordLength = 17) {
  const password = faker.internet.password(passwordLength);
  return {
    username: faker.lorem.word(10),
    email,
    password,
    passwordConfirmation: password,
  };
}

const userFactory = {
  createLogin,
};

export default userFactory;

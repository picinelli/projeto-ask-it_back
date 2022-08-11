import { faker } from "@faker-js/faker";

function createLogin(email = "teste99@teste99.com", passwordLength = 17) {
  const password = faker.internet.password(passwordLength);
  return {
    username: "teste",
    email,
    password,
    passwordConfirmation: password,
  };
}

function createUser(email = "teste99@teste99.com", passwordLength = 17) {
  const password = faker.internet.password(passwordLength);
  return {
    id: 1,
    username: "teste",
    email,
    password,
    passwordConfirmation: password,
    createdAt: new Date(Date.now()),
  };
}

const userFactory = {
  createLogin,
  createUser,
};

export default userFactory;

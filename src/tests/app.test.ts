import supertest from "supertest";
import prisma from "../database.js";
import app from "../app.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import userFactory from "./factories/userFactory.js";

const login = userFactory.createLogin();

beforeEach(async () => {
  await prisma.$executeRaw`DELETE FROM questions`;
  await prisma.$executeRaw`DELETE FROM answers`;
  await prisma.$executeRaw`DELETE FROM votes`;
  await prisma.$executeRaw`DELETE FROM users WHERE email = ${login.email}`;
});

describe("POST /signup", () => {
  it("given valid email and password, should return 201 on 1st req and 409 on 2nd req", async () => {
    const result = await supertest(app).post("/signup").send(login);
    expect(result.statusCode).toBe(201);

    const result2 = await supertest(app).post("/signup").send(login);
    expect(result2.statusCode).toBe(409);
  });

  it("given wrong email schema format, should return 400", async () => {
    const login = userFactory.createLogin();
    login.email = "formatoEmailIncorreto";
    const result = await supertest(app).post("/signup").send(login);
    expect(result.statusCode).toBe(400);
  });

  it("given wrong password schema format, should return 400", async () => {
    const login = userFactory.createLogin();
    login.password = "<5";
    const result = await supertest(app).post("/signup").send(login);
    expect(result.statusCode).toBe(400);
  });

  it("given wrong passwordConfirmation, should return 400", async () => {
    const login = userFactory.createLogin();
    login.passwordConfirmation = "notSame";
    const result = await supertest(app).post("/signup").send(login);
    expect(result.statusCode).toBe(400);
  });
});

describe("POST /signin", () => {
  it("given non-existent email, should return 404", async () => {
    const login = userFactory.createLogin();
    delete login.passwordConfirmation;
    delete login.username;
    login.email = "inexistente@inexistente.com";

    const result = await supertest(app).post("/signin").send(login);
    expect(result.statusCode).toBe(404);
  });

  it("given wrong credencials, should return 403", async () => {
    const login = userFactory.createLogin();
    await supertest(app).post("/signup").send(login);

    delete login.passwordConfirmation;
    delete login.username;
    const result = await supertest(app)
      .post("/signin")
      .send({ ...login, password: login.password + "senhadiferente" });

    expect(result.statusCode).toBe(403);
  });

  it("given valid credencials, should return 200", async () => {
    const login = userFactory.createLogin();
    await supertest(app).post("/signup").send(login);
    delete login.passwordConfirmation;
    delete login.username;

    const result = await supertest(app).post("/signin").send(login);

    expect(result.statusCode).toBe(200);
  });

  it("given wrong email schema format, should return 400", async () => {
    const login = userFactory.createLogin();
    login.email = "formatoEmailIncorreto";
    const result = await supertest(app).post("/signin").send(login);
    expect(result.statusCode).toBe(400);
  });

  it("given wrong password schema format, should return 400", async () => {
    const login = userFactory.createLogin();
    login.password = "<5";
    const result = await supertest(app).post("/signin").send(login);
    expect(result.statusCode).toBe(400);
  });
});

describe("GET /user/info", () => {
  it("given valid token, should return 200", async () => {
    const token = await __SignUpSignInAndReturnToken();
    const request = await supertest(app)
      .get("/user/info")
      .set({ Authorization: token });

    expect(request.statusCode).toBe(200);
  });

  it("given invalid token, should return 200", async () => {
    const request = await supertest(app)
      .get("/user/info")
      .set({ Authorization: "tokenInvalido" });

    expect(request.statusCode).toBe(400);
  });
});

describe("POST /question", () => {
  it("given valid info, should return 200", async () => {
    const token = await __SignUpSignInAndReturnToken();
    const userId = __GetUserIdByToken(token);
    const request = await supertest(app)
      .post("/question")
      .send({
        description: faker.lorem.lines(6),
        userId,
      })
      .set({ Authorization: token });

    expect(request.statusCode).toBe(201);
  });
});

async function __SignUpSignInAndReturnToken() {
  const login = userFactory.createLogin();
  const signUp = await supertest(app).post("/signup").send(login);
  expect(signUp.statusCode).toBe(201);

  delete login.passwordConfirmation;
  delete login.username;

  const signInToken = await supertest(app).post("/signin").send(login);

  expect(signInToken.statusCode).toBe(200);

  return signInToken.body.token;
}

function __GetUserIdByToken(token: string) {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
  return decodedToken.userId;
}

afterAll(async () => {
  return await prisma.$disconnect()
})

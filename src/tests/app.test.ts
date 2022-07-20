import supertest from "supertest";
import prisma from "../database.js";
import app from "../app.js";

const email = "teste123@teste123.com";
const password = "teste123";
const userInfo = { email, password };

beforeEach(async () => {
  await prisma.$executeRaw`DELETE FROM users WHERE email = ${email}`;
});

describe("Sign-Up auth tests", () => {
  it("given valid email and password, should return 201 on 1st req and 409 on 2nd req", async () => {
    const result = await supertest(app).post("/sign-up").send(userInfo);
    expect(result.statusCode).toBe(201);

    const result2 = await supertest(app).post("/sign-up").send(userInfo);
    expect(result2.statusCode).toBe(409);
  });
});

describe("Sign-In auth tests", () => {
  it("given invalid email and password, should return 404", async () => {
    const result = await supertest(app).post("/sign-in").send(userInfo);
    expect(result.statusCode).toBe(404);
  });

  it("given invalid credencials, should return 403", async () => {
    await supertest(app).post("/sign-up").send(userInfo);
    const result = await supertest(app)
      .post("/sign-in")
      .send({ ...userInfo, password: password + password });

    expect(result.statusCode).toBe(403);
  });

  it("given valid credencials, should return 200", async () => {
    await supertest(app).post("/sign-up").send(userInfo);
    const result = await supertest(app).post("/sign-in").send(userInfo);

    expect(result.statusCode).toBe(200);
  });
});

afterAll(async () => {
  return await prisma.$executeRaw`DELETE FROM users WHERE email = ${email}`;
});

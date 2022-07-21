import supertest from "supertest";
import prisma from "../database.js";
import app from "../app.js";
import userFactory from "./factories/userFactory.js";

const login = userFactory.createLogin()

beforeEach(async () => {
  await prisma.$executeRaw`DELETE FROM users WHERE email = ${login.email}`;
});

describe("Sign-Up auth tests", () => {
  it("given valid email and password, should return 201 on 1st req and 409 on 2nd req", async () => {
    const result = await supertest(app).post("/sign-up").send(login);
    expect(result.statusCode).toBe(201);

    const result2 = await supertest(app).post("/sign-up").send(login);
    expect(result2.statusCode).toBe(409);
  });


});

describe("Sign-In auth tests", () => {
  it("given non-existent email and password, should return 404", async () => {
    const login = userFactory.createLogin()
    delete login.confirm_password
    
    const result = await supertest(app).post("/sign-in").send(login);
    expect(result.statusCode).toBe(404);
  });

  it("given wrong credencials, should return 403", async () => {
    const login = userFactory.createLogin()
    await supertest(app).post("/sign-up").send(login);

    delete login.confirm_password
    const result = await supertest(app)
      .post("/sign-in")
      .send({ ...login, password: login.password + "senhadiferente" });

    expect(result.statusCode).toBe(403);
  });

  it("given valid credencials, should return 200", async () => {
    const login = userFactory.createLogin()
    await supertest(app).post("/sign-up").send(login);

    delete login.confirm_password
    const result = await supertest(app).post("/sign-in").send(login);

    expect(result.statusCode).toBe(200);
  });
});

describe("GET tests endpoint test", () => {
  it("given empty query string, should return 403", async () => {
    // /tests/?groupBy=disciplines
    const tests = await supertest(app).get("/tests")

    expect(tests.statusCode).toBe(403)
  })

  it("given wrong type of query string, should return 403", async () => {
    const tests = await supertest(app).get("/tests/?groupBy=SomeWrongQuery")

    expect(tests.statusCode).toBe(403)
  })

  it("given valid types of query string, should return 200", async () => {
    const disciplineTests = await supertest(app).get("/tests/?groupBy=disciplines")
    const teacherTests = await supertest(app).get("/tests/?groupBy=teachers")

    expect(disciplineTests.statusCode).toBe(200)
    expect(teacherTests.statusCode).toBe(200)
  })
})

afterAll(async () => {
  return await prisma.$executeRaw`DELETE FROM users WHERE email = ${login.email}`;
});

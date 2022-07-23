import supertest from "supertest";
import prisma from "../database.js";
import app from "../app.js";
import userFactory from "./factories/userFactory.js";
import testFactory from "./factories/testFactory.js";

const login = userFactory.createLogin();

beforeEach(async () => {
  await prisma.$executeRaw`DELETE FROM users WHERE email = ${login.email}`;
  await prisma.$executeRaw`DELETE FROM tests`;
  await prisma.$executeRaw`DELETE FROM "teachersDisciplines"`;
});

describe("POST /sign-up", () => {
  it("given valid email and password, should return 201 on 1st req and 409 on 2nd req", async () => {
    const result = await supertest(app).post("/sign-up").send(login);
    expect(result.statusCode).toBe(201);

    const result2 = await supertest(app).post("/sign-up").send(login);
    expect(result2.statusCode).toBe(409);
  });

  it("given wrong email schema format, should return 400", async () => {
    const login = userFactory.createLogin();
    login.email = "formatoEmailIncorreto";
    const result = await supertest(app).post("/sign-up").send(login);
    expect(result.statusCode).toBe(400);
  });

  it("given wrong password schema format, should return 400", async () => {
    const login = userFactory.createLogin();
    login.password = "<5";
    const result = await supertest(app).post("/sign-up").send(login);
    expect(result.statusCode).toBe(400);
  });

  it("given wrong passwordConfirmation schema format, should return 400", async () => {
    const login = userFactory.createLogin();
    login.passwordConfirmation = "notSame";
    const result = await supertest(app).post("/sign-up").send(login);
    expect(result.statusCode).toBe(400);
  });
});

describe("POST /sign-in", () => {
  it("given non-existent email, should return 404", async () => {
    const login = userFactory.createLogin();
    delete login.passwordConfirmation;

    const result = await supertest(app).post("/sign-in").send(login);
    expect(result.statusCode).toBe(404);
  });

  it("given wrong credencials, should return 403", async () => {
    const login = userFactory.createLogin();
    await supertest(app).post("/sign-up").send(login);

    delete login.passwordConfirmation;
    const result = await supertest(app)
      .post("/sign-in")
      .send({ ...login, password: login.password + "senhadiferente" });

    expect(result.statusCode).toBe(403);
  });

  it("given valid credencials, should return 200", async () => {
    const login = userFactory.createLogin();
    await supertest(app).post("/sign-up").send(login);

    delete login.passwordConfirmation;
    const result = await supertest(app).post("/sign-in").send(login);

    expect(result.statusCode).toBe(200);
  });

  it("given wrong email schema format, should return 400", async () => {
    const login = userFactory.createLogin();
    login.email = "formatoEmailIncorreto";
    const result = await supertest(app).post("/sign-up").send(login);
    expect(result.statusCode).toBe(400);
  });

  it("given wrong password schema format, should return 400", async () => {
    const login = userFactory.createLogin();
    login.password = "<5";
    const result = await supertest(app).post("/sign-up").send(login);
    expect(result.statusCode).toBe(400);
  });

  it("given wrong passwordConfirmation schema format, should return 400", async () => {
    const login = userFactory.createLogin();
    login.passwordConfirmation = "notSame";
    const result = await supertest(app).post("/sign-up").send(login);
    expect(result.statusCode).toBe(400);
  });
});

describe("POST /test", () => {
  it("given correct info, should return 201", async () => {
    const token = await __SignUpSignInAndReturnToken();
    const testInfo = testFactory.createTestInfo();

    const teacherDisciplineId = await supertest(app)
      .post("/test")
      .send(testInfo)
      .set({ Authorization: token });

    expect(teacherDisciplineId.statusCode).toBe(201);
  });

  it("given invalid body format, should return 400", async () => {
    const token = await __SignUpSignInAndReturnToken();
    const testInfo = testFactory.createTestInfo();

    const wrongTeacher = await supertest(app)
      .post("/test")
      .send({ ...testInfo, teacherId: -5000 })
      .set({ Authorization: token });
  });

  it("given incorrect teacherId, categoryId or DisciplineId, should return 404", async () => {
    const token = await __SignUpSignInAndReturnToken();
    const testInfo = testFactory.createTestInfo();

    const wrongTeacher = await supertest(app)
      .post("/test")
      .send({ ...testInfo, teacherId: -5000 })
      .set({ Authorization: token });
    const wrongCategory = await supertest(app)
      .post("/test")
      .send({ ...testInfo, categoryId: -5000 })
      .set({ Authorization: token });
    const wrongDiscipline = await supertest(app)
      .post("/test")
      .send({ ...testInfo, disciplineId: -5000 })
      .set({ Authorization: token });

    expect(wrongTeacher.statusCode).toBe(404);
    expect(wrongCategory.statusCode).toBe(404);
    expect(wrongDiscipline.statusCode).toBe(404);
  });

  it("given wrong name schema format, should return 400", async () => {
    const test: any = testFactory.createTestInfo();
    test.name = 31242;
    const result = await supertest(app).post("/sign-up").send(test);
    expect(result.statusCode).toBe(400);
  });

  it("given wrong pdfUrl schema format, should return 400", async () => {
    const test = testFactory.createTestInfo();
    test.pdfUrl = "wrongURIformat";
    const result = await supertest(app).post("/sign-up").send(test);
    expect(result.statusCode).toBe(400);
  });

  it("given wrong categoryId schema format, should return 400", async () => {
    const test: any = testFactory.createTestInfo();
    test.categoryId = "notNumber";
    const result = await supertest(app).post("/sign-up").send(test);
    expect(result.statusCode).toBe(400);
  });

  it("given wrong teacherId schema format, should return 400", async () => {
    const test: any = testFactory.createTestInfo();
    test.teacherId = "notNumber";
    const result = await supertest(app).post("/sign-up").send(test);
    expect(result.statusCode).toBe(400);
  });

  it("given wrong disciplineId schema format, should return 400", async () => {
    const test: any = testFactory.createTestInfo();
    test.disciplineId = "notNumber";
    const result = await supertest(app).post("/sign-up").send(test);
    expect(result.statusCode).toBe(400);
  });
});

describe("GET /tests", () => {
  it("given empty query string, should return 403", async () => {
    const token = await __SignUpSignInAndReturnToken();

    const tests = await supertest(app)
      .get("/tests")
      .set({ Authorization: token });

    expect(tests.statusCode).toBe(403);
  });

  it("given wrong type of query string, should return 403", async () => {
    const token = await __SignUpSignInAndReturnToken();
    const tests = await supertest(app)
      .get("/tests/?groupBy=SomeWrongQuery")
      .set({ Authorization: token });

    expect(tests.statusCode).toBe(403);
  });

  it("given valid types of query string, should return 200", async () => {
    const token = await __SignUpSignInAndReturnToken();
    const disciplineTests = await supertest(app)
      .get("/tests/?groupBy=disciplines")
      .set({ Authorization: token });
    const teacherTests = await supertest(app)
      .get("/tests/?groupBy=teachers")
      .set({ Authorization: token });

    expect(disciplineTests.statusCode).toBe(200);
    expect(teacherTests.statusCode).toBe(200);
  });
});

describe("GET /categories", () => {
  it("given valid token, should return code 200 with all categories", async () => {
    const token = await __SignUpSignInAndReturnToken();
    const request = await supertest(app)
      .get("/categories")
      .set({ Authorization: token });

    expect(request.statusCode).toBe(200);
  });
});

async function __SignUpSignInAndReturnToken() {
  const login = userFactory.createLogin();
  const signUp = await supertest(app).post("/sign-up").send(login);
  expect(signUp.statusCode).toBe(201);

  delete login.passwordConfirmation;

  const signInToken = await supertest(app).post("/sign-in").send(login);

  expect(signInToken.statusCode).toBe(200);

  return signInToken.body.token;
}

afterAll(async () => {
  return await prisma.$executeRaw`DELETE FROM users WHERE email = ${login.email}`;
});

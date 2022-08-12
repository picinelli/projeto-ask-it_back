import supertest from "supertest";
import prisma from "../../database.js";
import app from "../../app.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import userFactory from "../factories/userFactory.js";

const login = userFactory.createLogin();

beforeEach(async () => {
  await prisma.$executeRaw`DELETE FROM votes`;
  await prisma.$executeRaw`DELETE FROM answers`;
  await prisma.$executeRaw`DELETE FROM questions`;
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
    const request = await __CreateQuestionAndReturnInfo(userId, token)

    const questionExist = await prisma.question.findUnique({
      where: { id: request.body.id },
    });

    expect(request.statusCode).toBe(201);
    expect(questionExist).toHaveProperty("description");
  });

  it("given wrong description schema format, should return 400", async () => {
    const request = await supertest(app).post("/question").send({
      description: 1,
      userId: 1,
    });

    expect(request.statusCode).toBe(400);
  });

  it("given wrong userId schema format, should return 400", async () => {
    const request = await supertest(app)
      .post("/question")
      .send({
        description: faker.lorem.lines(6),
        userId: "1",
      });

    expect(request.statusCode).toBe(400);
  });
});

describe("POST /question/view/:id", () => {
  it("given valid id, should increase question viewcount and return 201", async () => {
    const token = await __SignUpSignInAndReturnToken();
    const userId = __GetUserIdByToken(token);
    const question = await __CreateQuestionAndReturnInfo(userId, token)

    const request = await supertest(app).post(
      `/question/view/${question.body.id}`
    );

    const viewedQuestion = await prisma.question.findUnique({
      where: { id: question.body.id },
    });

    expect(request.statusCode).toBe(201);
    expect(viewedQuestion.views).toBeGreaterThan(0);
  });

  it("given invalid question id, should return 404", async () => {
    const request = await supertest(app).post(`/question/view/-1`);

    expect(request.statusCode).toBe(404);
  });
});

describe("POST /question/vote", () => {
  it("given valid id, should increase and decrease question viewcount and return 201", async () => {
    const token = await __SignUpSignInAndReturnToken();
    const userId = __GetUserIdByToken(token);
    const question = await __CreateQuestionAndReturnInfo(userId, token)

    await supertest(app)
      .post("/question/vote")
      .send({
        questionId: question.body.id,
        username: "teste",
      })
      .set({ Authorization: token });

    const voteQuestion = await prisma.vote.findMany({
      where: { questionId: question.body.id },
    });

    expect(voteQuestion.length).toBe(1);

    await supertest(app)
      .post("/question/vote")
      .send({
        questionId: question.body.id,
        username: "teste",
      })
      .set({ Authorization: token });

    const unvoteQuestion = await prisma.vote.findMany({
      where: { questionId: question.body.id },
    });

    expect(unvoteQuestion.length).toBe(0);
  });

  it("given wrong questionId schema format, should return 400", async () => {
    const request = await supertest(app)
      .post("/question/vote")
      .send({
        questionId: "1",
        username: faker.lorem.word(20),
      });

    expect(request.statusCode).toBe(400);
  });

  it("given wrong username schema format, should return 400", async () => {
    const request = await supertest(app).post("/question/vote").send({
      questionId: 1,
      username: 1,
    });

    expect(request.statusCode).toBe(400);
  });

  it("given invalid question id, should return 404", async () => {
    const token = await __SignUpSignInAndReturnToken();
    const request = await supertest(app)
      .post("/question/vote")
      .send({
        questionId: -1,
        username: "teste",
      })
      .set({ Authorization: token });

    expect(request.statusCode).toBe(404);
  });
});

describe("POST /search/questions", () => {
  it("given empty description schema, should return 400", async () => {
    const request = await supertest(app).post(`/search/questions`).send();

    expect(request.statusCode).toBe(400);
  });

  it("given valid description schema, should return 200", async () => {
    const request = await supertest(app).post(`/search/questions`).send({
      description: "someDescription"
    });

    expect(request.statusCode).toBe(200);
  });
});

describe("GET /question/:id", () => {
  it("given valid question id, should return question info", async () => {
    const token = await __SignUpSignInAndReturnToken();
    const userId = __GetUserIdByToken(token);
    const question = await __CreateQuestionAndReturnInfo(userId, token)

    const request = await supertest(app).get(`/question/${question.body.id}`);

    expect(request.statusCode).toBe(200);
    expect(request.body).toHaveProperty("id")
  });

  it("given invalid question id, should return 200", async () => {
    const request = await supertest(app).get(`/question/-1`);

    expect(request.statusCode).toBe(404);
  });
});

describe("GET /questions/:page", () => {
  it("given existent questions, should return question info", async () => {
    const token: string = await __SignUpSignInAndReturnToken();
    const userId: number = __GetUserIdByToken(token);
    await __CreateQuestionAndReturnInfo(userId, token)

    const request = await supertest(app).get(`/questions/1`);

    expect(request.statusCode).toBe(200);
    expect(request.body.questions.length).toBeGreaterThan(0)
  });

  it("given non-existent questions, should return empty array", async () => {
    const request = await supertest(app).get(`/questions/1`);

    expect(request.statusCode).toBe(200);
    expect(request.body.questions.length).toBe(0)
  });
});

describe("POST /answer", () => {
  it("given valid info, should return 201", async () => {
    const token = await __SignUpSignInAndReturnToken()
    const userId = await __GetUserIdByToken(token)
    const question = await __CreateQuestionAndReturnInfo(userId, token)

    const request = await supertest(app).post(`/answer`).send({
      description: "long descriptionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
      username: faker.lorem.word(1),
      questionId: question.body.id
    }).set({ Authorization: token });

    expect(request.statusCode).toBe(201)
  });

  it("given invalid description schema, should return 400", async () => {
    const token = await __SignUpSignInAndReturnToken()
    const request = await supertest(app).post(`/answer`).send({
      description: "short description",
      username: "teste",
      questionId: 1
    }).set({ Authorization: token });

    expect(request.statusCode).toBe(400)
  });

  it("given invalid username schema, should return 400", async () => {
    const token = await __SignUpSignInAndReturnToken()
    const request = await supertest(app).post(`/answer`).send({
      description: "long descriptionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
      username: 1,
      questionId: 1
    }).set({ Authorization: token });

    expect(request.statusCode).toBe(400)
  });

  it("given invalid questionId schema, should return 400", async () => {
    const token = await __SignUpSignInAndReturnToken()
    const request = await supertest(app).post(`/answer`).send({
      description: "long descriptionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
      username: "teste",
      questionId: "afwafawf"
    }).set({ Authorization: token });


    expect(request.statusCode).toBe(400)
  });
});

describe("GET /answers/:id", () => {
  it("given valid question id, should return answers", async () => {
    const question = await __InsertAnswerToQuestionAndReturnQuestionInfo()

    const request = await supertest(app).get(`/answers/${question.id}`);

    expect(request.statusCode).toBe(200);
    expect(request.body.length).toBeGreaterThan(0)
  });

  it("given invalid question id, should return 404", async () => {
    const request = await supertest(app).get(`/answers/-1`);

    expect(request.statusCode).toBe(404);
  });

});






export async function __CreateQuestionAndReturnInfo(userId: number, token: string) {
  return await supertest(app)
  .post("/question")
  .send({
    description: faker.lorem.lines(6),
    userId,
  })
  .set({ Authorization: token });
}

async function __InsertAnswerToQuestionAndReturnQuestionInfo() {
  const token = await __SignUpSignInAndReturnToken()
  const userId = __GetUserIdByToken(token);
  const question = await __CreateQuestionAndReturnInfo(userId, token)

  await supertest(app).post(`/answer`).send({
    description: "long descriptionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
    username: "teste",
    questionId: question.body.id
  }).set({ Authorization: token });

  return question.body
}

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
  return await prisma.$disconnect();
});

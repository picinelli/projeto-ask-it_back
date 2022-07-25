import axios from "axios";
import { TestData } from "../pages/Adicionar";

const baseAPI = axios.create({
  baseURL: "https://projeto-repoprovaspicinelli.herokuapp.com/",
});

interface UserData {
  email: string;
  password: string;
  passwordConfirmation?: string;
}

function getConfig(token: string | null) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

async function signUp(signUpData: UserData) {
  await baseAPI.post("/sign-up", signUpData);
}

async function signIn(signInData: UserData) {
  return baseAPI.post<{ token: string }>("/sign-in", signInData);
}

export interface Term {
  id: number;
  number: number;
}

export interface Discipline {
  id: number;
  name: string;
  teacherDisciplines: TeacherDisciplines[];
  term: Term;
}

export interface TeacherDisciplines {
  id: number;
  discipline: Discipline;
  teacher: Teacher;
  tests: Test[];
}

export interface Teacher {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Test {
  id: number;
  name: string;
  pdfUrl: string;
  category: Category;
}

export type TestByDiscipline = Term & {
  disciplines: Discipline[];
};

export type TestByTeacher = TeacherDisciplines & {
  teacher: Teacher;
  disciplines: Discipline[];
  tests: Test[];
};

async function getTestsByDiscipline(token: string) {
  const config = getConfig(token);
  return baseAPI.get<{ tests: TestByDiscipline[] }>(
    "/tests?groupBy=disciplines",
    config
  );
}

async function getTestsByTeacher(token: string) {
  const config = getConfig(token);
  return baseAPI.get<{ tests: TestByTeacher[] }>(
    "/tests?groupBy=teachers",
    config
  );
}

async function getCategories(token: string) {
  const config = getConfig(token);
  return baseAPI.get<{ categories: Category[] }>("/categories", config);
}

async function getDisciplines(token: string) {
  const config = getConfig(token);
  return baseAPI.get<{ disciplines: Discipline[] }>("/disciplines", config);
}

async function getTeachers(token: string) {
  const config = getConfig(token);
  return baseAPI.get<{ teachers: Teacher[] }>("/teachers", config);
}

async function getTeachersByDisciplineId(token: string | null, id: number | string) {
  const config = getConfig(token);
  return baseAPI.get<{ teachers: Teacher[] }>(`/teachers/discipline/${id}`, config);
}

async function postTest(token: string | null, body: TestData) {
  const config = getConfig(token);
  return baseAPI.post("/test", body, config);
}

const api = {
  signUp,
  signIn,
  getTestsByDiscipline,
  getTestsByTeacher,
  getCategories,
  getDisciplines,
  getTeachers,
  postTest,
  getTeachersByDisciplineId
};

export default api;

import request from "supertest";
import { FastifyInstance } from "fastify";

export const TEST_CREDENTIALS = {
  email: `midhun-dev@gmail.com`,
  password: "password123",
};

export async function createAndLoginUser(app: FastifyInstance) {
  let response = await request(app.server).post("/api/auth/login").send({
    email: TEST_CREDENTIALS.email,
    password: TEST_CREDENTIALS.password,
  });

  if (response.statusCode === 401 || response.statusCode === 404) {
    await request(app.server).post("/api/auth/register").send({
      email: TEST_CREDENTIALS.email,
      password: TEST_CREDENTIALS.password,
      name: "Test User",
    });

    response = await request(app.server).post("/api/auth/login").send({
      email: TEST_CREDENTIALS.email,
      password: TEST_CREDENTIALS.password,
    });
  }

  return {
    token: response.body.token,
    user: response.body.user,
  };
}

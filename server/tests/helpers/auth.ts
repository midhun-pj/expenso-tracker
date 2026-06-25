import request from "supertest";
import { FastifyInstance } from "fastify";

export const TEST_CREDENTIALS = {
  email: `midhun-dev@gmail.com`,
  password: "password123",
};

export async function createAndLoginUser(app: FastifyInstance) {
    
  const response = await request(app.server).post("/api/auth/login").send({
    email: TEST_CREDENTIALS.email,
    password: TEST_CREDENTIALS.password,
  });

  return {
    token: response.body.token,
    user: response.body.user,
  };
}

import request from "supertest";
import { beforeAll, afterAll, describe, expect, it } from "vitest";

import { buildTestApp } from "./helpers/test-app";
import { createAndLoginUser } from "./helpers/auth";

let app: any;
let token: string;

beforeAll(async () => {
  app = await buildTestApp();
  await app.ready();

  const auth = await createAndLoginUser(app);
  token = auth.token;
});

afterAll(async () => {
  await app.close();
});

describe("Categories Module", () => {
  let categoryId = "";
  it("should create category", async () => {
    const response = await request(app.server)
      .post("/api/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Food",
        type: "EXPENSE",
      });

    categoryId = response.body.id;
    expect(response.statusCode).toBe(201);
  });

  it("should fetch categories", async () => {
    const response = await request(app.server)
      .get("/api/categories")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should delete category", async () => {
    const response = await request(app.server)
      .delete(`/api/categories/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  it("categories should be empty", async () => {
    const response = await request(app.server)
      .get("/api/categories")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe([]);
  });
});

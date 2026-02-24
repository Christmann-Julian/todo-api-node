const request = require("supertest");
const app = require("../app");

describe("Tests de la route /debug", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("GET /debug - devrait retourner 404 si on n'est pas en development", async () => {
    process.env.NODE_ENV = "test";
    const res = await request(app).get("/debug");
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Not found");
  });

  it("GET /debug - devrait retourner les infos si on est en development", async () => {
    process.env.NODE_ENV = "development";
    process.env.SECRET_KEY = "test_secret";
    const res = await request(app).get("/debug");

    expect(res.statusCode).toBe(200);
    expect(res.body.secret).toBe("test_secret");
    expect(res.body).toHaveProperty("env");
  });
});

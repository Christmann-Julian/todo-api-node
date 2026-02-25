const request = require("supertest");

jest.mock("../database/database", () => ({
  getDb: jest.fn().mockRejectedValue(new Error("Erreur DB simulée")),
  saveDb: jest.fn(),
}));

jest.mock("yamljs", () => ({
  load: jest.fn(() => {
    throw new Error("Erreur Swagger simulée");
  }),
}));

const app = require("../app");

describe("Tests de robustesse (Catch 500 - Fichier Isolé)", () => {
  it("GET /todos - devrait déclencher handleRouteError", async () => {
    const res = await request(app).get("/todos");
    expect(res.statusCode).toBe(500);
    expect(res.body.detail).toBe("Internal server error");
  });

  it("POST /todos - devrait déclencher handleRouteError", async () => {
    const res = await request(app).post("/todos").send({ title: "Planté" });
    expect(res.statusCode).toBe(500);
  });

  it("GET /todos/:id - devrait déclencher handleRouteError", async () => {
    const res = await request(app).get("/todos/1");
    expect(res.statusCode).toBe(500);
  });

  it("PUT /todos/:id - devrait déclencher handleRouteError", async () => {
    const res = await request(app).put("/todos/1").send({ status: "done" });
    expect(res.statusCode).toBe(500);
  });

  it("DELETE /todos/:id - devrait déclencher handleRouteError", async () => {
    const res = await request(app).delete("/todos/1");
    expect(res.statusCode).toBe(500);
  });

  it("GET /todos/search/all - devrait déclencher handleRouteError", async () => {
    const res = await request(app).get("/todos/search/all?q=test");
    expect(res.statusCode).toBe(500);
  });
});

describe("Tests de robustesse globaux (Catch blocks de app.js)", () => {
  let originalJson;

  beforeAll(() => {
    originalJson = app.response.json;
    app.response.json = () => {
      throw new Error("Crash forcé de Express JSON");
    };
  });

  afterAll(() => {
    app.response.json = originalJson;
  });

  it("GET / - devrait tomber dans le catch et renvoyer 500", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(500);
  });

  it("GET /debug - devrait tomber dans le catch et renvoyer 500", async () => {
    const res = await request(app).get("/debug");
    expect(res.statusCode).toBe(500);
  });
});

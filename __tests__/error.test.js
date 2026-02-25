const request = require("supertest");

// --- MOCK DATABASE ---
jest.mock("../database/database", () => ({
  getDb: jest.fn().mockRejectedValue(new Error("Erreur DB simulée")),
  saveDb: jest.fn(),
}));

// --- MOCK SWAGGER ---
// (Valide les lignes du catch Swagger dans app.js)
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
    // Sabotage propre : on détruit temporairement la méthode json() d'Express
    // Cela garantit que TOUTES les routes qui renvoient du json vont crasher en essayant
    originalJson = app.response.json;
    app.response.json = () => {
      throw new Error("Crash forcé de Express JSON");
    };
  });

  afterAll(() => {
    // On remet la vraie fonction
    app.response.json = originalJson;
  });

  it("GET / - devrait tomber dans le catch et renvoyer 500", async () => {
    // La route "/" essaie de faire res.json({ message: "..." }), ce qui va crasher !
    // Elle tombe dans le catch, appelle handleAppRouteError qui fait status(500)
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(500);

    // Note : On ne teste pas res.body.detail ici car on a cassé res.json exprès,
    // donc handleAppRouteError va aussi crasher en essayant de renvoyer l'erreur !
    // L'important est que le code soit passé par les bonnes lignes (le coverage).
  });

  it("GET /debug - devrait tomber dans le catch et renvoyer 500", async () => {
    // La route "/debug" en NODE_ENV=test essaie de faire res.status(404).json(...), ce qui crashe.
    const res = await request(app).get("/debug");
    expect(res.statusCode).toBe(500);
  });
});

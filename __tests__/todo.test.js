const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../app");

const TEST_DB_PATH = path.join(__dirname, "..", "test-todo.db");

describe("Tests Fonctionnels de l'API Todo", () => {
  beforeAll(() => {
    process.env.DB_PATH = TEST_DB_PATH;
  });

  afterAll(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  let createdTodoId;

  it("GET /health - devrait retourner le statut ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("GET / - devrait retourner le message de bienvenue", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Welcome to the Enhanced Express Todo App!");
  });

  it("POST /todos - devrait créer un nouveau todo", async () => {
    const newTodo = {
      title: "Apprendre Jest",
      description: "Faire des tests fonctionnels",
    };

    const res = await request(app).post("/todos").send(newTodo);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe(newTodo.title);
    expect(res.body.description).toBe(newTodo.description);
    expect(res.body.status).toBe("pending");

    createdTodoId = res.body.id;
  });

  it("POST /todos - devrait refuser un todo sans titre (422)", async () => {
    const res = await request(app).post("/todos").send({
      description: "Ce todo n'a pas de titre",
    });

    expect(res.statusCode).toBe(422);
    expect(res.body.detail).toBe("title is required");
  });

  it("GET /todos - devrait lister les todos", async () => {
    const res = await request(app).get("/todos");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("GET /todos - devrait gérer la pagination avec skip et limit", async () => {
    const res = await request(app).get("/todos?skip=0&limit=5");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("PUT /todos/:id - devrait mettre à jour le todo", async () => {
    const res = await request(app).put(`/todos/${createdTodoId}`).send({
      status: "done",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdTodoId);
    expect(res.body.status).toBe("done");
  });

  it("PUT /todos/:id - devrait retourner 404 pour un todo inexistant", async () => {
    const res = await request(app).put("/todos/999999").send({ status: "done" });
    expect(res.statusCode).toBe(404);
  });

  it("PUT /todos/:id - devrait mettre à jour le titre et la description", async () => {
    const postRes = await request(app).post("/todos").send({ title: "Vieux Titre" });
    const tempId = postRes.body.id;

    const putRes = await request(app).put(`/todos/${tempId}`).send({
      title: "Nouveau Titre",
      description: "Nouvelle Description",
    });

    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.title).toBe("Nouveau Titre");
    expect(putRes.body.description).toBe("Nouvelle Description");
  });

  it("DELETE /todos/:id - devrait supprimer le todo", async () => {
    const res = await request(app).delete(`/todos/${createdTodoId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.detail).toBe("Todo deleted");
  });

  it("DELETE /todos/:id - devrait retourner 404 pour un todo inexistant", async () => {
    const res = await request(app).delete("/todos/999999");
    expect(res.statusCode).toBe(404);
  });

  it("GET /todos/:id - devrait retourner 404 pour un todo supprimé", async () => {
    const res = await request(app).get(`/todos/${createdTodoId}`);
    expect(res.statusCode).toBe(404);
  });

  it("GET /todos/:id - devrait retourner un todo existant", async () => {
    const postRes = await request(app).post("/todos").send({ title: "Test GET ID" });
    const tempId = postRes.body.id;

    const res = await request(app).get(`/todos/${tempId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(tempId);
    expect(res.body.title).toBe("Test GET ID");
  });

  it("doit retourner les todos correspondants à la recherche", async () => {
    const response = await request(app).get("/todos/search/all").query({ q: "apprendre" });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((todo) => {
      expect(todo.title.toLowerCase()).toContain("apprendre");
    });
  });

  it("doit retourner une liste vide si aucun résultat", async () => {
    const response = await request(app).get("/todos/search/all").query({ q: "ZYZXW123" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });
});

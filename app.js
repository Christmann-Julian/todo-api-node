if (process.env.VERCEL !== "1") {
  require("dotenv").config();
}
const express = require("express");
const todoRouter = require("./routes/todo");

/**
 * Instance principale de l'application Express.
 * @type {import('express').Express}
 */
const app = express();
app.use(express.json());

/**
 * Route racine de l'API.
 * @name GET /
 * @param {import('express').Request} _req - La requête Express (non utilisée)
 * @param {import('express').Response} res - La réponse Express
 * @returns {Object} Message de bienvenue
 */
app.get("/", (_req, res) => {
  console.log("someone hit the root endpoint");
  res.json({ message: "Welcome to the Enhanced Express Todo App!" });
});

/**
 * Route de débogage pour afficher les variables d'environnement.
 * Accessible uniquement en environnement de développement.
 * @name GET /debug
 * @param {import('express').Request} _req - La requête Express
 * @param {import('express').Response} res - La réponse Express
 * @returns {Object} JSON contenant le secret, l'API key et l'environnement, ou une erreur 404
 */
app.get("/debug", (_req, res) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(404).json({ error: "Not found" });
  }

  res.json({
    secret: process.env.SECRET_KEY,
    api_key: process.env.API_KEY,
    env: process.env,
  });
});

/**
 * Route pour les opérations CRUD sur les todos.
 * Toutes les routes commençant par /todos seront gérées par le router défini dans routes/todo.js
 */
app.use("/todos", todoRouter);

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test" && process.env.VERCEL !== "1") {
  app.listen(process.env.PORT || 3000, () =>
    console.log(`Server running on http://localhost:${process.env.PORT || 3000}`)
  );
}

module.exports = app;

const { Router } = require("express");
const { getDb, saveDb } = require("../database/database");
const { formatTodo, formatTodos, toArray } = require("./utils");

/**
 * Routeur Express pour la gestion des Todos.
 * @type {import('express').Router}
 */
const router = Router();

/**
 * Crée un nouveau Todo.
 * @name POST /todos
 * @param {import('express').Request} req - La requête Express
 * @param {string} req.body.title - Le titre du Todo (Requis)
 * @param {string} [req.body.description] - La description du Todo (Optionnel)
 * @param {string} [req.body.status="pending"] - Le statut du Todo (Optionnel)
 * @param {import('express').Response} res - La réponse Express
 * @returns {Object} Le Todo formaté avec son nouvel ID (Statut 201) ou une erreur 422
 */
router.post("/", async (req, res) => {
  const { title, description = null, status = "pending" } = req.body;
  if (!title) {
    return res.status(422).json({ detail: "title is required" });
  }
  console.log("creating todo: " + title);
  const db = await getDb();
  db.run("INSERT INTO todos (title, description, status) VALUES (?, ?, ?)", [
    title,
    description,
    status,
  ]);
  const id = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
  const row = db.exec("SELECT * FROM todos WHERE id = ?", [id]);
  saveDb();

  const todo = toObj(row);
  res.status(201).json(formatTodo(todo));
});

/**
 * Récupère une liste paginée de Todos.
 * @name GET /todos
 * @param {import('express').Request} req - La requête Express
 * @param {string} [req.query.skip=0] - Nombre d'éléments à ignorer pour la pagination
 * @param {string} [req.query.limit=10] - Nombre maximum d'éléments à retourner
 * @param {import('express').Response} res - La réponse Express
 * @returns {Array<Object>} Un tableau de Todos formatés
 */
router.get("/", async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const db = await getDb();
  const rows = db.exec("SELECT * FROM todos LIMIT ? OFFSET ?", [limit, skip]);

  const x = toArray(rows);
  console.log("found " + x.length + " todos");

  res.json(formatTodos(x));
});

/**
 * Récupère un Todo spécifique par son ID.
 * @name GET /todos/:id
 * @param {import('express').Request} req - La requête Express
 * @param {string} req.params.id - L'identifiant unique du Todo
 * @param {import('express').Response} res - La réponse Express
 * @returns {Object} Le Todo formaté ou une erreur 404 s'il est introuvable
 */
router.get("/:id", async (req, res) => {
  const db = await getDb();
  const rows = db.exec("SELECT * FROM todos WHERE id = ?", [req.params.id]);
  if (!rows.length || !rows[0].values.length)
    return res.status(404).json({ detail: "Todo not found" });

  res.json(formatTodo(toObj(rows)));
});

/**
 * Met à jour un Todo existant (Mise à jour partielle supportée).
 * @name PUT /todos/:id
 * @param {import('express').Request} req - La requête Express
 * @param {string} req.params.id - L'identifiant unique du Todo à modifier
 * @param {string} [req.body.title] - Le nouveau titre
 * @param {string} [req.body.description] - La nouvelle description
 * @param {string} [req.body.status] - Le nouveau statut
 * @param {import('express').Response} res - La réponse Express
 * @returns {Object} Le Todo mis à jour et formaté ou une erreur 404
 */
router.put("/:id", async (req, res) => {
  const db = await getDb();
  const existing = db.exec("SELECT * FROM todos WHERE id = ?", [req.params.id]);
  if (!existing.length || !existing[0].values.length)
    return res.status(404).json({ detail: "Todo not found" });

  const old = toObj(existing);
  const title = req.body.title ?? old.title;
  const description = req.body.description ?? old.description;
  const status = req.body.status ?? old.status;

  db.run("UPDATE todos SET title = ?, description = ?, status = ? WHERE id = ?", [
    title,
    description,
    status,
    req.params.id,
  ]);
  const rows = db.exec("SELECT * FROM todos WHERE id = ?", [req.params.id]);
  saveDb();

  res.json(formatTodo(toObj(rows)));
});

/**
 * Supprime un Todo spécifique.
 * @name DELETE /todos/:id
 * @param {import('express').Request} req - La requête Express
 * @param {string} req.params.id - L'identifiant unique du Todo à supprimer
 * @param {import('express').Response} res - La réponse Express
 * @returns {Object} Un message de confirmation ou une erreur 404
 */
router.delete("/:id", async (req, res) => {
  const db = await getDb();
  const existing = db.exec("SELECT * FROM todos WHERE id = ?", [req.params.id]);
  if (!existing.length || !existing[0].values.length)
    return res.status(404).json({ detail: "Todo not found" });
  db.run("DELETE FROM todos WHERE id = ?", [req.params.id]);
  saveDb();
  res.json({ detail: "Todo deleted" });
});

/**
 * Recherche des Todos par mot-clé dans le titre.
 * @name GET /todos/search/all
 * @param {import('express').Request} req - La requête Express
 * @param {string} [req.query.q=""] - La chaîne de caractères à rechercher dans le titre
 * @param {import('express').Response} res - La réponse Express
 * @returns {Array<Object>} Un tableau de Todos correspondants à la recherche
 */
router.get("/search/all", async (req, res) => {
  const q = req.query.q || "";
  const db = await getDb();
  const results = db.exec("SELECT * FROM todos WHERE title LIKE ?", [`%${q}%`]);

  res.json(formatTodos(toArray(results)));
});

/**
 * Convertit un résultat brut retourné par sql.js en un objet JavaScript standard.
 * @param {Array<Object>} rows - Le tableau de résultats bruts de sql.js (contenant `columns` et `values`)
 * @returns {Object|null} L'objet mappé {colonne: valeur} ou null si les données sont invalides/vides
 */
function toObj(rows) {
  if (!rows || !rows.length || !rows[0].values.length) return null;
  const cols = rows[0].columns;
  const vals = rows[0].values[0];
  const obj = {};
  cols.forEach((c, i) => (obj[c] = vals[i]));
  return obj;
}

module.exports = router;

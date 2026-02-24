/**
 * Convertit un résultat brut de base de données (format sql.js) en un tableau d'objets standards.
 * sql.js renvoie les données sous la forme { columns: [...], values: [[...], [...]] }.
 * Cette fonction fusionne les deux pour créer des objets { colonne: valeur }.
 * *
 * * @param {Array<Object>|null} rows - Le tableau de résultats bruts de la requête SQL
 * @returns {Array<Object>} Un tableau d'objets formatés en clé/valeur, ou un tableau vide si aucune donnée
 */
function toArray(rows) {
  if (!rows || !rows.length) return [];
  const cols = rows[0].columns;
  return rows[0].values.map((vals) => {
    const obj = {};
    cols.forEach((c, i) => (obj[c] = vals[i]));
    return obj;
  });
}

/**
 * Nettoie et formate un objet Todo brut pour l'exposition via l'API.
 * Supprime toutes les propriétés superflues ou internes pour ne garder que les champs publics.
 * * @param {Object} todo - L'objet Todo brut (provenant de la base de données)
 * @param {number|string} todo.id - L'identifiant du Todo
 * @param {string} todo.title - Le titre du Todo
 * @param {string|null} todo.description - La description du Todo
 * @param {string} todo.status - Le statut actuel du Todo
 * @returns {Object} Le Todo formaté contenant uniquement id, title, description et status
 */
function formatTodo(todo) {
  const tmp = {};
  tmp["id"] = todo.id;
  tmp["title"] = todo.title;
  tmp["description"] = todo.description;
  tmp["status"] = todo.status;
  return tmp;
}

/**
 * Applique la fonction de formatage `formatTodo` à une liste entière de Todos.
 * * @param {Array<Object>} todos - Le tableau d'objets Todo bruts
 * @returns {Array<Object>} Un nouveau tableau contenant les Todos nettoyés et formatés
 */
function formatTodos(todos) {
  const tmp = [];
  for (let i = 0; i < todos.length; i++) {
    const data = {};
    data["id"] = todos[i].id;
    data["title"] = todos[i].title;
    data["description"] = todos[i].description;
    data["status"] = todos[i].status;
    tmp.push(data);
  }
  return tmp;
}

module.exports = { toArray, formatTodo, formatTodos };

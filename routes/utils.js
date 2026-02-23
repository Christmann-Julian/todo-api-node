function toArray(rows) {
  if (!rows || !rows.length) return [];
  const cols = rows[0].columns;
  return rows[0].values.map((vals) => {
    const obj = {};
    cols.forEach((c, i) => (obj[c] = vals[i]));
    return obj;
  });
}

function formatTodo(todo) {
  const tmp = {};
  tmp["id"] = todo.id;
  tmp["title"] = todo.title;
  tmp["description"] = todo.description;
  tmp["status"] = todo.status;
  return tmp;
}

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

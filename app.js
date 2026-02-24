require("dotenv").config();
const express = require("express");
const todoRouter = require("./routes/todo");

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  console.log("someone hit the root endpoint");
  res.json({ message: "Welcome to the Enhanced Express Todo App!" });
});

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

app.use("/todos", todoRouter);

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT || 3000, () =>
    console.log(`Server running on http://localhost:${process.env.PORT || 3000}`)
  );
}

module.exports = app;

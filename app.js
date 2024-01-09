require("dotenv").config();
const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();

app.use(express.json());
app.set("view engine", "ejs");

// database
const dbPath = path.join(__dirname, "database.db");
let db = null;
const initialization = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const { PORT } = process.env;
    app.listen(PORT, () => {
      console.log(`Server is running at PORT : ${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
initialization();

// sending page
app.get("/", async (req, res) => {
  res.render("todos");
});

// get all
app.get("/todos", async (req, res) => {
  const todos = await db.all(`select * from todos;`);
  res.send(todos);
});
// get by id
app.get("/todos/:Id", async (req, res) => {
  const todos = await db.get(`select * from todos where id=${req.params.Id};`);
  res.send(todos);
});
// add
app.post("/todos", async (req, res) => {
  const { todo } = req.body;
  const newTodo = await db.run(`
    INSERT INTO todos 
      (todo, is_complete)
    values
      (
        "${todo}",
        false
      )
  ;`);
  const getTodo = await db.get(
    `select * from todos where id=${newTodo.lastID};`
  );
  res.send(getTodo);
});
// update
app.put("/todos/:Id", async (req, res) => {
  const data = await db.run(
    `update 
      todos
    set 
      is_complete=true 
    where id=${req.params.Id};`
  );
  const getTodo = await db.get(
    `select * from todos where id =${req.params.Id};`
  );
  res.send(getTodo);
});
// delete
app.delete("/todos/:Id", async (req, res) => {
  await db.run(`delete from todos where id = ${req.params.Id};`);
  res.send("deleted");
});

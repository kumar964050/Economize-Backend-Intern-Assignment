const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

// Define schema and create table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      is_complete BOOLEAN DEFAULT false,
      todo TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert data into the table
  // const insertTodo = db.prepare(`
  //   INSERT INTO todos (is_complete, todo) VALUES (?, ?)
  // `);
  // insertTodo.run(false, "Example Todo 1");
  // insertTodo.run(true, "Example Todo 2");
  // insertTodo.finalize();

  // Query data from the table
  db.all("SELECT * FROM todos", (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
  });
});

// Close the database connection when done
db.close();

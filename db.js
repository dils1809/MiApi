const sqlite3 = require('sqlite3').verbose();

// Crea o abre la base de datos
const db = new sqlite3.Database('./incidents.db', (err) => {
  if (err) {
    console.error("Error al conectar a la base de datos", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite");
  }
});

// Crear la tabla si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reporter TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pendiente',
      created_at TEXT NOT NULL
    )
  `);
});

module.exports = db;

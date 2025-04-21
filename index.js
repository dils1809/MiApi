const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Conexión a SQLite
const db = new sqlite3.Database('./incidents.db', (err) => {
  if (err) return console.error('Error al conectar a la base de datos:', err.message);
  console.log('Conectado a la base de datos SQLite');

  // Crear tabla si no existe
  db.run(`
    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reporter TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear/verificar la tabla incidents:', err.message);
    } else {
      console.log('Tabla incidents lista (creada o ya existente)');
    }
  });
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ruta raíz (frontend)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Crear nuevo incidente
app.post('/incidents', (req, res) => {
  const { reporter, description } = req.body;

  if (!reporter || !description || description.length < 10) {
    return res.status(400).json({ message: 'Debes ingresar tu nombre y una descripción válida (mínimo 10 caracteres).' });
  }

  const query = `INSERT INTO incidents (reporter, description, status, created_at) VALUES (?, ?, 'pendiente', datetime('now'))`;

  db.run(query, [reporter, description], function (err) {
    if (err) {
      console.error('Error al crear incidente:', err.message);
      return res.status(500).json({ message: 'Error al crear el incidente' });
    }

    res.status(201).json({
      id: this.lastID,
      reporter,
      description,
      status: 'pendiente',
      created_at: new Date().toISOString()
    });
  });
});

// Obtener todos los incidentes
app.get('/incidents', (req, res) => {
  db.all('SELECT * FROM incidents', [], (err, rows) => {
    if (err) {
      console.error('Error al obtener incidentes:', err.message);
      return res.status(500).json({ message: 'Error al obtener los incidentes' });
    }

    res.status(200).json(rows);
  });
});

// Obtener incidente por ID
app.get('/incidents/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  db.get('SELECT * FROM incidents WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error al obtener incidente:', err.message);
      return res.status(500).json({ message: 'Error al obtener el incidente' });
    }

    if (!row) {
      return res.status(404).json({ message: 'Incidente no encontrado' });
    }

    res.status(200).json(row);
  });
});

// Actualizar estado de incidente
app.put('/incidents/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  const validStatuses = ['pendiente', 'en proceso', 'resuelto'];

  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Estado no válido' });
  }

  db.run('UPDATE incidents SET status = ? WHERE id = ?', [status, id], function (err) {
    if (err) {
      console.error('Error al actualizar incidente:', err.message);
      return res.status(500).json({ message: 'Error al actualizar el incidente' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Incidente no encontrado' });
    }

    res.status(200).json({ message: 'Estado actualizado correctamente' });
  });
});

// Eliminar incidente
app.delete('/incidents/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  db.run('DELETE FROM incidents WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error al eliminar incidente:', err.message);
      return res.status(500).json({ message: 'Error al eliminar el incidente' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Incidente no encontrado' });
    }

    res.status(204).send();
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

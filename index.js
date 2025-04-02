const express = require('express');
const db = require('./db'); // Importar la base de datos
const app = express();
const port = 3000;

app.use(express.json()); // Middleware para leer JSON

// Ruta POST para crear un nuevo incidente
app.post('/incidents', (req, res) => {
    const { reporter, description } = req.body;

    if (!reporter || description.length < 10) {
        return res.status(400).json({ message: 'El reporte debe tener un "reporter" y la "description" debe tener al menos 10 caracteres' });
    }

    const query = `INSERT INTO incidents (reporter, description, status, created_at) VALUES (?, ?, 'pendiente', datetime('now'))`;

    db.run(query, [reporter, description], function (err) {
        if (err) {
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


// Ruta GET para obtener todos los incidentes
app.get('/incidents', (req, res) => {
    db.all('SELECT * FROM incidents', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener los incidentes' });
        }
        res.json(rows);
    });
});

// Ruta GET para obtener un incidente por ID
app.get('/incidents/:id', (req, res) => {
    const incidentId = parseInt(req.params.id);
    if (isNaN(incidentId)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    db.get('SELECT * FROM incidents WHERE id = ?', [incidentId], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener el incidente' });
        }
        if (!row) {
            return res.status(404).json({ message: 'Incidente no encontrado' });
        }
        res.json(row);
    });
});

// Ruta PUT para actualizar el estado de un incidente
app.put('/incidents/:id', (req, res) => {
    const incidentId = parseInt(req.params.id);
    if (isNaN(incidentId)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    const { status } = req.body;
    if (!['pendiente', 'en proceso', 'resuelto'].includes(status)) {
        return res.status(400).json({ message: 'Estado no válido' });
    }

    db.run('UPDATE incidents SET status = ? WHERE id = ?', [status, incidentId], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error al actualizar el incidente' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Incidente no encontrado' });
        }
        res.json({ message: 'Estado actualizado correctamente' });
    });
});

// Ruta DELETE para eliminar un incidente
app.delete('/incidents/:id', (req, res) => {
    const incidentId = parseInt(req.params.id);
    if (isNaN(incidentId)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    db.run('DELETE FROM incidents WHERE id = ?', [incidentId], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar el incidente' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Incidente no encontrado' });
        }
        res.status(204).send();
    });
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Bienvenido a mi API de gestión de incidentes!');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

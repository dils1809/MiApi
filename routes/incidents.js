const express = require('express');
const Incident = require('../models/incident');
const router = express.Router();

router.post('/', (req, res) => {
    const { reporter, description, status } = req.body;
    if (!reporter || description.length < 10) {
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    Incident.create({ reporter, description, status: status || 'pendiente' }, (err, id) => {
        if (err) return res.status(500).json({ error: 'Error al crear incidente' });
        res.status(201).json({ id, reporter, description, status: status || 'pendiente' });
    });
});

router.get('/', (req, res) => {
    Incident.getAll((err, rows) => {
        if (err) return res.status(500).json({ error: 'Error al obtener incidentes' });
        res.json(rows);
    });
});

router.get('/:id', (req, res) => {
    Incident.getById(req.params.id, (err, row) => {
        if (!row) return res.status(404).json({ error: 'Incidente no encontrado' });
        res.json(row);
    });
});

router.put('/:id', (req, res) => {
    const { status } = req.body;
    if (!['pendiente', 'en proceso', 'resuelto'].includes(status)) {
        return res.status(400).json({ error: 'Estado inválido' });
    }

    Incident.updateStatus(req.params.id, status, (err, changes) => {
        if (changes === 0) return res.status(404).json({ error: 'Incidente no encontrado' });
        res.json({ message: 'Estado actualizado' });
    });
});

router.delete('/:id', (req, res) => {
    Incident.delete(req.params.id, (err, changes) => {
        if (changes === 0) return res.status(404).json({ error: 'Incidente no encontrado' });
        res.json({ message: 'Incidente eliminado' });
    });
});

module.exports = router;

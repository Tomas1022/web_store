const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todos los desarrolladores
router.get('/', (req, res) => {
  db.query('SELECT * FROM desarrolladores', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
    });
});

// POST agregar desarrollador
router.post('/', (req, res) => {
  const { nombre, pais } = req.body;
  db.query(
    'INSERT INTO desarrolladores (nombre, pais) VALUES (?, ?)',
    [nombre, pais],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Desarrollador agregado correctamente', id: result.insertId });
    }
  );
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todos los juegos
router.get('/', (req, res) => {
    db.query(
    `SELECT j.*, d.nombre AS desarrollador, d.pais 
    FROM juegos j
    INNER JOIN desarrolladores d ON j.desarrollador_id = d.id`,
    (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
    }
);
});
// PUT actualizar precio y stock
router.put('/:id', (req, res) => {
  const { price, stock } = req.body;
  const { id } = req.params;

  db.query(
    'UPDATE juegos SET price = ?, stock = ? WHERE id = ?',
    [price, stock, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Juego actualizado correctamente' });
    }
  );
});
router.post('/', (req, res) => {
  const { title, genre, price, stock, release_date, desarrollador_id } = req.body;

  db.query(
    'INSERT INTO juegos (title, genre, price, stock, release_date, desarrollador_id) VALUES (?, ?, ?, ?, ?, ?)',
    [title, genre, price, stock, release_date, desarrollador_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Juego agregado correctamente', id: result.insertId });
    }
  );
});
module.exports = router;
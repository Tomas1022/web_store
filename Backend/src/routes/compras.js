const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
    const { usuario_id, juego_id, cantidad } = req.body;
db.query('SELECT * FROM juegos WHERE id = ?', [juego_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Juego no encontrado' });

    const juego = results[0];

    if (juego.stock < cantidad) {
    return res.status(400).json({ error: 'Stock insuficiente' });
    }
    const precio_total = juego.price * cantidad;

db.query(
    'INSERT INTO compras (usuario_id, juego_id, cantidad, precio) VALUES (?, ?, ?, ?)',
    [usuario_id, juego_id, cantidad, precio_total],
    (err) => {
    if (err) return res.status(500).json({ error: err.message });

db.query(
    'UPDATE juegos SET stock = stock - ? WHERE id = ?',
    [cantidad, juego_id],
    (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: '✅ Compra realizada correctamente', precio_total });
        }
    );
    }
    );
});
});
// GET historial de compras de un usuario
router.get('/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;

    db.query(
    `SELECT c.id, j.title, c.cantidad, c.precio, c.fecha
    FROM compras c
    INNER JOIN juegos j ON c.juego_id = j.id
    WHERE c.usuario_id = ?`,
    [usuario_id],
    (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    }
    );
});


module.exports = router;
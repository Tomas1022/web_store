const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// REGISTRO
router.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;
  
  try {
    const hash = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, hash],
      (err, result) => {
        if (err) return res.status(400).json({ error: 'El email ya está registrado' });
        res.json({ mensaje: 'Usuario registrado correctamente' });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const usuario = results[0];
    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  res.json({ token, rol: usuario.rol, nombre: usuario.nombre, id: usuario.id });
  });
});

module.exports = router;
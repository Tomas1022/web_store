const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const transporter = require('../config/email');

// REGISTRO
router.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    db.query(
      'INSERT INTO usuarios (nombre, email, password, codigo_verificacion) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, codigo],
      async (err, result) => {
        if (err) return res.status(400).json({ error: 'El email ya está registrado' });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: '🎮 Verifica tu cuenta - Tienda de Juegos',
          html: `
            <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;background:#1f2937;color:white;border-radius:12px;">
              <h2 style="color:#a78bfa;">🎮 Tienda de Juegos</h2>
              <p>Bienvenido ${nombre}! Tu código de verificación es:</p>
              <div style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#4ade80;text-align:center;padding:24px;background:#111827;border-radius:8px;margin:16px 0;">
                ${codigo}
              </div>
              <p style="color:#9ca3af;font-size:14px;">Ingresa este código en la app para verificar tu cuenta.</p>
            </div>
          `
        });

        res.json({ mensaje: '✅ Usuario registrado. Revisa tu correo para verificar tu cuenta.', email });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/verificar', (req, res) => {
  const { email, codigo } = req.body;

  db.query(
    'SELECT * FROM usuarios WHERE email = ? AND codigo_verificacion = ?',
    [email, codigo],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(400).json({ error: 'Código incorrecto' });

      db.query(
        'UPDATE usuarios SET email_verificado = TRUE, codigo_verificacion = NULL WHERE email = ?',
        [email],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ mensaje: '✅ Email verificado correctamente' });
        }
      );
    }
  );
});


// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const usuario = results[0];

    // Verifica si el email está verificado
    if (!usuario.email_verificado)
      return res.status(401).json({ error: 'Debes verificar tu email antes de iniciar sesión' });

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
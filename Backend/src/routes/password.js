const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const transporter = require('../config/email');

// POST /password/forgot - solicitar recuperación
router.post('/forgot', (req, res) => {
  const { email } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Email no encontrado' });

    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 3600000); // 1 hora

    db.query(
      'UPDATE usuarios SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      [codigo, expiry, email],
      async (err) => {
        if (err) return res.status(500).json({ error: err.message });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: '🎮 Código de recuperación - Tienda de Juegos',
          html: `
            <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;background:#1f2937;color:white;border-radius:12px;">
              <h2 style="color:#a78bfa;">🎮 Tienda de Juegos</h2>
              <p>Tu código de recuperación es:</p>
              <div style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#4ade80;text-align:center;padding:24px;background:#111827;border-radius:8px;margin:16px 0;">
                ${codigo}
              </div>
              <p style="color:#9ca3af;font-size:14px;">Este código expira en 1 hora. Si no solicitaste esto, ignora este mensaje.</p>
            </div>
          `
        });

        res.json({ mensaje: '✅ Código enviado a tu correo' });
      }
    );
  });
});

// POST /password/reset - cambiar contraseña con código
router.post('/reset', async (req, res) => {
  const { email, codigo, password } = req.body;

  db.query(
    'SELECT * FROM usuarios WHERE email = ? AND reset_token = ? AND reset_token_expiry > NOW()',
    [email, codigo],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(400).json({ error: 'Código inválido o expirado' });

      const hash = await bcrypt.hash(password, 10);

      db.query(
        'UPDATE usuarios SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?',
        [hash, email],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ mensaje: '✅ Contraseña actualizada correctamente' });
        }
      );
    }
  );
});

module.exports = router;
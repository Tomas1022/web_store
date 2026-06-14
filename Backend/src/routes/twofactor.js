const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const db = require('../db');

// POST /2fa/activar - genera el QR para escanear
router.post('/activar', (req, res) => {
  const { usuario_id } = req.body;

  const secret = speakeasy.generateSecret({
    name: `Tienda de Juegos (${usuario_id})`
  });

  db.query(
    'UPDATE usuarios SET two_factor_secret = ? WHERE id = ?',
    [secret.base32, usuario_id],
    async (err) => {
      if (err) return res.status(500).json({ error: err.message });

      const qr = await qrcode.toDataURL(secret.otpauth_url);
      res.json({ qr, secret: secret.base32 });
    }
  );
});

// POST /2fa/verificar - verifica el código y activa 2FA
router.post('/verificar', (req, res) => {
  const { usuario_id, codigo } = req.body;

  db.query('SELECT two_factor_secret FROM usuarios WHERE id = ?', [usuario_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const secret = results[0].two_factor_secret;

    const valido = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: codigo,
      window: 1
    });

    if (!valido) return res.status(400).json({ error: 'Código incorrecto' });

    db.query(
      'UPDATE usuarios SET two_factor_enabled = TRUE WHERE id = ?',
      [usuario_id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: '✅ 2FA activado correctamente' });
      }
    );
  });
});

// POST /2fa/desactivar
router.post('/desactivar', (req, res) => {
  const { usuario_id } = req.body;

  db.query(
    'UPDATE usuarios SET two_factor_enabled = FALSE, two_factor_secret = NULL WHERE id = ?',
    [usuario_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: '✅ 2FA desactivado' });
    }
  );
});

// POST /2fa/login - valida el código en el login
router.post('/login', (req, res) => {
  const { usuario_id, codigo } = req.body;

  db.query('SELECT two_factor_secret FROM usuarios WHERE id = ?', [usuario_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const secret = results[0].two_factor_secret;

    const valido = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: codigo,
      window: 1
    });

    if (!valido) return res.status(400).json({ error: 'Código 2FA incorrecto' });
    res.json({ mensaje: '✅ Código válido' });
  });
});

module.exports = router;
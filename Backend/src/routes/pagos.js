const express = require('express');
const router = express.Router();
const { MercadoPagoConfig, Preference } = require('mercadopago');
const db = require('../db');

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

router.post('/crear-preferencia', async (req, res) => {
  const { items, usuario_id } = req.body;

  try {
    const preference = new Preference(client);

    const response = await preference.create({
  body: {
    items: items.map(item => ({
      title: item.title,
      quantity: Number(item.cantidad),
      unit_price: Math.round(parseFloat(item.price)),  // ← redondea a entero
      currency_id: 'COP'
    })),
    back_urls: {
      success: 'https://omnivore-basin-custody.ngrok-free.dev/pago-exitoso',
      failure: 'https://omnivore-basin-custody.ngrok-free.dev/pago-fallido',
      pending: 'https://omnivore-basin-custody.ngrok-free.dev/pago-pendiente'
    },
    auto_return: 'approved',
    external_reference: usuario_id.toString()
  }
});
    res.json({ init_point: response.init_point });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/webhook', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'payment') {
    try {
      const { Payment } = require('mercadopago');
      const payment = new Payment(client);
      const pagoInfo = await payment.get({ id: data.id });

      if (pagoInfo.status === 'approved') {
        const usuario_id = pagoInfo.external_reference;

        // Obtener items del carrito
        db.query(
          `SELECT c.*, j.price FROM carrito c 
           INNER JOIN juegos j ON c.juego_id = j.id 
           WHERE c.usuario_id = ?`,
          [usuario_id],
          async (err, items) => {
            if (err || items.length === 0) return res.sendStatus(200);

            // Calcular total
            const total = items.reduce((acc, item) => acc + parseFloat(item.price) * item.cantidad, 0);

            // Crear recibo
            db.query(
              'INSERT INTO recibos (usuario_id, total) VALUES (?, ?)',
              [usuario_id, total],
              (err, reciboResult) => {
                if (err) return res.sendStatus(200);
                const recibo_id = reciboResult.insertId;

                // Registrar compras
                items.forEach(item => {
                  const precio_total = parseFloat(item.price) * item.cantidad;
                  db.query(
                    'INSERT INTO compras (usuario_id, juego_id, cantidad, precio, recibo_id) VALUES (?, ?, ?, ?, ?)',
                    [usuario_id, item.juego_id, item.cantidad, precio_total, recibo_id]
                  );
                  db.query(
                    'UPDATE juegos SET stock = stock - ? WHERE id = ?',
                    [item.cantidad, item.juego_id]
                  );
                });

                // Vaciar carrito
                db.query('DELETE FROM carrito WHERE usuario_id = ?', [usuario_id]);
              }
            );
          }
        );
      }
    } catch (err) {
      console.error('Webhook error:', err);
    }
  }

  res.sendStatus(200);
});

const response = await preference.create({
  body: {
    items: items.map(item => ({
      title: item.title,
      quantity: Number(item.cantidad),
      unit_price: Math.round(parseFloat(item.price)),
      currency_id: 'COP'
    })),
    back_urls: {
      success: 'https://omnivore-basin-custody.ngrok-free.dev/pago-exitoso',
      failure: 'https://omnivore-basin-custody.ngrok-free.dev/pago-fallido',
      pending: 'https://omnivore-basin-custody.ngrok-free.dev/pago-pendiente'
    },
    auto_return: 'approved',
    external_reference: usuario_id.toString(),
    notification_url: 'https://TU_URL_NGROK_BACKEND/pagos/webhook'
  }
});

module.exports = router;
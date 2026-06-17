const express = require('express');
const router = express.Router();
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
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
          unit_price: Math.round(parseFloat(item.price)),
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
      const payment = new Payment(client);
      const pagoInfo = await payment.get({ id: data.id });

      if (pagoInfo.status === 'approved') {
        const usuario_id = pagoInfo.external_reference;

        db.query(
          `SELECT c.*, j.price FROM carrito c 
           INNER JOIN juegos j ON c.juego_id = j.id 
           WHERE c.usuario_id = ?`,
          [usuario_id],
          async (err, items) => {
            if (err || items.length === 0) return res.sendStatus(200);

            const total = items.reduce((acc, item) => acc + parseFloat(item.price) * item.cantidad, 0);

            db.query(
              'INSERT INTO recibos (usuario_id, total) VALUES (?, ?)',
              [usuario_id, total],
              (err, reciboResult) => {
                if (err) return res.sendStatus(200);
                const recibo_id = reciboResult.insertId;

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

module.exports = router;
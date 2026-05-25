const db = require('../db');

const create = ({ usuario_id, juego_id, cantidad }) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM juegos WHERE id = ?', [juego_id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error('Juego no encontrado'));

            const juego = results[0];
            if (juego.stock < cantidad) return reject(new Error('Stock insuficiente'));

            const precio_total = juego.price * cantidad;

            db.query(
                'INSERT INTO compras (usuario_id, juego_id, cantidad, precio) VALUES (?, ?, ?, ?)',
                [usuario_id, juego_id, cantidad, precio_total],
                (err) => {
                    if (err) return reject(err);
                    db.query(
                        'UPDATE juegos SET stock = stock - ? WHERE id = ?',
                        [cantidad, juego_id],
                        (err) => {
                            if (err) return reject(err);
                            resolve({ mensaje: '✅ Compra realizada', precio_total });
                        }
                    );
                }
            );
        });
    });
};

const getByUsuario = (usuario_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT c.id, j.title, c.cantidad, c.precio, c.fecha
            FROM compras c
            INNER JOIN juegos j ON c.juego_id = j.id
            WHERE c.usuario_id = ?`,
            [usuario_id],
            (err, results) => {
                if (err) reject(err);
                else resolve(results);
            }
        );
    });
};

module.exports = { create, getByUsuario };
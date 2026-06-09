const db = require('../db');  

const create = ({ usuario_id, total }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO recibos (usuario_id, total) VALUES (?, ?)',
            [usuario_id, total],
            (err, result) => {
                if (err) reject(err);
                else resolve({ mensaje: '✅ Recibo creado correctamente', id: result.insertId });
            }
        );
    });
};

const getByUsuario = (usuario_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM recibos WHERE usuario_id = ? ORDER BY fecha DESC',
            [usuario_id],
            (err, results) => {
                if (err) reject(err);
                else resolve(results);
            }
        );
    });
};

const getById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT r.id, r.total, r.fecha, r.usuario_id,
            c.cantidad, c.precio, j.title, j.imagen
            FROM recibos r
            INNER JOIN compras c ON c.recibo_id = r.id
            INNER JOIN juegos j ON c.juego_id = j.id
            WHERE r.id = ?`,
            [id],
            (err, results) => {
                if (err) reject(err);
                else resolve(results);
            }
        );
    });
};

module.exports = { create, getByUsuario, getById };

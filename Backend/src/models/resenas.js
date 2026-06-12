const db = require('../db');

const create = ({ usuario_id, juego_id, rating, comentario }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO resenas (usuario_id, juego_id, rating, comentario) VALUES (?, ?, ?, ?)',
            [usuario_id, juego_id, rating, comentario],
            (err, result) => {
                if (err) reject(err);
                else resolve({ mensaje: '✅ Reseña creada', id: result.insertId });
            }
        );
    });
};

const getByJuego = (juego_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT r.*, u.nombre AS nombre_usuario 
             FROM resenas r 
             JOIN usuarios u ON r.usuario_id = u.id 
             WHERE r.juego_id = ?
             ORDER BY r.fecha DESC`,
            [juego_id],
            (err, results) => {
                if (err) reject(err);
                else resolve(results);
            }
        );
    });
};

const getByUsuario = (usuario_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT r.*, j.title AS titulo_juego 
             FROM resenas r 
             JOIN juegos j ON r.juego_id = j.id 
             WHERE r.usuario_id = ?
             ORDER BY r.fecha DESC`,
            [usuario_id],
            (err, results) => {
                if (err) reject(err);
                else resolve(results);
            }
        );
    });
};

const update = ({ id, rating, comentario }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE resenas SET rating = ?, comentario = ? WHERE id = ?',
            [rating, comentario, id],
            (err, result) => {
                if (err) reject(err);
                else resolve({ mensaje: '✅ Reseña actualizada' });
            }
        );
    });
};
const remove = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM resenas WHERE id = ?', [id], (err, result) => {
            if (err) reject(err);
            else resolve({ mensaje: '✅ Reseña eliminada' });
        });
    });
};

module.exports = { create, getByJuego, getByUsuario, update, remove };
const db = require('../db');

const add = ({ usuario_id, juego_id, cantidad }) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM juegos WHERE id = ?', [juego_id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error('Juego no encontrado'));
            const juego = results[0];
            db.query('INSERT INTO carrito (usuario_id, juego_id, cantidad) VALUES (?, ?, ?)', [usuario_id, juego_id, cantidad], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    });
};

const getByUser = (usuario_id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT c.id, c.cantidad, j.id AS juego_id, j.title, j.price, j.imagen
            FROM carrito c
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

const remove = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM carrito WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};  

const emptyCart = (usuario_id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM carrito WHERE usuario_id = ?', [usuario_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });};

const updateCantidad = (id, cantidad) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE carrito SET cantidad = ? WHERE id = ?', [cantidad, id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

module.exports = { add, getByUser, remove, emptyCart, updateCantidad };
const db = require('../db');  // solo necesita db

const getAll = () => {
    return new Promise((resolve, reject) => {
        db.query(
        `SELECT j.*, d.nombre AS desarrollador, d.pais 
        FROM juegos j
        INNER JOIN desarrolladores d ON j.desarrollador_id = d.id`,
    (err, results) => {
        if (err) reject(err);
        else resolve(results);
    }
    );
});
};

const update = (id, data) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE juegos SET price = ?, stock = ?, title = ?, genre = ?, descripcion = ?, requisitos = ? WHERE id = ?',
            [data.price, data.stock, data.title, data.genre, data.descripcion, data.requisitos, id],
            (err, result) => {
                if (err) reject(err);
                else resolve({ mensaje: '✅ Juego actualizado' });
            }
        );
    });
};

const create = (data, imageUrl) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO juegos (title, genre, price, stock, release_date, desarrollador_id, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [data.title, data.genre, data.price, data.stock, data.release_date, data.desarrollador_id, imageUrl],
            (err, result) => {
                if (err) reject(err);
                else resolve({ mensaje: '✅ Juego agregado correctamente', id: result.insertId });
            }
        );
    });
};

const remove = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM juegos WHERE id = ?', [id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

const getById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT j.*, d.nombre AS desarrollador, d.pais
            FROM juegos j
            INNER JOIN desarrolladores d ON j.desarrollador_id = d.id
            WHERE j.id = ?`,
            [id],
            (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            }
        );
    });
};

module.exports = { getAll, update, create: create, remove, getById };

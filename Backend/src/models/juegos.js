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

module.exports = { getAll };

const update = (id, data) => {
    return new Promise((resolve, reject) => {
        db.query(  
            'UPDATE juegos SET price = ?, stock = ? WHERE id = ?',
            [data.price, data.stock, id],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};

module.exports = { getAll, update };

const create = (data) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO juegos (title, genre, price, stock, desarrollador_id) VALUES (?, ?, ?, ?, ?)',
            [data.title, data.genre, data.price, data.stock, data.desarrollador_id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
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

module.exports = { getAll, update, create: create, remove };

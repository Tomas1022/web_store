const db = require('../db');

const getAll = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM desarrolladores', (err, results) => {
            if (err) reject(err);
            else resolve(results); 
        });
    });
};

const create = ({ nombre, pais }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO desarrolladores (nombre, pais) VALUES (?, ?)', 
            [nombre, pais], 
            (err, result) => {
                if (err) reject(err);
                else resolve({ mensaje: '✅ Desarrollador creado', id: result.insertId });
            }
        );
    });
};


module.exports = { getAll, create };
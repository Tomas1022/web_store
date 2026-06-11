const db = require('../db');

const getByID = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id, nombre, email, rol, foto, descripcion, ubicacion FROM usuarios WHERE id = ?', [id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0]);
            }
        });
    });
};

const update = (id, { nombre, email, descripcion, ubicacion }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE usuarios SET nombre = ?, email = ?, descripcion = ?, ubicacion = ? WHERE id = ?',
            [nombre, email, descripcion, ubicacion, id],
            (err, results) => {
                if (err) reject(err);
                else resolve({ mensaje: '✅ Perfil actualizado correctamente' });
            }
        );
    });
};

const updatePhoto = (id, foto) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE usuarios SET foto = ? WHERE id = ?', [foto, id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const userDelete = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const getByIDWithPassword = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
            if (err) reject(err);
            else resolve(results[0]);
        });
    });
};

module.exports = { getByID, update, updatePhoto, userDelete, getByIDWithPassword };
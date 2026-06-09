const juegosModel = require('../models/juegos');

const getAll = async (req, res) => {
    try {
        const juegos = await juegosModel.getAll();
        res.json(juegos);
}   catch (err) {
        res.status(500).json({ error: err.message });
}
};

const update = async (req, res) => {
    try {
        const juegos = await juegosModel.update(req.params.id, req.body);
        res.json(juegos);
}   catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const create = async (req, res) => {
    try {
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const result = await juegosModel.create(req.body, imageUrl);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const result = await juegosModel.remove(req.params.id);
        res.json({ mensaje: '✅ Juego eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll, update, create, remove };


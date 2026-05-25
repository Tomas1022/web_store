const comprasModel = require('../models/compras');

const create = async (req, res) => {
    try {
        const { usuario_id, juego_id, cantidad } = req.body;
        const result = await comprasModel.create({ usuario_id, juego_id, cantidad });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getByUsuario = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const compras = await comprasModel.getByUsuario(usuario_id);
        res.json(compras);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { create, getByUsuario };
const RecibosModel = require('../models/recibos');

const getByUsuario = async (req, res) => {
    try {
        const result = await RecibosModel.getByUsuario(req.params.usuario_id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const crear = async (req, res) => {
    try {
        const result = await RecibosModel.create(req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } 
};
const getById = async (req, res) => {
    try {
        const result = await RecibosModel.getById(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getByUsuario, crear, getById };
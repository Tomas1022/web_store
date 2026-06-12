const ResenasModel = require('../models/resenas');

const create = async (req, res) => {
    try {
        const result = await ResenasModel.create(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByJuego = async (req, res) => {
    try {
        const result = await ResenasModel.getByJuego(req.params.juego_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByUsuario = async (req, res) => {
    try {
        const result = await ResenasModel.getByUsuario(req.params.usuario_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const result = await ResenasModel.update({ id: req.params.id, ...req.body });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const result = await ResenasModel.remove(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { create, getByJuego, getByUsuario, update, remove };

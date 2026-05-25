const desarrolladores = require('../models/desarrolladores');

const getAll = async (req, res) => {
    try {
        const devs = await desarrolladores.getAll();
        res.json(devs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const create = async (req, res) => {
    try {
        const { nombre, pais } = req.body;
        if (!nombre || !pais) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }
        const result = await desarrolladores.create({ nombre, pais });
        res.status(201).json({ id: result.insertId, nombre, pais });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll, create };
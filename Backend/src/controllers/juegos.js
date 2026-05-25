const JuegosModel = require('../models/juegos');

const getAll = async (req, res) => {
    try {
        const juegos = await JuegosModel.getAll();
        res.json(juegos);
}   catch (err) {
        res.status(500).json({ error: err.message });
}
};

const update = async (req, res) => {
    try {
        const juegos = await JuegosModel.update(req.params.id, req.body);
        res.json(juegos);
}   catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const create = async (req, res) => {
    try {
        const result = await JuegosModel.create(req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll, update, create };
module.exports = { getAll, update, create: create };
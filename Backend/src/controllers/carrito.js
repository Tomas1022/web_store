const carritoModel = require('../models/carrito');

const add = async (req, res) => {
    try {
        const { usuario_id, juego_id, cantidad } = req.body;
        const result = await carritoModel.add({ usuario_id, juego_id, cantidad }); // ← add
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getByUser = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const cartItems = await carritoModel.getByUser(usuario_id); // ← getByUser
        res.json(cartItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await carritoModel.remove(id); // ← remove
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const emptyCart = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const result = await carritoModel.emptyCart(usuario_id); // ← emptyCart
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateCantidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;
        const result = await carritoModel.updateCantidad(id, cantidad);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { add, getByUser, remove, emptyCart, updateCantidad };
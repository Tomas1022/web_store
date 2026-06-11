const UsuariosModel = require('../models/usuarios');

const getByID = async (req, res) => {
    try {
        const result = await UsuariosModel.getByID(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const result = await UsuariosModel.update(req.params.id, req.body); 
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePhoto = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No se subió ninguna foto' });
        const foto = `/uploads/${req.file.filename}`;
        const result = await UsuariosModel.updatePhoto(req.params.id, foto);
        res.json({ mensaje: '✅ Foto actualizada', foto });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const { password } = req.body;
        const { id } = req.params;

        // 1. Busca el usuario CON password
        const usuario = await UsuariosModel.getByIDWithPassword(id); // ← cambia esto
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

        // 2. Verifica la contraseña
        const bcrypt = require('bcryptjs');
        const valido = await bcrypt.compare(password, usuario.password);
        if (!valido) return res.status(401).json({ error: 'Contraseña incorrecta' });

        // 3. Elimina el usuario
        await UsuariosModel.userDelete(id);
        res.json({ mensaje: '✅ Cuenta eliminada correctamente' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getByID, update, updatePhoto, eliminar };
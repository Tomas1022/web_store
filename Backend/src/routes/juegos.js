const express = require('express');
const router = express.Router();
const JuegosController = require('../controllers/juegos');
const { verificarToken } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const db = require('../db');

router.get('/', JuegosController.getAll);
router.put('/:id', JuegosController.update);
router.post('/', verificarToken, upload.single('imagen'), JuegosController.create);
router.delete('/:id', JuegosController.remove);
router.get('/:id', JuegosController.getById);
// Subir imagen
router.post('/:id/imagen', verificarToken, upload.single('imagen'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No se subió ninguna imagen' });

    const imageUrl = `/uploads/${req.file.filename}`;

    db.query('UPDATE juegos SET imagen = ? WHERE id = ?', [imageUrl, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: '✅ Imagen subida correctamente', url: imageUrl });
    });
});

module.exports = router;
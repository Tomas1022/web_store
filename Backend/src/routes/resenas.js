const express = require('express');
const router = express.Router();
const ResenasController = require('../controllers/resenas'); // ← corregido

router.post('/', ResenasController.create);
router.get('/juego/:juego_id', ResenasController.getByJuego);
router.get('/usuario/:usuario_id', ResenasController.getByUsuario);
router.put('/:id', ResenasController.update); // ← agrega /:id para saber qué reseña editar
router.delete('/:id', ResenasController.remove);

module.exports = router;
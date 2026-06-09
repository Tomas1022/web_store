const express = require('express');
const router = express.Router();
const RecibosController = require('../controllers/recibos');

router.get('/detalle/:id', RecibosController.getById);
router.post('/', RecibosController.crear);
router.get('/:usuario_id', RecibosController.getByUsuario);

module.exports = router;
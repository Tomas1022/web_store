const express = require('express');
const router = express.Router();
const ComprasController = require('../controllers/compras');

router.post('/', ComprasController.create);
router.get('/:usuario_id', ComprasController.getByUsuario);

module.exports = router;
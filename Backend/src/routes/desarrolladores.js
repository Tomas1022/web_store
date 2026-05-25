const express = require('express');
const router = express.Router();
const DesarrolladoresController = require('../controllers/desarrolladores');
const { verificarToken } = require('../middlewares/auth');

router.get('/', DesarrolladoresController.getAll);
router.post('/', verificarToken, DesarrolladoresController.create); // ← solo el POST protegido

module.exports = router;

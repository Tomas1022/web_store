const express = require('express');
const router = express.Router();
const JuegosController = require('../controllers/juegos');

router.get('/', JuegosController.getAll);
router.put('/:id', JuegosController.update);
router.post('/', JuegosController.create);
router.delete('/:id', JuegosController.remove);

module.exports = router;
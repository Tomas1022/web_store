const express = require('express');
const router = express.Router();
const CarritoController = require('../controllers/carrito');

router.get('/:usuario_id', CarritoController.getByUser); // ver carrito
router.post('/', CarritoController.add); //agregar al carrito
router.delete('/:id', CarritoController.remove); // Eliminar item
router.delete('/vaciar/:usuario_id', CarritoController.emptyCart); // Vaciar carrito
router.put('/:id', CarritoController.updateCantidad);

module.exports = router;
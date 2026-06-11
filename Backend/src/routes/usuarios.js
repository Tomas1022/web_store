const express = require('express');
const router = express.Router();
const UsuariosController = require('../controllers/usuarios');
const upload = require('../middlewares/upload');

router.get('/:id', UsuariosController.getByID);
router.put('/:id', UsuariosController.update);
router.post('/:id/foto', upload.single('foto'), UsuariosController.updatePhoto);
router.delete('/:id', UsuariosController.eliminar);

module.exports = router;
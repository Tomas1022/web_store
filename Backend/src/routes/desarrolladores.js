const express = require('express');
const router = express.Router();
const DesarrolladoresController = require('../controllers/desarrolladores');

router.get('/', DesarrolladoresController.getAll);
router.post('/', DesarrolladoresController.create);

module.exports = router;


//get and create

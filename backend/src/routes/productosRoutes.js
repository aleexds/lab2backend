const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

// Rutas de productos
router.get('/', productosController.getProductos);
router.get('/:id', productosController.getProductoById);

module.exports = router;
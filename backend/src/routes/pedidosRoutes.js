const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

// Rutas de pedidos
router.get('/', pedidosController.getPedidos);
router.post('/', pedidosController.crearPedido);

module.exports = router;
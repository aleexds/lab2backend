const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

router.get('/', pedidosController.getPedidos);
router.post('/', pedidosController.crearPedido);
router.patch('/:id/estado', pedidosController.cambiarEstadoPedido);
router.delete('/:id', pedidosController.eliminarPedido);
router.get('/:id', pedidosController.getPedidoById);

module.exports = router;
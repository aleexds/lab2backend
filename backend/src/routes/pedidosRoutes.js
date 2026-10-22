const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

router.get('/', pedidosController.getPedidos);
router.post('/', pedidosController.crearPedido);
router.delete('/:id', pedidosController.eliminarPedido);

module.exports = router;
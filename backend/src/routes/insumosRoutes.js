const express = require('express');
const router = express.Router();
const insumosController = require('../controllers/insumosController');

router.get('/', insumosController.getInsumos);
router.post('/', insumosController.crearInsumo);
router.put('/:id', insumosController.actualizarInsumo);
router.patch('/:id/reabastecer', insumosController.reabastecerInsumo);
router.delete('/:id', insumosController.eliminarInsumo);

module.exports = router;
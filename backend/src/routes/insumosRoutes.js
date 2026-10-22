const express = require('express');
const router = express.Router();
const insumosController = require('../controllers/insumosController');

router.get('/', insumosController.getInsumos);
router.patch('/:id/reabastecer', insumosController.reabastecerInsumo);

module.exports = router;
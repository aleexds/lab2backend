const insumosService = require('../services/insumosService');

async function getInsumos(req, res) {
    try {
        const insumos = await insumosService.getInsumos();
        res.json({ ok: true, data: insumos });
    } catch (error) {
        console.error('Error al listar insumos:', error);
        res.status(500).json({ ok: false, error: 'Error al consultar inventario de insumos' });
    }
}

async function reabastecerInsumo(req, res) {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        if (!cantidad || isNaN(cantidad) || Number(cantidad) <= 0) {
            return res.status(400).json({ ok: false, error: 'Debe ingresar una cantidad numérica positiva a sumar' });
        }

        const insumoActualizado = await insumosService.actualizarStock(id, Number(cantidad));
        if (!insumoActualizado) {
            return res.status(404).json({ ok: false, error: 'Insumo no encontrado' });
        }

        res.json({ ok: true, data: insumoActualizado });
    } catch (error) {
        console.error('Error al reabastecer insumo:', error);
        res.status(500).json({ ok: false, error: 'Error al reabastecer stock del insumo' });
    }
}

module.exports = {
    getInsumos,
    reabastecerInsumo
};
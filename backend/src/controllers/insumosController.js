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

async function crearInsumo(req, res) {
  try {
    const { nombre, unidad, stock, stock_minimo } = req.body;
    if (!nombre || !unidad) {
      return res.status(400).json({ ok: false, error: 'El nombre y la unidad son obligatorios' });
    }

    const nuevo = await insumosService.crearInsumo({
      nombre,
      unidad,
      stock: Number(stock) || 0,
      stock_minimo: Number(stock_minimo) || 0
    });

    res.status(201).json({ ok: true, data: nuevo });
  } catch (error) {
    console.error('Error al crear insumo:', error);
    res.status(500).json({ ok: false, error: error.message || 'Error al guardar insumo' });
  }
}

async function actualizarInsumo(req, res) {
  try {
    const { id } = req.params;
    const { nombre, unidad, stock, stock_minimo } = req.body;

    const actualizado = await insumosService.actualizarInsumo(id, {
      nombre,
      unidad,
      stock: Number(stock),
      stock_minimo: Number(stock_minimo)
    });

    if (!actualizado) {
      return res.status(404).json({ ok: false, error: 'Insumo no encontrado' });
    }

    res.json({ ok: true, data: actualizado });
  } catch (error) {
    console.error('Error al actualizar insumo:', error);
    res.status(500).json({ ok: false, error: error.message || 'Error al actualizar insumo' });
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

async function eliminarInsumo(req, res) {
  try {
    const { id } = req.params;
    await insumosService.eliminarInsumo(id);
    res.json({ ok: true, message: `Insumo #${id} eliminado correctamente` });
  } catch (error) {
    console.error('Error al eliminar insumo:', error);
    res.status(400).json({ ok: false, error: error.message || 'Error al eliminar insumo' });
  }
}

module.exports = {
  getInsumos,
  crearInsumo,
  actualizarInsumo,
  reabastecerInsumo,
  eliminarInsumo
};
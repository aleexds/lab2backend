const pedidosService = require('../services/pedidosService');

async function getPedidos(req, res) {
  try {
    const pedidos = await pedidosService.getPedidos();
    res.json({ ok: true, data: pedidos });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

async function getPedidoById(req, res) {
  try {
    const { id } = req.params;
    const pedido = await pedidosService.getPedidoById(id);
    if (!pedido) {
      return res.status(404).json({ ok: false, error: 'Pedido no encontrado' });
    }
    res.json({ ok: true, data: pedido });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}

async function crearPedido(req, res) {
  try {
    const { metodo_pago, items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, error: 'Debe especificar al menos un producto en items' });
    }

    const pedido = await pedidosService.crearPedido(metodo_pago, items);
    res.status(201).json({ ok: true, data: pedido });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ ok: false, error: error.message });
  }
}

async function cambiarEstadoPedido(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const pedido = await pedidosService.cambiarEstadoPedido(id, estado);
    res.json({ ok: true, data: pedido });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ ok: false, error: error.message });
  }
}

async function eliminarPedido(req, res) {
  try {
    const { id } = req.params;
    await pedidosService.eliminarPedido(id);
    res.json({ ok: true, message: `Pedido #${id} eliminado correctamente` });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ ok: false, error: error.message });
  }
}

module.exports = {
  getPedidos,
  getPedidoById,
  crearPedido,
  cambiarEstadoPedido,
  eliminarPedido
};
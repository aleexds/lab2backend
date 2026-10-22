const pedidosService = require('../services/pedidosService');

// Controlador para crear un pedido
async function crearPedido(req, res) {
    try {
        const { metodo_pago, items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                ok: false,
                error: 'Debe especificar al menos un producto en items'
            });
        }

        const pedido = await pedidosService.crearPedido(metodo_pago, items);
        res.status(201).json({ ok: true, data: pedido });
    } catch (error) {
        console.error('Error al crear pedido:', error);
        res.status(500).json({ ok: false, error: error.message || 'Error interno del servidor al crear pedido' });
    }
}

// Controlador para listar pedidos
async function getPedidos(req, res) {
    try {
        const pedidos = await pedidosService.getPedidos();
        res.json({ ok: true, data: pedidos });
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ ok: false, error: error.message || 'Error interno del servidor al consultar pedidos' });
    }
}

async function eliminarPedido(req, res) {
    try {
        const { id } = req.params;
        const eliminado = await pedidosService.eliminarPedido(id);

        if (!eliminado) {
            return res.status(404).json({ ok: false, error: 'Pedido no encontrado' });
        }

        res.json({ ok: true, message: `Pedido #${id} eliminado y stock revertido correctamente` });
    } catch (error) {
        console.error('Error al eliminar pedido:', error);
        res.status(500).json({ ok: false, error: error.message || 'Error al eliminar el pedido' });
    }
}

async function cambiarEstadoPedido(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ ok: false, error: 'Debe especificar el nuevo estado' });
    }

    const pedidoActualizado = await pedidosService.cambiarEstadoPedido(id, estado);
    res.json({ ok: true, data: pedidoActualizado });
  } catch (error) {
    console.error('Error al cambiar estado del pedido:', error);
    res.status(500).json({ ok: false, error: error.message || 'Error al cambiar estado del pedido' });
  }
}

module.exports = {
  crearPedido,
  getPedidos,
  eliminarPedido,
  cambiarEstadoPedido
};
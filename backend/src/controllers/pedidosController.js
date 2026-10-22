const pedidosService = require('../services/pedidosService');

// Controlador para crear un pedido
async function crearPedido(req, res) {
    try {
        const { mesa, items } = req.body;

        if (!mesa || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                ok: false,
                error: 'Debe especificar el número de mesa y al menos un producto en items'
            });
        }

        const pedido = await pedidosService.crearPedido(mesa, items);
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
        res.status(500).json({ ok: false, error: 'Error interno del servidor al consultar pedidos' });
    }
}

module.exports = {
    crearPedido,
    getPedidos
};
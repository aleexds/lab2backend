const productosService = require('../services/productosService');

// Controlador para listar todos los productos
async function getProductos(req, res) {
    try {
        const productos = await productosService.getProductos();
        res.json({ ok: true, data: productos });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor al consultar productos' });
    }
}

// Controlador para obtener el detalle de un producto y su receta
async function getProductoById(req, res) {
    try {
        const { id } = req.params;
        const producto = await productosService.getProductoById(id);

        if (!producto) {
            return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
        }

        res.json({ ok: true, data: producto });
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor al consultar el detalle' });
    }
}

module.exports = {
    getProductos,
    getProductoById
};
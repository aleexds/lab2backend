const productosService = require('../services/productosService');

async function getProductos(req, res) {
    try {
    const productos = await productosService.getProductos();
    res.json({ ok: true, data: productos });
    } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ ok: false, error: 'Error al consultar productos' });
    }
}

async function crearProducto(req, res) {
    try {
    const { nombre, precio, categoria, ingredientes } = req.body;
    if (!nombre || !precio || isNaN(precio) || Number(precio) <= 0) {
        return res.status(400).json({ ok: false, error: 'Nombre y precio válido son requeridos' });
    }

    const nuevo = await productosService.crearProducto({
        nombre,
        precio: Number(precio),
        categoria: categoria || 'General',
        ingredientes
    });
    res.status(201).json({ ok: true, data: nuevo });
    } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ ok: false, error: error.message || 'Error al guardar producto' });
    }
}

async function actualizarProducto(req, res) {
    try {
    const { id } = req.params;
    const { nombre, precio, categoria, ingredientes } = req.body;

    const actualizado = await productosService.actualizarProducto(id, {
        nombre,
        precio: Number(precio),
        categoria,
        ingredientes
    });
    res.json({ ok: true, data: actualizado });
    } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ ok: false, error: error.message || 'Error al actualizar producto' });
    }
}

async function eliminarProducto(req, res) {
    try {
    const { id } = req.params;
    await productosService.eliminarProducto(id);
    res.json({ ok: true, message: `Producto #${id} eliminado correctamente` });
    } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ ok: false, error: error.message || 'Error al eliminar producto' });
    }
}

module.exports = {
    getProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
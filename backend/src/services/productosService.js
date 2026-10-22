const db = require('../db');

// Obtener todos los productos activos
async function getProductos() {
    const query = 'SELECT * FROM productos WHERE activo = true ORDER BY id ASC';
    const { rows } = await db.query(query);
    return rows;
}

// Obtener un producto por ID con sus ingredientes/receta asociados
async function getProductoById(id) {
    const productoQuery = 'SELECT * FROM productos WHERE id = $1';
    const productoResult = await db.query(productoQuery, [id]);

    if (productoResult.rows.length === 0) {
        return null;
    }

    const recetaQuery = `
        SELECT r.id, r.cantidad, i.nombre AS insumo_nombre, i.unidad
        FROM recetas r
        JOIN insumos i ON r.insumo_id = i.id
        WHERE r.producto_id = $1
    `;
    const recetaResult = await db.query(recetaQuery, [id]);

    return {
        ...productoResult.rows[0],
        receta: recetaResult.rows
    };
}

module.exports = {
    getProductos,
    getProductoById
};
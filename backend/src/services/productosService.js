const { pool } = require('../db');

// Obtener todos los productos con sus ingredientes asociados
async function getProductos() {
    const query = `
    SELECT p.id, p.nombre, p.precio, p.categoria,
            COALESCE(
                json_agg(
                json_build_object(
                    'insumo_id', r.insumo_id,
                    'nombre_insumo', i.nombre,
                    'cantidad', r.cantidad,
                    'unidad', i.unidad
                )
                ) FILTER (WHERE r.id IS NOT NULL),
                '[]'
            ) AS ingredientes
    FROM productos p
    LEFT JOIN recetas r ON p.id = r.producto_id
    LEFT JOIN insumos i ON r.insumo_id = i.id
    GROUP BY p.id, p.nombre, p.precio, p.categoria
    ORDER BY p.id ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
}

// Crear producto nuevo con su receta opcional (transacción)
async function crearProducto(datos) {
    const { nombre, precio, categoria, ingredientes = [] } = datos;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

    const insertProd = `
        INSERT INTO productos (nombre, precio, categoria)
        VALUES ($1, $2, $3)
        RETURNING id, nombre, precio, categoria
    `;
    const resProd = await client.query(insertProd, [nombre, precio, categoria]);
    const producto = resProd.rows[0];

    for (const ing of ingredientes) {
        if (ing.insumo_id && ing.cantidad > 0) {
            await client.query(
                'INSERT INTO recetas (producto_id, insumo_id, cantidad) VALUES ($1, $2, $3)',
                [producto.id, ing.insumo_id, ing.cantidad]
            );
        }
    }

        await client.query('COMMIT');
        return producto;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

// Actualizar producto y reemplazar su receta
async function actualizarProducto(id, datos) {
    const { nombre, precio, categoria, ingredientes = [] } = datos;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

    const updateProd = `
        UPDATE productos
        SET nombre = $1, precio = $2, categoria = $3
        WHERE id = $4
        RETURNING id, nombre, precio, categoria
    `;
    const resProd = await client.query(updateProd, [nombre, precio, categoria, id]);
    if (resProd.rows.length === 0) {
        throw new Error('Producto no encontrado');
    }

    // Reemplazar recetas previas
    await client.query('DELETE FROM recetas WHERE producto_id = $1', [id]);
    for (const ing of ingredientes) {
        if (ing.insumo_id && ing.cantidad > 0) {
            await client.query(
                'INSERT INTO recetas (producto_id, insumo_id, cantidad) VALUES ($1, $2, $3)',
                [id, ing.insumo_id, ing.cantidad]
            );
        }
    }

        await client.query('COMMIT');
    return resProd.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

// Eliminar producto
async function eliminarProducto(id) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE FROM recetas WHERE producto_id = $1', [id]);
        const res = await client.query('DELETE FROM productos WHERE id = $1 RETURNING id', [id]);
        if (res.rows.length === 0) {
            throw new Error('Producto no encontrado');
        }
        await client.query('COMMIT');
        return res.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
    throw error;
    } finally {
    client.release();
    }
}

module.exports = {
    getProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
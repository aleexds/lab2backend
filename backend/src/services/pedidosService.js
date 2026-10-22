const { pool } = require('../db');

// Crear un nuevo pedido con transacción y descuento de stock
async function crearPedido(mesa, items) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Calcular el total y verificar recetas
        let total = 0;
        for (const item of items) {
            const prodRes = await client.query('SELECT precio FROM productos WHERE id = $1', [item.producto_id]);
            if (prodRes.rows.length === 0) {
                throw new Error(`Producto con ID ${item.producto_id} no encontrado`);
            }
            total += Number(prodRes.rows[0].precio) * item.cantidad;
        }

        // 2. Insertar el pedido en la cabecera
        const pedidoInsert = `
            INSERT INTO pedidos (mesa, total, estado)
            VALUES ($1, $2, 'pendiente')
            RETURNING id, mesa, total, estado, created_at
        `;
        const pedidoRes = await client.query(pedidoInsert, [mesa, total]);
        const pedido = pedidoRes.rows[0];

        // 3. Insertar items y descontar insumos
        for (const item of items) {
            const itemInsert = `
                INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
                VALUES ($1, $2, $3, (SELECT precio FROM productos WHERE id = $2))
            `;
            await client.query(itemInsert, [pedido.id, item.producto_id, item.cantidad]);

            // Consultar insumos requeridos por producto
            const recetaRes = await client.query(
                'SELECT insumo_id, cantidad FROM recetas WHERE producto_id = $1',
                [item.producto_id]
            );

            // Descontar cada insumo del inventario
            for (const ing of recetaRes.rows) {
                const consumoTotal = Number(ing.cantidad) * item.cantidad;
                const updateStock = `
                    UPDATE insumos
                    SET stock_actual = stock_actual - $1
                    WHERE id = $2
                `;
                await client.query(updateStock, [consumoTotal, ing.insumo_id]);
            }
        }

        await client.query('COMMIT');
        return pedido;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

// Listar todos los pedidos con sus items
async function getPedidos() {
    const query = `
        SELECT p.id, p.mesa, p.total, p.estado, p.created_at,
        json_agg(
            json_build_object(
                'producto', pr.nombre,
                'cantidad', pi.cantidad,
                'precio_unitario', pi.precio_unitario
            )
        ) AS items
    FROM pedidos p
    LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
    LEFT JOIN productos pr ON pi.producto_id = pr.id
    GROUP BY p.id
    ORDER BY p.id DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
}

module.exports = {
    crearPedido,
    getPedidos
};
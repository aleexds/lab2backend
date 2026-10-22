const { pool } = require('../db');

// Crear un nuevo pedido con transacción y descuento de stock
async function crearPedido(metodo_pago, items) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

    // 1. Calcular el subtotal sumando los productos
    let subtotal = 0;
    for (const item of items) {
        const prodRes = await client.query('SELECT precio FROM productos WHERE id = $1', [item.producto_id]);
        if (prodRes.rows.length === 0) {
            throw new Error(`Producto con ID ${item.producto_id} no encontrado`);
        }
      subtotal += Number(prodRes.rows[0].precio) * item.cantidad;
    }

    const impuesto = 0;
    const total = subtotal + impuesto;

    // 2. Insertar el pedido en la cabecera
    const pedidoInsert = `
        INSERT INTO pedidos (metodo_pago, subtotal, impuesto, total, estado)
        VALUES ($1, $2, $3, $4, 'completado')
        RETURNING id, fecha, metodo_pago, subtotal, impuesto, total, estado
    `;
    const pedidoRes = await client.query(pedidoInsert, [metodo_pago || 'efectivo', subtotal, impuesto, total]);
    const pedido = pedidoRes.rows[0];

    // 3. Insertar items y descontar insumos
    for (const item of items) {
        const itemInsert = `
            INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
            VALUES ($1, $2, $3, (SELECT precio FROM productos WHERE id = $2))
        `;
        await client.query(itemInsert, [pedido.id, item.producto_id, item.cantidad]);

        // Consultar insumos requeridos en la receta
        const recetaRes = await client.query(
            'SELECT insumo_id, cantidad FROM recetas WHERE producto_id = $1',
            [item.producto_id]
        );

        // Descontar cada insumo del inventario usando la columna 'stock'
        for (const ing of recetaRes.rows) {
            const consumoTotal = Number(ing.cantidad) * item.cantidad;
            const updateStock = `
                UPDATE insumos
                SET stock = stock - $1
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

// Listar todos los pedidos con sus items asociados
async function getPedidos() {
    const query = `
    SELECT p.id, p.fecha, p.metodo_pago, p.subtotal, p.impuesto, p.total, p.estado,
        COALESCE(
            json_agg(
                json_build_object(
                    'producto', pr.nombre,
                    'cantidad', pi.cantidad,
                    'precio_unitario', pi.precio_unitario
                )
            ) FILTER (WHERE pi.id IS NOT NULL),
            '[]'
        ) AS items
    FROM pedidos p
    LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
    LEFT JOIN productos pr ON pi.producto_id = pr.id
    GROUP BY p.id, p.fecha, p.metodo_pago, p.subtotal, p.impuesto, p.total, p.estado
    ORDER BY p.id DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
}

module.exports = {
  crearPedido,
  getPedidos,
  eliminarPedido,
  cambiarEstadoPedido
};

// Revertir insumos consumidos y eliminar el pedido
async function eliminarPedido(id) {
    const client = await pool.connect();

    try {
    await client.query('BEGIN');

    // 1. Obtener los items del pedido a eliminar
    const itemsRes = await client.query(
        'SELECT producto_id, cantidad FROM pedido_items WHERE pedido_id = $1',
        [id]
    );

    if (itemsRes.rows.length === 0) {
      // Verificar si al menos existe el pedido
        const existe = await client.query('SELECT id FROM pedidos WHERE id = $1', [id]);
        if (existe.rows.length === 0) {
            throw new Error('Pedido no encontrado');
        }
    }

    // 2. Por cada producto, devolver los insumos de su receta al inventario
    for (const item of itemsRes.rows) {
        const recetaRes = await client.query(
            'SELECT insumo_id, cantidad FROM recetas WHERE producto_id = $1',
            [item.producto_id]
        );

        for (const ing of recetaRes.rows) {
            const consumoADevolver = Number(ing.cantidad) * item.cantidad;
            const revertStock = `
                UPDATE insumos
                SET stock = stock + $1
                WHERE id = $2
            `;
        await client.query(revertStock, [consumoADevolver, ing.insumo_id]);
        }
    }

    // 3. Eliminar los items asociados
    await client.query('DELETE FROM pedido_items WHERE pedido_id = $1', [id]);

    // 4. Eliminar el registro del pedido
    const deleteRes = await client.query('DELETE FROM pedidos WHERE id = $1 RETURNING id', [id]);

    await client.query('COMMIT');
    return deleteRes.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

// Cambiar estado del pedido ajustando inventario según corresponda
async function cambiarEstadoPedido(id, nuevoEstado) {
  if (!['completado', 'anulado'].includes(nuevoEstado)) {
    throw new Error("Estado no permitido. Debe ser 'completado' o 'anulado'");
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Obtener estado previo del pedido
    const pedidoActualRes = await client.query('SELECT id, estado FROM pedidos WHERE id = $1', [id]);
    if (pedidoActualRes.rows.length === 0) {
      throw new Error('Pedido no encontrado');
    }

    const estadoAnterior = pedidoActualRes.rows[0].estado;

    // 2. Si el estado cambia, ajustar stock en insumos
    if (estadoAnterior !== nuevoEstado) {
      const itemsRes = await client.query(
        'SELECT producto_id, cantidad FROM pedido_items WHERE pedido_id = $1',
        [id]
      );

      for (const item of itemsRes.rows) {
        const recetaRes = await client.query(
          'SELECT insumo_id, cantidad FROM recetas WHERE producto_id = $1',
          [item.producto_id]
        );

        for (const ing of recetaRes.rows) {
          const impacto = Number(ing.cantidad) * item.cantidad;

          if (nuevoEstado === 'anulado' && estadoAnterior === 'completado') {
            // Anulado: se devuelven los insumos al stock
            await client.query('UPDATE insumos SET stock = stock + $1 WHERE id = $2', [impacto, ing.insumo_id]);
          } else if (nuevoEstado === 'completado' && estadoAnterior === 'anulado') {
            // Revertido a completado: se vuelven a descontar
            await client.query('UPDATE insumos SET stock = stock - $1 WHERE id = $2', [impacto, ing.insumo_id]);
          }
        }
      }
    }

    // 3. Actualizar la cabecera del pedido
    const updateRes = await client.query(
      'UPDATE pedidos SET estado = $1 WHERE id = $2 RETURNING id, fecha, metodo_pago, subtotal, impuesto, total, estado',
      [nuevoEstado, id]
    );

    await client.query('COMMIT');
    return updateRes.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
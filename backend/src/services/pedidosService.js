const { pool } = require('../db');

// 1. Obtener pedido por ID con sus items detallados
async function getPedidoById(id) {
  const query = `
    SELECT p.id, p.fecha, p.metodo_pago, p.subtotal, p.impuesto, p.total, p.estado,
           COALESCE(
             json_agg(
               json_build_object(
                 'producto_id', pi.producto_id,
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
    WHERE p.id = $1
    GROUP BY p.id, p.fecha, p.metodo_pago, p.subtotal, p.impuesto, p.total, p.estado
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

// 2. Crear pedido validando stock (409) y aplicando el 13% de IVA
async function crearPedido(metodo_pago, items) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Mapeo acumulado de consumo de insumos para validar disponibilidad previa
    const consumoInsumos = {};
    let subtotal = 0;

    for (const item of items) {
      const prodRes = await client.query('SELECT nombre, precio FROM productos WHERE id = $1', [item.producto_id]);
      if (prodRes.rows.length === 0) {
        const error = new Error(`Producto con ID ${item.producto_id} no encontrado`);
        error.status = 404;
        throw error;
      }

      const prod = prodRes.rows[0];
      subtotal += Number(prod.precio) * item.cantidad;

      // Obtener receta del producto
      const recetaRes = await client.query(
        'SELECT insumo_id, cantidad FROM recetas WHERE producto_id = $1',
        [item.producto_id]
      );

      for (const ing of recetaRes.rows) {
        consumoInsumos[ing.insumo_id] = (consumoInsumos[ing.insumo_id] || 0) + (Number(ing.cantidad) * item.cantidad);
      }
    }

    // Regla de negocio: Validar si hay stock suficiente de cada insumo antes de procesar
    for (const [insumoId, cantidadRequerida] of Object.entries(consumoInsumos)) {
      const insumoRes = await client.query('SELECT nombre, stock, unidad FROM insumos WHERE id = $1', [insumoId]);
      if (insumoRes.rows.length === 0) {
        const error = new Error(`Insumo #${insumoId} no existe`);
        error.status = 404;
        throw error;
      }

      const insumo = insumoRes.rows[0];
      if (Number(insumo.stock) < cantidadRequerida) {
        const error = new Error(`Stock insuficiente de "${insumo.nombre}". Disponible: ${insumo.stock} ${insumo.unidad}, Requerido: ${cantidadRequerida} ${insumo.unidad}`);
        error.status = 409; // Conflicto con regla de negocio
        throw error;
      }
    }

    // Regla de negocio: Calcular el 13% de impuesto de venta
    const impuesto = Math.round(subtotal * 0.13);
    const total = subtotal + impuesto;

    // Insertar pedido cabecera
    const pedidoInsert = `
      INSERT INTO pedidos (metodo_pago, subtotal, impuesto, total, estado)
      VALUES ($1, $2, $3, $4, 'completado')
      RETURNING id, fecha, metodo_pago, subtotal, impuesto, total, estado
    `;
    const pedidoRes = await client.query(pedidoInsert, [metodo_pago || 'efectivo', subtotal, impuesto, total]);
    const pedido = pedidoRes.rows[0];

    // Insertar items y descontar insumos
    for (const item of items) {
      await client.query(
        `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, (SELECT precio FROM productos WHERE id = $2))`,
        [pedido.id, item.producto_id, item.cantidad]
      );
    }

    for (const [insumoId, cantidadRequerida] of Object.entries(consumoInsumos)) {
      await client.query(
        'UPDATE insumos SET stock = stock - $1 WHERE id = $2',
        [cantidadRequerida, insumoId]
      );
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

// 3. Listar todos los pedidos
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

// 4. Cambiar estado validando límite de 15 minutos para anulación
async function cambiarEstadoPedido(id, nuevoEstado) {
  if (!['completado', 'anulado'].includes(nuevoEstado)) {
    const error = new Error("Estado no permitido. Debe ser 'completado' o 'anulado'");
    error.status = 400;
    throw error;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const pedidoRes = await client.query('SELECT id, fecha, estado FROM pedidos WHERE id = $1', [id]);
    if (pedidoRes.rows.length === 0) {
      const error = new Error('Pedido no encontrado');
      error.status = 404;
      throw error;
    }

    const pedido = pedidoRes.rows[0];

    // Regla de negocio: Un pedido solo se puede anular en los primeros 15 minutos
    if (nuevoEstado === 'anulado' && pedido.estado === 'completado') {
      const fechaPedido = new Date(pedido.fecha).getTime();
      const ahora = Date.now();
      const minutosTranscurridos = (ahora - fechaPedido) / (1000 * 60);

      if (minutosTranscurridos > 15) {
        const error = new Error(`No se puede anular el pedido #${id}. Han transcurrido más de 15 minutos desde su emisión (${Math.floor(minutosTranscurridos)} min)`);
        error.status = 409; // Conflicto con regla de negocio
        throw error;
      }

      // Devolver insumos al stock
      const itemsRes = await client.query('SELECT producto_id, cantidad FROM pedido_items WHERE pedido_id = $1', [id]);
      for (const item of itemsRes.rows) {
        const recetaRes = await client.query('SELECT insumo_id, cantidad FROM recetas WHERE producto_id = $1', [item.producto_id]);
        for (const ing of recetaRes.rows) {
          const devolver = Number(ing.cantidad) * item.cantidad;
          await client.query('UPDATE insumos SET stock = stock + $1 WHERE id = $2', [devolver, ing.insumo_id]);
        }
      }
    } else if (nuevoEstado === 'completado' && pedido.estado === 'anulado') {
      // Re-descontar insumos
      const itemsRes = await client.query('SELECT producto_id, cantidad FROM pedido_items WHERE pedido_id = $1', [id]);
      for (const item of itemsRes.rows) {
        const recetaRes = await client.query('SELECT insumo_id, cantidad FROM recetas WHERE producto_id = $1', [item.producto_id]);
        for (const ing of recetaRes.rows) {
          const descontar = Number(ing.cantidad) * item.cantidad;
          await client.query('UPDATE insumos SET stock = stock - $1 WHERE id = $2', [descontar, ing.insumo_id]);
        }
      }
    }

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

// 5. Eliminar pedido
async function eliminarPedido(id) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const itemsRes = await client.query('SELECT producto_id, cantidad FROM pedido_items WHERE pedido_id = $1', [id]);
    for (const item of itemsRes.rows) {
      const recetaRes = await client.query('SELECT insumo_id, cantidad FROM recetas WHERE producto_id = $1', [item.producto_id]);
      for (const ing of recetaRes.rows) {
        const consumoADevolver = Number(ing.cantidad) * item.cantidad;
        await client.query('UPDATE insumos SET stock = stock + $1 WHERE id = $2', [consumoADevolver, ing.insumo_id]);
      }
    }

    await client.query('DELETE FROM pedido_items WHERE pedido_id = $1', [id]);
    const deleteRes = await client.query('DELETE FROM pedidos WHERE id = $1 RETURNING id', [id]);
    if (deleteRes.rows.length === 0) {
      const error = new Error('Pedido no encontrado');
      error.status = 404;
      throw error;
    }

    await client.query('COMMIT');
    return deleteRes.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  getPedidos,
  getPedidoById,
  crearPedido,
  cambiarEstadoPedido,
  eliminarPedido
};
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

    const impuesto = 0; // o subtotal * 0.13 si manejas IVA
    const total = subtotal + impuesto;

    // 2. Insertar el pedido en la cabecera
    const pedidoInsert = `
      INSERT INTO pedidos (metodo_pago, subtotal, impuesto, total, estado)
      VALUES ($1, $2, $3, $4, 'pendiente')
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
  getPedidos
};
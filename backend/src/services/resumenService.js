const { pool } = require('../db');

async function getResumenCierreCaja() {
  // 1. Total vendido hoy agrupado por método de pago (solo completados)
  const queryVentasPorPago = `
    SELECT metodo_pago,
           COUNT(id)::int AS total_pedidos,
           COALESCE(SUM(total), 0)::numeric AS total_recaudado
    FROM pedidos
    WHERE estado = 'completado' 
      AND fecha::date = CURRENT_DATE
    GROUP BY metodo_pago
  `;

  // 2. Métricas generales del día (Total dinero e impuestos generados)
  const queryTotalesDia = `
    SELECT COUNT(id)::int AS pedidos_hoy,
           COALESCE(SUM(subtotal), 0)::numeric AS subtotal_hoy,
           COALESCE(SUM(impuesto), 0)::numeric AS impuestos_hoy,
           COALESCE(SUM(total), 0)::numeric AS total_hoy
    FROM pedidos
    WHERE estado = 'completado' 
      AND fecha::date = CURRENT_DATE
  `;

  // 3. Top 5 productos más vendidos históricamente o del periodo
  const queryTopProductos = `
    SELECT pr.nombre,
           SUM(pi.cantidad)::int AS unidades_vendidas,
           SUM(pi.cantidad * pi.precio_unitario)::numeric AS total_generado
    FROM pedido_items pi
    JOIN pedidos p ON pi.pedido_id = p.id
    JOIN productos pr ON pi.producto_id = pr.id
    WHERE p.estado = 'completado'
    GROUP BY pr.id, pr.nombre
    ORDER BY unidades_vendidas DESC
    LIMIT 5
  `;

  // 4. Insumos en estado crítico (stock <= stock_minimo)
  const queryInsumosCriticos = `
    SELECT id, nombre, stock, stock_minimo, unidad
    FROM insumos
    WHERE stock <= stock_minimo
    ORDER BY stock ASC
  `;

  const [resVentasPago, resTotales, resTop, resInsumos] = await Promise.all([
    pool.query(queryVentasPorPago),
    pool.query(queryTotalesDia),
    pool.query(queryTopProductos),
    pool.query(queryInsumosCriticos)
  ]);

  return {
    totales_dia: resTotales.rows[0] || { pedidos_hoy: 0, subtotal_hoy: 0, impuestos_hoy: 0, total_hoy: 0 },
    ventas_por_metodo_pago: resVentasPago.rows,
    top_5_productos: resTop.rows,
    insumos_criticos: resInsumos.rows
  };
}

// Obtener insumos críticos y ventas de los últimos 7 días para el agente de IA
async function getDatosParaIA() {
  // Insumos por debajo o cerca del stock mínimo
  const queryInsumos = `
    SELECT id, nombre, stock, stock_minimo, unidad,
           ROUND((stock_minimo - stock)::numeric, 2) AS deficit
    FROM insumos
    WHERE stock <= stock_minimo
    ORDER BY deficit DESC
  `;

  // Consumo/ventas de productos en los últimos 7 días
  const queryVentasSemana = `
    SELECT pr.nombre,
           SUM(pi.cantidad)::int AS unidades_vendidas_semana
    FROM pedido_items pi
    JOIN pedidos p ON pi.pedido_id = p.id
    JOIN productos pr ON pi.producto_id = pr.id
    WHERE p.estado = 'completado'
      AND p.fecha >= NOW() - INTERVAL '7 days'
    GROUP BY pr.id, pr.nombre
    ORDER BY unidades_vendidas_semana DESC
  `;

  const [resInsumos, resVentas] = await Promise.all([
    pool.query(queryInsumos),
    pool.query(queryVentasSemana)
  ]);

  return {
    insumos_bajo_minimo: resInsumos.rows,
    ventas_ultima_semana: resVentas.rows
  };
}

module.exports = {
  getResumenCierreCaja,
  getDatosParaIA
};
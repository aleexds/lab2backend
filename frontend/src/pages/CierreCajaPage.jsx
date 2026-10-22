import { useFetch } from '../hooks/useFetch';
import { getResumen } from '../services/api';

export default function CierreCajaPage() {
  const { data: resumen, loading, error, refetch } = useFetch(getResumen);

  if (loading) return <p style={{ padding: '24px' }}>Calculando corte y cierre de caja...</p>;
  if (error) return <p style={{ padding: '24px', color: 'red' }}>Error: {error}</p>;
  if (!resumen) return null;

  const { totales_dia, ventas_por_metodo_pago, top_5_productos, insumos_criticos } = resumen;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#2c1810' }}>Cierre de Caja del Día</h2>
          <small style={{ color: '#666' }}>Métricas operativas del día calculadas en base de datos</small>
        </div>
        <button
          onClick={() => refetch()}
          style={{ padding: '8px 16px', background: '#2c1810', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Actualizar Cierre
        </button>
      </div>

      {/* Tarjetas de Totales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #2c1810', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: '0 0 6px 0', color: '#666' }}>Pedidos Efectivos (Hoy)</p>
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#2c1810' }}>{totales_dia.pedidos_hoy}</h3>
        </div>
        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #0d6efd', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: '0 0 6px 0', color: '#666' }}>Subtotal Neto</p>
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0d6efd' }}>₡{Number(totales_dia.subtotal_hoy).toLocaleString()}</h3>
        </div>
        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #ffc107', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: '0 0 6px 0', color: '#666' }}>IVA Recaudado (13%)</p>
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#856404' }}>₡{Number(totales_dia.impuestos_hoy).toLocaleString()}</h3>
        </div>
        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #198754', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: '0 0 6px 0', color: '#666' }}>Total en Caja (Hoy)</p>
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#198754' }}>₡{Number(totales_dia.total_hoy).toLocaleString()}</h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Desglose por Método de Pago */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#2c1810' }}>Ventas por Método de Pago</h3>
          {ventas_por_metodo_pago.length === 0 ? (
            <p style={{ color: '#888' }}>No se han cerrado ventas el día de hoy.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Método</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>Órdenes</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {ventas_por_metodo_pago.map((v, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', textTransform: 'uppercase', fontWeight: 600 }}>{v.metodo_pago}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{v.total_pedidos}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>₡{Number(v.total_recaudado).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top 5 Productos Más Vendidos */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#2c1810' }}>Top 5 Productos Más Vendidos</h3>
          {top_5_productos.length === 0 ? (
            <p style={{ color: '#888' }}>No hay ventas registradas aún.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Producto</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>Unidades</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {top_5_productos.map((prod, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', fontWeight: 500 }}>{prod.nombre}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{prod.unidades_vendidas}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>₡{Number(prod.total_generado).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Alerta de Insumos Críticos */}
      {insumos_criticos.length > 0 && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffeeba', padding: '16px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>⚠️ Insumos en Nivel Crítico (Bajo el stock mínimo)</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
            {insumos_criticos.map((ins) => (
              <li key={ins.id} style={{ marginBottom: '4px' }}>
                <strong>{ins.nombre}</strong>: Quedan {Number(ins.stock)} {ins.unidad} (Mínimo sugerido: {Number(ins.stock_minimo)} {ins.unidad})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
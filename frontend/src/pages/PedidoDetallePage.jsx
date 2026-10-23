import { useParams, Link, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { getPedidoById, cambiarEstadoPedido, eliminarPedido } from '../services/api';

export default function PedidoDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: pedido, loading, error, refetch } = useFetch(
    () => getPedidoById(id)
  );

  async function handleCambiarEstado(nuevoEstado) {
    try {
      await cambiarEstadoPedido(id, nuevoEstado);
      refetch();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  }

  async function handleEliminar() {
    if (!window.confirm(`¿Seguro que deseas eliminar definitivamente el pedido #${id}?`)) return;
    try {
      await eliminarPedido(id);
      navigate('/pedidos');
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
    }
  }

  if (loading) return <p style={{ padding: '24px' }}>Cargando detalle del pedido #{id}...</p>;
  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <p style={{ color: '#dc3545', fontWeight: 600 }}>Error: {error}</p>
        <Link to="/pedidos" style={{ color: '#2c1810', textDecoration: 'underline' }}>Volver al Historial</Link>
      </div>
    );
  }
  if (!pedido) return null;

  const esCompletado = pedido.estado === 'completado';

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/pedidos" style={{ color: '#2c1810', textDecoration: 'none', fontWeight: 500 }}>
          ← Volver al Historial de Pedidos
        </Link>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: '0 0 6px 0', color: '#2c1810' }}>Pedido #{pedido.id}</h2>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              Fecha: {new Date(pedido.fecha).toLocaleString()}
            </span>
          </div>
          <span style={{
            padding: '6px 14px',
            borderRadius: '16px',
            background: esCompletado ? '#d4edda' : '#f8d7da',
            color: esCompletado ? '#155724' : '#721c24',
            fontWeight: 600,
            textTransform: 'capitalize'
          }}>
            {pedido.estado}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', background: '#fcfcfc', padding: '16px', borderRadius: '6px' }}>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '0.85rem' }}>Método de Pago</p>
            <p style={{ margin: 0, fontWeight: 600, textTransform: 'uppercase' }}>{pedido.metodo_pago}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '0.85rem' }}>Tipo de Comprobante</p>
            <p style={{ margin: 0, fontWeight: 600 }}>Tiquete Electrónico</p>
          </div>
        </div>

        <h3 style={{ color: '#2c1810', marginBottom: '12px' }}>Productos y Cantidades</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Producto</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd', textAlign: 'center' }}>Cantidad</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Precio Unitario</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.items?.map((item, idx) => {
              const lineaSubtotal = Number(item.precio_unitario) * item.cantidad;
              return (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', fontWeight: 500 }}>{item.producto}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>x{item.cantidad}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>₡{Number(item.precio_unitario).toLocaleString()}</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: 600 }}>₡{lineaSubtotal.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Desglose Financiero */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <div style={{ width: '260px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#666' }}>Subtotal:</span>
              <span style={{ fontWeight: 500 }}>₡{Number(pedido.subtotal).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#666' }}>IVA (13%):</span>
              <span style={{ fontWeight: 500 }}>₡{Number(pedido.impuesto).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #2c1810', paddingTop: '8px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Total:</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#198754' }}>₡{Number(pedido.total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '16px' }}>
          <button
            onClick={() => handleCambiarEstado(esCompletado ? 'anulado' : 'completado')}
            style={{
              padding: '8px 16px',
              backgroundColor: esCompletado ? '#ffc107' : '#198754',
              color: esCompletado ? '#000' : '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {esCompletado ? 'Anular Pedido (máx 15 min)' : 'Reactivar Pedido'}
          </button>

          <button
            onClick={handleEliminar}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Eliminar Definitivamente
          </button>
        </div>
      </div>
    </div>
  );
}
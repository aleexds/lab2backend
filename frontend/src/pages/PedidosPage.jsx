import { useEffect, useState } from 'react';
import { getPedidos, eliminarPedido, cambiarEstadoPedido } from '../services/api';
import TablaPedidos from '../components/TablaPedidos';

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  // Estados de filtrado
  const [filtroPago, setFiltroPago] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busquedaId, setBusquedaId] = useState('');

  useEffect(() => {
    async function cargarPedidos() {
      try {
        const data = await getPedidos();
        setPedidos(data);
      } catch (err) {
        setMensaje({ tipo: 'error', texto: err.message });
      } finally {
        setLoading(false);
      }
    }

    cargarPedidos();
  }, []);

  async function handleCambiarEstado(id, nuevoEstado) {
    try {
      const actualizado = await cambiarEstadoPedido(id, nuevoEstado);
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: actualizado.estado } : p))
      );
      setMensaje({ tipo: 'success', texto: `Pedido #${id} marcado como "${actualizado.estado}". Stock recalculado.` });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message });
    }
  }

  async function handleEliminar(id) {
    const confirmar = window.confirm(`¿Seguro que deseas eliminar el pedido #${id}? Se devolverán los insumos al inventario.`);
    if (!confirmar) return;

    try {
      await eliminarPedido(id);
      setPedidos((prev) => prev.filter((p) => p.id !== id));
      setMensaje({ tipo: 'success', texto: `Pedido #${id} eliminado definitivamente.` });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message });
    }
  }

  // Filtrado reactivo de pedidos
  const pedidosFiltrados = pedidos.filter((p) => {
    const coincidePago = filtroPago === 'todos' || p.metodo_pago?.toLowerCase() === filtroPago.toLowerCase();
    const coincideEstado = filtroEstado === 'todos' || p.estado?.toLowerCase() === filtroEstado.toLowerCase();
    const coincideId = busquedaId.trim() === '' || String(p.id).includes(busquedaId.trim());
    return coincidePago && coincideEstado && coincideId;
  });

  const pedidosCompletados = pedidosFiltrados.filter((p) => p.estado === 'completado');
  const totalVentas = pedidosCompletados.reduce((acc, p) => acc + Number(p.total), 0);

  if (loading) return <p style={{ padding: '24px' }}>Cargando panel de pedidos...</p>;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#2c1810' }}>Dashboard de Pedidos</h2>
      </div>

      {mensaje && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '20px',
          borderRadius: '6px',
          backgroundColor: mensaje.tipo === 'success' ? '#d4edda' : '#f8d7da',
          color: mensaje.tipo === 'success' ? '#155724' : '#721c24',
          fontWeight: 500
        }}>
          {mensaje.texto}
        </div>
      )}

      {/* Métricas basadas en pedidos completados del filtro */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #e28743', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '0.9rem' }}>Pedidos Visibles</p>
          <h3 style={{ margin: 0, fontSize: '1.6rem', color: '#2c1810' }}>{pedidosFiltrados.length}</h3>
        </div>
        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #198754', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '0.9rem' }}>Ventas Efectivas (Completados)</p>
          <h3 style={{ margin: 0, fontSize: '1.6rem', color: '#198754' }}>₡{totalVentas.toLocaleString()}</h3>
        </div>
      </div>

      {/* Controles de Búsqueda y Filtrado */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center', background: '#fff', padding: '14px', borderRadius: '8px' }}>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <input
            type="number"
            placeholder="🔎 Buscar por ID de orden..."
            value={busquedaId}
            onChange={(e) => setBusquedaId(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#444' }}>Estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="todos">Todos</option>
            <option value="completado">Completados</option>
            <option value="anulado">Anulados</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#444' }}>Método de pago:</label>
          <select
            value={filtroPago}
            onChange={(e) => setFiltroPago(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="todos">Todos</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="sinpe">SINPE Móvil</option>
          </select>
        </div>
      </div>

      <TablaPedidos
        pedidos={pedidosFiltrados}
        onEliminar={handleEliminar}
        onCambiarEstado={handleCambiarEstado}
      />
    </div>
  );
}
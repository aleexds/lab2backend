import { useEffect, useState } from 'react';
import { getPedidos, eliminarPedido, cambiarEstadoPedido } from '../services/api';
import TablaPedidos from '../components/TablaPedidos';

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  // Filtros
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
    const confirmar = window.confirm(`¿Seguro que deseas eliminar definitivamente el pedido #${id}? Se devolverán los insumos.`);
    if (!confirmar) return;

    try {
      await eliminarPedido(id);
      setPedidos((prev) => prev.filter((p) => p.id !== id));
      setMensaje({ tipo: 'success', texto: `Pedido #${id} eliminado correctamente.` });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message });
    }
  }

  const pedidosFiltrados = pedidos.filter((p) => {
    const coincidePago = filtroPago === 'todos' || p.metodo_pago?.toLowerCase() === filtroPago.toLowerCase();
    const coincideEstado = filtroEstado === 'todos' || p.estado?.toLowerCase() === filtroEstado.toLowerCase();
    const coincideId = busquedaId.trim() === '' || String(p.id).includes(busquedaId.trim());
    return coincidePago && coincideEstado && coincideId;
  });

  const pedidosCompletados = pedidosFiltrados.filter((p) => p.estado === 'completado');
  const totalVentas = pedidosCompletados.reduce((acc, p) => acc + Number(p.total), 0);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px', color: '#7a6a60' }}>
        <p style={{ fontSize: '1.1rem' }}>Cargando panel de pedidos...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', background: '#f8f6f2', padding: '36px 24px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2c1810', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
              Dashboard de Pedidos
            </h2>
            <p style={{ margin: 0, color: '#7a6a60', fontSize: '0.92rem' }}>
              Historial de órdenes, control de estados y auditoría de ventas
            </p>
          </div>
        </div>

        {mensaje && (
          <div style={{
            padding: '14px 18px',
            marginBottom: '24px',
            borderRadius: '8px',
            backgroundColor: mensaje.tipo === 'success' ? '#e6f4ea' : '#fce8e6',
            color: mensaje.tipo === 'success' ? '#137333' : '#c5221f',
            border: `1px solid ${mensaje.tipo === 'success' ? '#b7e1cd' : '#fad2cf'}`,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>{mensaje.tipo === 'success' ? '✓' : '⚠️'}</span>
            <span>{mensaje.texto}</span>
          </div>
        )}

        {/* KPIs Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div style={{
            background: '#ffffff',
            padding: '22px 24px',
            borderRadius: '12px',
            border: '1px solid #e8e2dc',
            borderLeft: '5px solid #b8621b',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <p style={{ margin: '0 0 6px 0', color: '#7a6a60', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pedidos Visibles
            </p>
            <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#2c1810' }}>
              {pedidosFiltrados.length}
            </h3>
          </div>

          <div style={{
            background: '#ffffff',
            padding: '22px 24px',
            borderRadius: '12px',
            border: '1px solid #e8e2dc',
            borderLeft: '5px solid #137333',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <p style={{ margin: '0 0 6px 0', color: '#7a6a60', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Ventas Efectivas (Completados)
            </p>
            <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#137333' }}>
              ₡{totalVentas.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Filtros y Buscador */}
        <div style={{
          background: '#ffffff',
          padding: '16px 20px',
          borderRadius: '12px',
          border: '1px solid #e8e2dc',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          marginBottom: '20px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <input
              type="number"
              placeholder="🔍 Buscar por ID de orden..."
              value={busquedaId}
              onChange={(e) => setBusquedaId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #d8cfc6',
                outline: 'none',
                fontSize: '0.92rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#554841' }}>Estado:</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #d8cfc6',
                background: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              <option value="todos">Todos</option>
              <option value="completado">Completados</option>
              <option value="anulado">Anulados</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#554841' }}>Método de pago:</label>
            <select
              value={filtroPago}
              onChange={(e) => setFiltroPago(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #d8cfc6',
                background: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              <option value="todos">Todos</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="sinpe">SINPE Móvil</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <TablaPedidos
          pedidos={pedidosFiltrados}
          onEliminar={handleEliminar}
          onCambiarEstado={handleCambiarEstado}
        />
      </div>
    </div>
  );
}
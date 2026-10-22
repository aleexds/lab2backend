import { useEffect, useState } from 'react';
import { getPedidos, eliminarPedido } from '../services/api';
import TablaPedidos from '../components/TablaPedidos';

export default function PedidosPage() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState(null);

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

    async function handleEliminar(id) {
        const confirmar = window.confirm(`¿Seguro que deseas eliminar el pedido #${id}? Se devolverán los insumos al inventario.`);
        if (!confirmar) return;

        try {
            await eliminarPedido(id);
            setPedidos((prev) => prev.filter((p) => p.id !== id));
            setMensaje({ tipo: 'success', texto: `Pedido #${id} eliminado y stock restituido correctamente.` });
        } catch (err) {
            setMensaje({ tipo: 'error', texto: err.message });
        }
    }

    const totalVentas = pedidos.reduce((acc, p) => acc + Number(p.total), 0);

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

            {/* Tarjetas resumen tipo Dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #e28743', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '0.9rem' }}>Total de Pedidos</p>
                    <h3 style={{ margin: 0, fontSize: '1.6rem', color: '#2c1810' }}>{pedidos.length}</h3>
                </div>
                <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #198754', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '0.9rem' }}>Ingresos Registrados</p>
                    <h3 style={{ margin: 0, fontSize: '1.6rem', color: '#198754' }}>₡{totalVentas.toLocaleString()}</h3>
                </div>
            </div>

            <TablaPedidos pedidos={pedidos} onEliminar={handleEliminar} />
        </div>
    );
}
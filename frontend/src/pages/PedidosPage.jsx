import { useEffect, useState } from 'react';
import { getPedidos } from '../services/api';
import TablaPedidos from '../components/TablaPedidos';

export default function PedidosPage() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function cargarPedidos() {
        try {
            const data = await getPedidos();
            setPedidos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

        cargarPedidos();
    }, []);

    if (loading) return <p style={{ padding: '24px' }}>Cargando historial de pedidos...</p>;
    if (error) return <p style={{ padding: '24px', color: 'red' }}>Error: {error}</p>;

    return (
        <div style={{ padding: '24px' }}>
            <h2>Historial de Pedidos</h2>
            <TablaPedidos pedidos={pedidos} />
        </div>
    );
}
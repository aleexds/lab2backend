import { useEffect, useState } from 'react';
import { getInsumos, reabastecerInsumo } from '../services/api';
import TablaInsumos from '../components/TablaInsumos';

export default function InventarioPage() {
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState(null);

    useEffect(() => {
        async function cargarInsumos() {
            try {
                const data = await getInsumos();
                setInsumos(data);
            } catch (err) {
                setMensaje({ tipo: 'error', texto: err.message });
            } finally {
                setLoading(false);
            }
        }

        cargarInsumos();
    }, []);

    async function handleReabastecer(id, cantidad) {
        try {
            const actualizado = await reabastecerInsumo(id, cantidad);
            setInsumos((prev) =>
            prev.map((item) => (item.id === id ? { ...item, stock: actualizado.stock } : item))
            );
            setMensaje({ tipo: 'success', texto: `Insumo "${actualizado.nombre}" reabastecido con éxito.` });
        } catch (err) {
            setMensaje({ tipo: 'error', texto: err.message });
        }
    }

    if (loading) return <p style={{ padding: '24px' }}>Cargando inventario de insumos...</p>;

    return (
        <div style={{ padding: '24px' }}>
            <h2>Control de Inventario de Insumos</h2>

            {mensaje && (
                <div style={{
                    padding: '12px',
                    marginBottom: '16px',
                    borderRadius: '6px',
                    backgroundColor: mensaje.tipo === 'success' ? '#d4edda' : '#f8d7da',
                    color: mensaje.tipo === 'success' ? '#155724' : '#721c24'
                }}>
                    {mensaje.texto}
                </div>
            )}

            <TablaInsumos insumos={insumos} onReabastecer={handleReabastecer} />
        </div>
    );
}
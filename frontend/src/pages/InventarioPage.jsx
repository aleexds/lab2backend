import { useEffect, useState } from 'react';
import { getInsumos, reabastecerInsumo, crearInsumo, actualizarInsumo, eliminarInsumo } from '../services/api';
import TablaInsumos from '../components/TablaInsumos';
import InsumoFormModal from '../components/InsumoFormModal';

export default function InventarioPage() {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [insumoEdicion, setInsumoEdicion] = useState(null);
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

  async function handleGuardar(datos) {
    try {
      if (insumoEdicion) {
        const actualizado = await actualizarInsumo(insumoEdicion.id, datos);
        setInsumos((prev) =>
          prev.map((item) => (item.id === insumoEdicion.id ? actualizado : item))
        );
        setMensaje({ tipo: 'success', texto: `Insumo "${actualizado.nombre}" actualizado con éxito.` });
      } else {
        const nuevo = await crearInsumo(datos);
        setInsumos((prev) => [...prev, nuevo]);
        setMensaje({ tipo: 'success', texto: `Insumo "${nuevo.nombre}" creado exitosamente.` });
      }
      setModalAbierto(false);
      setInsumoEdicion(null);
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message });
    }
  }

  async function handleEliminar(id, nombre) {
    if (!window.confirm(`¿Estás seguro de eliminar el insumo "${nombre}"?`)) return;
    try {
      await eliminarInsumo(id);
      setInsumos((prev) => prev.filter((item) => item.id !== id));
      setMensaje({ tipo: 'success', texto: `Insumo "${nombre}" eliminado correctamente.` });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message });
    }
  }

  if (loading) return <p style={{ padding: '24px' }}>Cargando inventario de insumos...</p>;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#2c1810' }}>Control de Inventario de Insumos</h2>
        <button
          onClick={() => {
            setInsumoEdicion(null);
            setModalAbierto(true);
          }}
          style={{
            background: '#2c1810',
            color: '#fff',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          + Nuevo Insumo
        </button>
      </div>

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

      <TablaInsumos
        insumos={insumos}
        onReabastecer={handleReabastecer}
        onEditar={(insumo) => {
          setInsumoEdicion(insumo);
          setModalAbierto(true);
        }}
        onEliminar={handleEliminar}
      />

      {modalAbierto && (
        <InsumoFormModal
          insumo={insumoEdicion}
          onGuardar={handleGuardar}
          onCerrar={() => {
            setModalAbierto(false);
            setInsumoEdicion(null);
          }}
        />
      )}
    </div>
  );
}
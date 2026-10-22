import { useEffect, useState } from 'react';
import { getInsumos, reabastecerInsumo, crearInsumo, actualizarInsumo, eliminarInsumo, getDatosParaIA, solicitarSugerenciaCompras } from '../services/api';
import TablaInsumos from '../components/TablaInsumos';
import InsumoFormModal from '../components/InsumoFormModal';

export default function InventarioPage() {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [insumoEdicion, setInsumoEdicion] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  // Estados para el agente de IA en n8n
  const [cargandoIA, setCargandoIA] = useState(false);
  const [informeIA, setInformeIA] = useState(null);

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

  async function handleConsultarIA() {
    setCargandoIA(true);
    setInformeIA(null);
    try {
      // 1. Obtener datos analíticos desde Express
      const datosContexto = await getDatosParaIA();
      
      // 2. Enviar datos al webhook de n8n
      const respuesta = await solicitarSugerenciaCompras(datosContexto);
      setInformeIA(respuesta.informe);
    } catch (err) {
      setMensaje({ tipo: 'error', texto: `Error con el Asistente de IA: ${err.message}` });
    } finally {
      setCargandoIA(false);
    }
  }

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ margin: 0, color: '#2c1810' }}>Control de Inventario de Insumos</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleConsultarIA}
            disabled={cargandoIA}
            style={{
              background: '#0d6efd',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '4px',
              cursor: cargandoIA ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {cargandoIA ? '⏳ Analizando con IA...' : '✨ Sugerencia de Compra (IA)'}
          </button>
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

      {/* Caja de Informe generado por el Agente de n8n */}
      {informeIA && (
        <div style={{
          background: '#f0f7ff',
          border: '1px solid #b6d4fe',
          borderRadius: '8px',
          padding: '18px',
          marginBottom: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, color: '#084298', fontSize: '1.1rem' }}>🤖 Recomendación del Agente de Abastecimiento</h3>
            <button
              onClick={() => setInformeIA(null)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#666' }}
            >
              ✕
            </button>
          </div>
          <div style={{ whiteSpace: 'pre-line', color: '#333', lineHeight: '1.6', fontSize: '0.95rem' }}>
            {informeIA}
          </div>
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
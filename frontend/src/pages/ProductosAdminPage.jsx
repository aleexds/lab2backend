import { useEffect, useState } from 'react';
import { getProductos, getInsumos, crearProducto, actualizarProducto, eliminarProducto } from '../services/api';
import ProductoFormModal from '../components/ProductoFormModal';

export default function ProductosAdminPage() {
  const [productos, setProductos] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEdicion, setProductoEdicion] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const [prods, ins] = await Promise.all([getProductos(), getInsumos()]);
      setProductos(prods);
      setInsumos(ins);
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message });
    }
  }

  async function handleGuardar(datos) {
    try {
      if (productoEdicion) {
        await actualizarProducto(productoEdicion.id, datos);
        setMensaje({ tipo: 'success', texto: `Producto "${datos.nombre}" actualizado correctamente.` });
      } else {
        await crearProducto(datos);
        setMensaje({ tipo: 'success', texto: `Producto "${datos.nombre}" creado exitosamente.` });
      }
      setModalAbierto(false);
      setProductoEdicion(null);
      await cargarDatos();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message });
    }
  }

  async function handleEliminar(id, nombre) {
    if (!window.confirm(`¿Estás seguro de eliminar "${nombre}"?`)) return;
    try {
      await eliminarProducto(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      setMensaje({ tipo: 'success', texto: `Producto "${nombre}" eliminado.` });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message });
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Gestión de Catálogo de Productos</h2>
        <button
          onClick={() => {
            setProductoEdicion(null);
            setModalAbierto(true);
          }}
          style={{ background: '#2c1810', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
        >
          + Nuevo Producto
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

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>Nombre</th>
            <th style={{ padding: '12px' }}>Categoría</th>
            <th style={{ padding: '12px' }}>Precio</th>
            <th style={{ padding: '12px' }}>Receta</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>#{p.id}</td>
              <td style={{ padding: '12px', fontWeight: 600 }}>{p.nombre}</td>
              <td style={{ padding: '12px' }}>{p.categoria}</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>₡{Number(p.precio).toLocaleString()}</td>
              <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                {p.ingredientes && p.ingredientes.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '16px' }}>
                    {p.ingredientes.map((ing, idx) => (
                      <li key={idx}>{ing.nombre_insumo}: {ing.cantidad} {ing.unidad}</li>
                    ))}
                  </ul>
                ) : (
                  <span style={{ color: '#888' }}>Sin receta configurada</span>
                )}
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button
                  onClick={() => {
                    setProductoEdicion(p);
                    setModalAbierto(true);
                  }}
                  style={{ marginRight: '8px', padding: '6px 12px', background: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(p.id, p.nombre)}
                  style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalAbierto && (
        <ProductoFormModal
          producto={productoEdicion}
          insumos={insumos}
          onGuardar={handleGuardar}
          onCerrar={() => {
            setModalAbierto(false);
            setProductoEdicion(null);
          }}
        />
      )}
    </div>
  );
}
import { useEffect, useState } from 'react';
import { getProductos, crearPedido } from '../services/api';
import ProductoCard from '../components/ProductoCard';
import CarritoPedido from '../components/CarritoPedido';

export default function MenuPage() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  // Estados de búsqueda y filtrado
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');

  useEffect(() => {
    async function cargarProductos() {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (err) {
        setMensaje({ tipo: 'error', texto: err.message });
      } finally {
        setLoading(false);
      }
    }

    cargarProductos();
  }, []);

  function agregarAlCarrito(producto) {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.producto_id === producto.id);
      if (existente) {
        return prev.map((item) =>
          item.producto_id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { producto_id: producto.id, nombre: producto.nombre, precio: Number(producto.precio), cantidad: 1 }];
    });
  }

  function cambiarCantidad(id, delta) {
    setCarrito((prev) =>
      prev
        .map((item) => (item.producto_id === id ? { ...item, cantidad: item.cantidad + delta } : item))
        .filter((item) => item.cantidad > 0)
    );
  }

  async function handleEnviarPedido() {
    if (carrito.length === 0) return;
    try {
      await crearPedido({
        metodo_pago: metodoPago,
        items: carrito.map(({ producto_id, cantidad }) => ({ producto_id, cantidad }))
      });
      setMensaje({ tipo: 'success', texto: '¡Pedido registrado y stock descontado con éxito!' });
      setCarrito([]);
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message });
    }
  }

  // Extraer categorías únicas para los botones de filtro
  const categorias = ['todas', ...new Set(productos.map((p) => p.categoria).filter(Boolean))];

  // Productos filtrados según búsqueda y categoría
  const productosFiltrados = productos.filter((prod) => {
    const coincideTexto = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaSeleccionada === 'todas' ||
      prod.categoria?.toLowerCase() === categoriaSeleccionada.toLowerCase();
    return coincideTexto && coincideCategoria;
  });

  if (loading) return <p style={{ padding: '24px' }}>Cargando catálogo de productos...</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      <div>
        <h2 style={{ color: '#2c1810', marginTop: 0 }}>Menú de Productos</h2>

        {/* Barra de Búsqueda y Filtros de Categoría */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar producto por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '0.95rem'
            }}
          />

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaSeleccionada(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid #2c1810',
                  background: categoriaSeleccionada === cat ? '#2c1810' : '#fff',
                  color: categoriaSeleccionada === cat ? '#fff' : '#2c1810',
                  cursor: 'pointer',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  fontSize: '0.85rem'
                }}
              >
                {cat}
              </button>
            ))}
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

        {productosFiltrados.length === 0 ? (
          <p style={{ color: '#777', marginTop: '20px' }}>No se encontraron productos con ese criterio.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {productosFiltrados.map((prod) => (
              <ProductoCard key={prod.id} producto={prod} onAgregar={agregarAlCarrito} />
            ))}
          </div>
        )}
      </div>

      <CarritoPedido
        carrito={carrito}
        metodoPago={metodoPago}
        setMetodoPago={setMetodoPago}
        onCambiarCantidad={cambiarCantidad}
        onConfirmarPedido={handleEnviarPedido}
      />
    </div>
  );
}
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

    if (loading) return <p style={{ padding: '24px' }}>Cargando catálogo de productos...</p>;

    return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', padding: '24px' }}>
        <div>
            <h2>Menú de Productos</h2>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {productos.map((prod) => (
                    <ProductoCard key={prod.id} producto={prod} onAgregar={agregarAlCarrito} />
                ))}
            </div>
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
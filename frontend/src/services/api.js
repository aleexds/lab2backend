const API_URL = 'http://localhost:5000/api';

// Obtener catálogo de productos
export async function getProductos() {
    const res = await fetch(`${API_URL}/productos`);
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Error al obtener productos');
    return data.data;
}

// Obtener historial de pedidos
export async function getPedidos() {
    const res = await fetch(`${API_URL}/pedidos`);
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Error al obtener pedidos');
    return data.data;
}

// Crear un nuevo pedido
export async function crearPedido(pedido) {
    const res = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Error al registrar pedido');
    return data.data;
}
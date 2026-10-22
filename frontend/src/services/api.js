const API_URL = 'http://localhost:5000/api';

// --- PRODUCTOS ---
export async function getProductos() {
  const res = await fetch(`${API_URL}/productos`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Error al obtener productos');
  return data.data;
}

export async function crearProducto(producto) {
  const res = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Error al crear producto');
  return data.data;
}

export async function actualizarProducto(id, producto) {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Error al actualizar producto');
  return data.data;
}

export async function eliminarProducto(id) {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Error al eliminar producto');
  return data;
}

// --- PEDIDOS ---
export async function getPedidos() {
  const res = await fetch(`${API_URL}/pedidos`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Error al obtener pedidos');
  return data.data;
}

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

export async function eliminarPedido(id) {
  const res = await fetch(`${API_URL}/pedidos/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Error al eliminar pedido');
  return data;
}

// --- INSUMOS ---
export async function getInsumos() {
  const res = await fetch(`${API_URL}/insumos`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Error al obtener insumos');
  return data.data;
}

export async function reabastecerInsumo(id, cantidad) {
  const res = await fetch(`${API_URL}/insumos/${id}/reabastecer`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cantidad })
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Error al reabastecer insumo');
  return data.data;
}

export async function crearInsumo(insumo) {
  const res = await fetch(`${API_URL}/insumos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(insumo)
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Error al crear insumo');
  return data.data;
}

export async function actualizarInsumo(id, insumo) {
  const res = await fetch(`${API_URL}/insumos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(insumo)
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Error al actualizar insumo');
  return data.data;
}

export async function eliminarInsumo(id) {
  const res = await fetch(`${API_URL}/insumos/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Error al eliminar insumo');
  return data;
}

export async function cambiarEstadoPedido(id, estado) {
  const res = await fetch(`${API_URL}/pedidos/${id}/estado`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado })
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Error al cambiar estado');
  return data.data;
}

export async function getResumen() {
  const res = await fetch(`${API_URL}/resumen`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Error al obtener resumen');
  return data.data;
}
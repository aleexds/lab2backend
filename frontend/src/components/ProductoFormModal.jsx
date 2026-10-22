import { useState } from 'react';

export default function ProductoFormModal({ producto, insumos, onGuardar, onCerrar }) {
  const [nombre, setNombre] = useState(producto?.nombre || '');
  const [precio, setPrecio] = useState(producto?.precio || '');
  const [categoria, setCategoria] = useState(producto?.categoria || '');
  const [receta, setReceta] = useState(
    producto?.ingredientes?.map((i) => ({
      insumo_id: i.insumo_id,
      cantidad: i.cantidad
    })) || []
  );

  function handleAgregarInsumo() {
    if (insumos.length === 0) return;
    setReceta((prev) => [...prev, { insumo_id: insumos[0].id, cantidad: 1 }]);
  }

  function handleRecetaChange(index, field, value) {
    setReceta((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  function handleEliminarFila(index) {
    setReceta((prev) => prev.filter((_, idx) => idx !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onGuardar({
      nombre,
      precio: Number(precio),
      categoria: categoria || 'General',
      ingredientes: receta.map((r) => ({
        insumo_id: Number(r.insumo_id),
        cantidad: Number(r.cantidad)
      }))
    });
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        padding: '24px',
        borderRadius: '8px',
        width: '520px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ marginTop: 0 }}>{producto ? 'Editar Producto' : 'Nuevo Producto'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Nombre</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Precio (₡)</label>
              <input
                type="number"
                required
                min="1"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Categoría</label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Ej: Cafetería, Bebidas"
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontWeight: 600 }}>Receta (Insumos requeridos):</label>
              <button
                type="button"
                onClick={handleAgregarInsumo}
                style={{ background: '#e28743', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
              >
                + Insumo
              </button>
            </div>

            {receta.map((row, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                <select
                  value={row.insumo_id}
                  onChange={(e) => handleRecetaChange(idx, 'insumo_id', e.target.value)}
                  style={{ flex: 2, padding: '6px' }}
                >
                  {insumos.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.nombre} ({i.unidad})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={row.cantidad}
                  placeholder="Cant"
                  onChange={(e) => handleRecetaChange(idx, 'cantidad', e.target.value)}
                  style={{ flex: 1, padding: '6px' }}
                />
                <button
                  type="button"
                  onClick={() => handleEliminarFila(idx)}
                  style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={onCerrar}
              style={{ padding: '8px 16px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{ padding: '8px 16px', background: '#2c1810', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
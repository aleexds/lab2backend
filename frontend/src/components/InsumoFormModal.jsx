import { useState } from 'react';

export default function InsumoFormModal({ insumo, onGuardar, onCerrar }) {
  const [nombre, setNombre] = useState(insumo?.nombre || '');
  const [unidad, setUnidad] = useState(insumo?.unidad || 'g');
  const [stock, setStock] = useState(insumo ? insumo.stock : '');
  const [stockMinimo, setStockMinimo] = useState(insumo ? insumo.stock_minimo : '');

  function handleSubmit(e) {
    e.preventDefault();
    onGuardar({
      nombre,
      unidad,
      stock: Number(stock) || 0,
      stock_minimo: Number(stockMinimo) || 0
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
        width: '420px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <h3 style={{ marginTop: 0 }}>{insumo ? 'Editar Insumo' : 'Nuevo Insumo'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Nombre</label>
            <input
              type="text"
              required
              placeholder="Ej: Leche deslactosada, Azúcar"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Unidad de Medida</label>
            <select
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            >
              <option value="g">Gramos (g)</option>
              <option value="ml">Mililitros (ml)</option>
              <option value="unidad">Unidades (unidad)</option>
              <option value="bolsa">Bolsas (bolsa)</option>
              <option value="kg">Kilogramos (kg)</option>
              <option value="l">Litros (l)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Stock Actual</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Stock Mínimo</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={stockMinimo}
                onChange={(e) => setStockMinimo(e.target.value)}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
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
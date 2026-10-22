import { useState } from 'react';

export default function TablaInsumos({ insumos, onReabastecer, onEditar, onEliminar }) {
  const [cantidades, setCantidades] = useState({});

  function handleInputChange(id, val) {
    setCantidades((prev) => ({ ...prev, [id]: val }));
  }

  function handleReabastecer(id) {
    const cant = cantidades[id];
    if (!cant || isNaN(cant) || Number(cant) <= 0) return;
    onReabastecer(id, Number(cant));
    setCantidades((prev) => ({ ...prev, [id]: '' }));
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
      <thead>
        <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
          <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>ID</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Insumo</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Unidad</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Stock Actual</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Mínimo</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Estado</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Reabastecer</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'center' }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {insumos.map((item) => {
          const bajoStock = Number(item.stock) <= Number(item.stock_minimo);
          return (
            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>#{item.id}</td>
              <td style={{ padding: '12px', fontWeight: 600 }}>{item.nombre}</td>
              <td style={{ padding: '12px', color: '#666' }}>{item.unidad}</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>
                {Number(item.stock).toLocaleString()}
              </td>
              <td style={{ padding: '12px', color: '#666' }}>
                {Number(item.stock_minimo).toLocaleString()}
              </td>
              <td style={{ padding: '12px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  background: bajoStock ? '#f8d7da' : '#d4edda',
                  color: bajoStock ? '#721c24' : '#155724',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}>
                  {bajoStock ? 'Stock Bajo' : 'Óptimo'}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    min="1"
                    placeholder="Cant."
                    value={cantidades[item.id] || ''}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                  <button
                    onClick={() => handleReabastecer(item.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#2c1810',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    + Agregar
                  </button>
                </div>
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button
                  onClick={() => onEditar(item)}
                  style={{ marginRight: '8px', padding: '6px 12px', background: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Editar
                </button>
                <button
                  onClick={() => onEliminar(item.id, item.nombre)}
                  style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
import { Link } from 'react-router-dom';

export default function TablaPedidos({ pedidos, onEliminar, onCambiarEstado }) {
  if (pedidos.length === 0) {
    return (
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '48px 24px',
        textAlign: 'center',
        color: '#8c7e77',
        border: '1px solid #e8e2dc',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '10px' }}>🧾</span>
        <h4 style={{ margin: '0 0 6px 0', color: '#3c2415' }}>No se encontraron órdenes</h4>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>Intenta ajustando los filtros de estado o método de pago.</p>
      </div>
    );
  }

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e8e2dc',
      boxShadow: '0 4px 16px rgba(44, 24, 16, 0.05)',
      overflow: 'hidden'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
        <thead>
          <tr style={{ background: '#fbf9f6', borderBottom: '2px solid #eee8e2' }}>
            <th style={{ padding: '14px 18px', color: '#7a6a60', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</th>
            <th style={{ padding: '14px 18px', color: '#7a6a60', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fecha y Hora</th>
            <th style={{ padding: '14px 18px', color: '#7a6a60', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pago</th>
            <th style={{ padding: '14px 18px', color: '#7a6a60', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</th>
            <th style={{ padding: '14px 18px', color: '#7a6a60', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado</th>
            <th style={{ padding: '14px 18px', color: '#7a6a60', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Detalle</th>
            <th style={{ padding: '14px 18px', color: '#7a6a60', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p, index) => {
            const esCompletado = p.estado === 'completado';
            const estadoBg = esCompletado ? '#e6f4ea' : '#fce8e6';
            const estadoColor = esCompletado ? '#137333' : '#c5221f';
            const filaBg = index % 2 === 0 ? '#ffffff' : '#fdfcfb';

            const btnEstadoBg = esCompletado ? '#fff5e6' : '#eaf6ec';
            const btnEstadoColor = esCompletado ? '#b36b00' : '#1b7f3b';
            const btnEstadoBorder = esCompletado ? '1px solid #fcdba6' : '1px solid #aee2ba';

            return (
              <tr
                key={p.id}
                style={{
                  borderBottom: '1px solid #f2ede7',
                  backgroundColor: filaBg
                }}
              >
                <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                  <Link
                    to={'/pedidos/' + p.id}
                    style={{
                      color: '#b8621b',
                      textDecoration: 'none',
                      background: '#faeee5',
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}
                  >
                    #{p.id}
                  </Link>
                </td>

                <td style={{ padding: '14px 18px', color: '#554841', fontSize: '0.86rem' }}>
                  {new Date(p.fecha).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </td>

                <td style={{ padding: '14px 18px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: '#f0f3f6',
                    color: '#344054',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em'
                  }}>
                    {p.metodo_pago}
                  </span>
                </td>

                <td style={{ padding: '14px 18px', fontWeight: 700, color: '#2c1810', fontSize: '1rem' }}>
                  ₡{Number(p.total).toLocaleString()}
                </td>

                <td style={{ padding: '14px 18px' }}>
                  <span style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: estadoBg,
                    color: estadoColor
                  }}>
                    <span style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: estadoColor
                    }}></span>
                    {esCompletado ? 'Completado' : 'Anulado'}
                  </span>
                </td>

                <td style={{ padding: '14px 18px' }}>
                  {p.items && p.items.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {p.items.map((item, idx) => (
                        <div key={idx} style={{ fontSize: '0.84rem', color: '#443833' }}>
                          <span style={{ color: '#887b74' }}>•</span> {item.producto}{' '}
                          <span style={{ fontWeight: 700, color: '#b8621b' }}>x{item.cantidad}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#aaa', fontStyle: 'italic', fontSize: '0.82rem' }}>Sin items</span>
                  )}
                </td>

                <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    <Link
                      to={'/pedidos/' + p.id}
                      style={{
                        padding: '6px 12px',
                        background: '#f4ece6',
                        color: '#4a2c1d',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}
                    >
                      Ver
                    </Link>

                    <button
                      type="button"
                      onClick={() => onCambiarEstado(p.id, esCompletado ? 'anulado' : 'completado')}
                      style={{
                        padding: '6px 12px',
                        background: btnEstadoBg,
                        color: btnEstadoColor,
                        border: btnEstadoBorder,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}
                    >
                      {esCompletado ? 'Anular' : 'Reactivar'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onEliminar(p.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#fdf2f2',
                        color: '#cf222e',
                        border: '1px solid #f8c3c7',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
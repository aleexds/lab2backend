export default function TablaPedidos({ pedidos, onEliminar }) {
    if (pedidos.length === 0) {
        return <p style={{ color: '#666' }}>No hay pedidos registrados aún.</p>;
    }

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead>
            <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>ID</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Fecha</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Pago</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Total</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Estado</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Detalle</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'center' }}>Acciones</th>
            </tr>
            </thead>
            <tbody>
        {pedidos.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '12px', fontWeight: 'bold' }}>#{p.id}</td>
            <td style={{ padding: '12px', color: '#555' }}>{new Date(p.fecha).toLocaleString()}</td>
            <td style={{ padding: '12px' }}>
                <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600, color: '#444' }}>
                    {p.metodo_pago}
                </span>
            </td>
            <td style={{ padding: '12px', fontWeight: 'bold', color: '#2c1810' }}>
                ₡{Number(p.total).toLocaleString()}
            </td>
            <td style={{ padding: '12px' }}>
                <span style={{
                padding: '4px 10px',
                borderRadius: '12px',
                background: p.estado === 'completado' ? '#d4edda' : '#fff3cd',
                color: p.estado === 'completado' ? '#155724' : '#856404',
                fontSize: '0.8rem',
                fontWeight: 600
                }}>
                {p.estado}
                </span>
            </td>
            <td style={{ padding: '12px' }}>
                {p.items && p.items.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.9rem', color: '#333' }}>
                    {p.items.map((item, idx) => (
                    <li key={idx}>{item.producto} x{item.cantidad}</li>
                    ))}
                </ul>
                ) : (
                    'Sin items'
                )}
            </td>
            <td style={{ padding: '12px', textAlign: 'center' }}>
                <button
                onClick={() => onEliminar(p.id)}
                style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    transition: 'background 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#b02a37')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#dc3545')}
                >
                Eliminar
                </button>
            </td>
            </tr>
        ))}
    </tbody>
    </table>
    );
}
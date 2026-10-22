export default function TablaPedidos({ pedidos }) {
    if (pedidos.length === 0) {
        return <p>No hay pedidos registrados aún.</p>;
    }

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
        <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>ID</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Fecha</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Pago</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Total</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Estado</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Detalle</th>
        </tr>
        </thead>
        <tbody>
        {pedidos.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>#{p.id}</td>
                <td style={{ padding: '10px' }}>{new Date(p.fecha).toLocaleString()}</td>
                <td style={{ padding: '10px' }}>{p.metodo_pago}</td>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>
                    ₡{Number(p.total).toLocaleString()}
            </td>
            <td style={{ padding: '10px' }}>
                <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    background: p.estado === 'pendiente' ? '#fff3cd' : '#d4edda',
                    color: p.estado === 'pendiente' ? '#856404' : '#155724',
                    fontSize: '0.85rem'
                }}>
                    {p.estado}
                </span>
            </td>
            <td style={{ padding: '10px' }}>
                {p.items && p.items.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: '16px' }}>
                    {p.items.map((item, idx) => (
                    <li key={idx}>{item.producto} x{item.cantidad}</li>
                    ))}
                </ul>
                ) : (
                    'Sin items'
                )}
            </td>
            </tr>
        ))}
        </tbody>
    </table>
    );
}
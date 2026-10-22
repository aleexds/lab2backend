export default function ProductoCard({ producto, onAgregar }) {
    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            background: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{producto.nombre}</h3>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '0.9rem' }}>
                    Categoría: {producto.categoria}
                </p>
            </div>
            <div>
                <p style={{ margin: '8px 0 12px 0', fontWeight: 'bold' }}>
                    ₡{Number(producto.precio).toLocaleString()}
                </p>
                <button
                    onClick={() => onAgregar(producto)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: '#e28743',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}
                >
                    Agregar
                </button>
            </div>
        </div>
  );
}
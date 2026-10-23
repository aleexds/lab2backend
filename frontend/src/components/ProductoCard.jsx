export default function ProductoCard({ producto, onAgregar }) {
  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
      padding: '18px',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'var(--transition)',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      e.currentTarget.style.borderColor = 'var(--accent)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      e.currentTarget.style.borderColor = 'var(--border)';
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
            {producto.categoria || 'Cafetería'}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>#{producto.id}</span>
        </div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: '4px 0 12px 0' }}>
          {producto.nombre}
        </h3>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed var(--border)' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Precio</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
            ₡{Number(producto.precio).toLocaleString()}
          </span>
        </div>
        <button
          onClick={() => onAgregar(producto)}
          className="btn btn-accent btn-sm"
          style={{ borderRadius: '20px', padding: '6px 14px' }}
        >
          + Agregar
        </button>
      </div>
    </div>
  );
}
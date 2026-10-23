export default function CarritoPedido({ carrito, metodoPago, setMetodoPago, onCambiarCantidad, onConfirmarPedido }) {
  const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const impuesto = Math.round(subtotal * 0.13);
  const total = subtotal + impuesto;

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      padding: '24px',
      boxShadow: 'var(--shadow-md)',
      position: 'sticky',
      top: '90px',
      height: 'fit-content'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', fontWeight: 700 }}>Resumen del Pedido</h3>
        <span className="badge badge-warning" style={{ fontSize: '0.78rem' }}>
          {carrito.reduce((acc, i) => acc + i.cantidad, 0)} items
        </span>
      </div>

      {carrito.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '2.4rem', display: 'block', marginBottom: '8px' }}>🛒</span>
          <p style={{ fontSize: '0.92rem' }}>El pedido está vacío</p>
          <small style={{ color: '#a09893' }}>Selecciona productos del menú para comenzar</small>
        </div>
      ) : (
        <>
          <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {carrito.map((item) => (
              <div key={item.producto_id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                background: 'var(--surface-alt)',
                borderRadius: 'var(--radius-sm)'
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.nombre}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    ₡{item.precio.toLocaleString()} c/u
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => onCambiarCantidad(item.producto_id, -1)}
                    className="btn btn-outline btn-sm"
                    style={{ width: '26px', height: '26px', padding: 0, borderRadius: '50%' }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: '18px', textAlign: 'center' }}>
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => onCambiarCantidad(item.producto_id, 1)}
                    className="btn btn-outline btn-sm"
                    style={{ width: '26px', height: '26px', padding: 0, borderRadius: '50%' }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Método de Pago
            </label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="input-control"
              style={{ width: '100%' }}
            >
              <option value="efectivo">💵 Efectivo</option>
              <option value="tarjeta">💳 Tarjeta de Débito / Crédito</option>
              <option value="sinpe">📱 SINPE Móvil</option>
            </select>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span>₡{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <span>IVA (13%)</span>
              <span>₡{impuesto.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>
              <span>Total</span>
              <span>₡{total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={onConfirmarPedido}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '1rem', borderRadius: 'var(--radius-sm)' }}
          >
            Confirmar Pedido
          </button>
        </>
      )}
    </div>
  );
}
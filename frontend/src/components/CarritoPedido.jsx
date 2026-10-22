export default function CarritoPedido({
    carrito,
    metodoPago,
    setMetodoPago,
    onCambiarCantidad,
    onConfirmarPedido
}) {
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            height: 'fit-content',
            background: '#fff'
        }}>
            <h2 style={{ marginTop: 0 }}>Resumen del Pedido</h2>

            {carrito.length === 0 ? (
                <p style={{ color: '#888' }}>El pedido está vacío.</p>
            ) : (
                <div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0' }}>
                        {carrito.map((item) => (
                            <li
                                key={item.producto_id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '10px'
                                }}
                            >
                                <span>{item.nombre} x{item.cantidad}</span>
                                <div>
                                    <button
                                        onClick={() => onCambiarCantidad(item.producto_id, -1)}
                                        style={{ marginRight: '4px', padding: '2px 8px', cursor: 'pointer' }}
                                    >
                                        -
                                    </button>
                                    <button
                                        onClick={() => onCambiarCantidad(item.producto_id, 1)}
                                        style={{ marginRight: '8px', padding: '2px 8px', cursor: 'pointer' }}
                                    >
                                        +
                                    </button>
                                    <span>₡{(item.precio * item.cantidad).toLocaleString()}</span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
                            Método de pago:
                        </label>
                        <select
                            value={metodoPago}
                            onChange={(e) => setMetodoPago(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="sinpe">SINPE Móvil</option>
                        </select>
                    </div>

                    <h3 style={{ borderTop: '1px solid #eee', paddingTop: '12px', marginBottom: '16px' }}>
                        Total: ₡{total.toLocaleString()}
                    </h3>

                    <button
                        onClick={onConfirmarPedido}
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#2c1810',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Confirmar Pedido
                    </button>
                </div>
            )}
        </div>
    );
}
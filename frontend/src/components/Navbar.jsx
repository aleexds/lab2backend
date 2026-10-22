import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      gap: '24px',
      padding: '16px 24px',
      background: '#2c1810',
      color: '#fff',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#e28743' }}>☕ Cafetería Sweet</h2>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Menú / Ordenar</Link>
      <Link to="/pedidos" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Historial Pedidos</Link>
      <Link to="/inventario" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Inventario</Link>
      <Link to="/productos-admin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Catálogo</Link>
      <Link to="/cierre-caja" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Cierre de Caja</Link>
    </nav>
  );
}
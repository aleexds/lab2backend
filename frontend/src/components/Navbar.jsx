import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const navStyle = ({ isActive }) => ({
    color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.72)',
    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
    padding: '8px 14px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    transition: 'all 0.2s ease'
  });

  return (
    <header style={{
      background: 'linear-gradient(135deg, #2e1a13 0%, #1d0f0a 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>☕</span>
          <div>
            <h1 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
              Cafetería Sweet
            </h1>
            <span style={{ fontSize: '0.72rem', color: '#c87d46', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              POS & Inventory System
            </span>
          </div>
        </div>

        {/* Links */}
        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <NavLink to="/" style={navStyle}>Menú</NavLink>
          <NavLink to="/pedidos" style={navStyle}>Historial</NavLink>
          <NavLink to="/inventario" style={navStyle}>Inventario</NavLink>
          <NavLink to="/productos-admin" style={navStyle}>Catálogo</NavLink>
          <NavLink to="/cierre-caja" style={navStyle}>Cierre de Caja</NavLink>
        </nav>
      </div>
    </header>
  );
}
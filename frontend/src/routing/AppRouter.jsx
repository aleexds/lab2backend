import { Routes, Route } from 'react-router-dom';
import MenuPage from '../pages/MenuPage';
import PedidosPage from '../pages/PedidosPage';
import PedidoDetallePage from '../pages/PedidoDetallePage';
import InventarioPage from '../pages/InventarioPage';
import ProductosAdminPage from '../pages/ProductosAdminPage';
import CierreCajaPage from '../pages/CierreCajaPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/pedidos" element={<PedidosPage />} />
      <Route path="/pedidos/:id" element={<PedidoDetallePage />} />
      <Route path="/inventario" element={<InventarioPage />} />
      <Route path="/productos-admin" element={<ProductosAdminPage />} />
      <Route path="/cierre-caja" element={<CierreCajaPage />} />
    </Routes>
  );
}
import { Routes, Route } from 'react-router-dom';
import MenuPage from '../pages/MenuPage';
import PedidosPage from '../pages/PedidosPage';
import InventarioPage from '../pages/InventarioPage';
import ProductosAdminPage from '../pages/ProductosAdminPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/pedidos" element={<PedidosPage />} />
      <Route path="/inventario" element={<InventarioPage />} />
      <Route path="/productos-admin" element={<ProductosAdminPage />} />
    </Routes>
  );
}
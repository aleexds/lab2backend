import { Routes, Route } from 'react-router-dom';
import MenuPage from '../pages/MenuPage';
import PedidosPage from '../pages/PedidosPage';

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/pedidos" element={<PedidosPage />} />
        </Routes>
    );
}
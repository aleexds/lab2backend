import Navbar from './components/Navbar';
import AppRouter from './routing/AppRouter';

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', background: '#f9f9f9' }}>
      <Navbar />
      <main>
        <AppRouter />
      </main>
    </div>
  );
}
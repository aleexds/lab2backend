const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');
const productosRoutes = require('./routes/productosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const insumosRoutes = require('./routes/insumosRoutes');
const resumenController = require('./controllers/resumenController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de prueba
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ ok: true, timestamp: result.rows[0].now, message: 'Conectado a Supabase exitosamente' });
    } catch (error) {
        console.error('Error al conectar a la BD:', error);
        res.status(500).json({ ok: false, error: error.message });
    }
});

// Rutas de la API
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/insumos', insumosRoutes);
app.get('/api/resumen', resumenController.getResumen);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

// ── Middlewares globales ──────────────────────────────
app.use(cors());
app.use(express.json());

// ── Autenticación ─────────────────────────────────────
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// ── Ruta de inicio (protegida) ────────────────────────
const inicioRoutes = require('./routes/inicio');
app.use('/api', inicioRoutes);

// ── CRUDs del sistema Saurely ─────────────────────────
app.use('/api/productos',       require('./routes/productos'));
app.use('/api/clientes',        require('./routes/clientes'));
app.use('/api/pedidos',         require('./routes/pedidos'));
app.use('/api/resultados-piel', require('./routes/resultados_piel'));
app.use('/api/categorias',      require('./routes/categorias'));

// ── Ruta raíz ─────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ mensaje: '🌙 Saurely API — Tienda de maquillaje y cuidado de piel' });
});

// ── Iniciar servidor ──────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌙 Saurely API corriendo en http://localhost:${PORT}`);
});

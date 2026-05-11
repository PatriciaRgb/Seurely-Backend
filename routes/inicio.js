const express        = require('express');
const router         = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const db             = require('../config/db');

// GET /api/inicio — protegida, resumen del sistema Saurely
router.get('/inicio', verificarToken, (req, res) => {
    // Dato dinámico: total de productos en el catálogo
    db.query('SELECT COUNT(*) AS total FROM productos', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
            sistema:  'Sistema de Gestión Saurely',
            mensaje:  `Bienvenida a Saurely, ${req.usuario.nombre}! 🌙`,
            fecha:    new Date().toISOString(),
            modulos: [
                'Productos',
                'Clientes',
                'Pedidos',
                'Resultados de Piel',
                'Categorias'
            ],
            datos_dinamicos: {
                total_productos: result[0].total
            }
        });
    });
});

module.exports = router;

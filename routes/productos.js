const express        = require('express');
const router         = express.Router();
const ctrl           = require('../controllers/productosController');
const verificarToken = require('../middlewares/authMiddleware');

// Rutas públicas — cualquiera puede ver el catálogo
router.get('/',                    ctrl.getAll);
router.get('/piel/:tipo',          ctrl.getByTipoPiel);  // endpoint extra: por tipo de piel
router.get('/:id',                 ctrl.getById);

// Rutas protegidas — requieren token JWT
router.post('/',     verificarToken, ctrl.create);
router.put('/:id',   verificarToken, ctrl.update);
router.delete('/:id',verificarToken, ctrl.remove);

module.exports = router;

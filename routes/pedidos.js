const express        = require('express');
const router         = express.Router();
const ctrl           = require('../controllers/pedidosController');
const verificarToken = require('../middlewares/authMiddleware');

router.get('/',             verificarToken, ctrl.getAll);
router.get('/mis-pedidos',  verificarToken, ctrl.getMisPedidos);  // endpoint extra
router.get('/:id',          verificarToken, ctrl.getById);
router.post('/',            verificarToken, ctrl.create);
router.put('/:id',          verificarToken, ctrl.update);
router.delete('/:id',       verificarToken, ctrl.remove);

module.exports = router;

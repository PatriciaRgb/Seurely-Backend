const express        = require('express');
const router         = express.Router();
const ctrl           = require('../controllers/clientesController');
const verificarToken = require('../middlewares/authMiddleware');

router.get('/',              ctrl.getAll);
router.get('/piel/:tipo',    ctrl.getByTipoPiel);  // endpoint extra: por tipo de piel
router.get('/:id',           ctrl.getById);
router.post('/',             verificarToken, ctrl.create);
router.put('/:id',           verificarToken, ctrl.update);
router.delete('/:id',        verificarToken, ctrl.remove);

module.exports = router;

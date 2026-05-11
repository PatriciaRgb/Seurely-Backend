const express        = require('express');
const router         = express.Router();
const ctrl           = require('../controllers/resultadosPielController');
const verificarToken = require('../middlewares/authMiddleware');

router.get('/',            verificarToken, ctrl.getAll);
router.get('/mi-resultado',verificarToken, ctrl.getMiResultado);  // endpoint extra
router.get('/:id',         verificarToken, ctrl.getById);
router.post('/',           verificarToken, ctrl.create);
router.put('/:id',         verificarToken, ctrl.update);
router.delete('/:id',      verificarToken, ctrl.remove);

module.exports = router;

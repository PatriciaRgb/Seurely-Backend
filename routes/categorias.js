const express        = require('express');
const router         = express.Router();
const ctrl           = require('../controllers/categoriasController');
const verificarToken = require('../middlewares/authMiddleware');

router.get('/',           ctrl.getAll);
router.get('/tipo/:tipo', ctrl.getByTipo);   // endpoint extra: por tipo
router.get('/:id',        ctrl.getById);
router.post('/',          verificarToken, ctrl.create);
router.put('/:id',        verificarToken, ctrl.update);
router.delete('/:id',     verificarToken, ctrl.remove);

module.exports = router;

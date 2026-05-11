const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/authController');

// Rutas públicas — generan el token, NO llevan middleware
router.post('/registro', ctrl.registro);
router.post('/login',    ctrl.login);

module.exports = router;

const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
    // Leer el header Authorization de la petición
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No se envio un token.' });
    }

    // Extraer el token del formato "Bearer TOKEN"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ mensaje: 'Formato invalido. Usa: Bearer <token>' });
    }

    try {
        // Verificar y decodificar el token con la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ mensaje: 'Token invalido o expirado' });
    }
};

module.exports = verificarToken;

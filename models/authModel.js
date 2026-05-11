const db = require('../config/db');

const Auth = {
    // Buscar cliente por email para login y validar duplicados en registro
    findByEmail: (email, callback) => {
        db.query('SELECT * FROM clientes WHERE email = ?', [email], callback);
    },

    // Insertar nuevo cliente con contraseña ya encriptada
    createUser: (data, callback) => {
        db.query('INSERT INTO clientes SET ?', [data], callback);
    }
};

module.exports = Auth;

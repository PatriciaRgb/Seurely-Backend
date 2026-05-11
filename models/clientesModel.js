const db = require('../config/db');

const Clientes = {
    // Obtener todos los clientes registrados en Saurely
    getAll: (callback) => {
        db.query('SELECT id, nombre, email, telefono, tipo_piel, created_at FROM clientes ORDER BY nombre ASC', callback);
    },

    // Obtener un cliente específico por ID
    getById: (id, callback) => {
        db.query('SELECT id, nombre, email, telefono, tipo_piel, created_at FROM clientes WHERE id = ?', [id], callback);
    },

    // Registrar un nuevo cliente (sin devolver password)
    create: (datos, callback) => {
        const sql = 'INSERT INTO clientes (nombre, email, password, telefono) VALUES (?,?,?,?)';
        db.query(sql, [datos.nombre, datos.email, datos.password, datos.telefono || null], callback);
    },

    // Actualizar datos del perfil de un cliente
    update: (id, datos, callback) => {
        const sql = 'UPDATE clientes SET nombre=?, telefono=?, tipo_piel=? WHERE id=?';
        db.query(sql, [datos.nombre, datos.telefono || null, datos.tipo_piel || null, id], callback);
    },

    // Eliminar cuenta de un cliente
    delete: (id, callback) => {
        db.query('DELETE FROM clientes WHERE id = ?', [id], callback);
    },

    // Endpoint extra: clientes filtrados por tipo de piel detectado
    getByTipoPiel: (tipo, callback) => {
        db.query('SELECT id, nombre, email, tipo_piel FROM clientes WHERE tipo_piel = ?', [tipo], callback);
    },

    // Verificar si el email ya existe — usado en registro
    findByEmail: (email, callback) => {
        db.query('SELECT id FROM clientes WHERE email = ?', [email], callback);
    }
};

module.exports = Clientes;

const db = require('../config/db');

const Categorias = {
    // Obtener todas las categorías del catálogo Saurely
    getAll: (callback) => {
        db.query('SELECT * FROM categorias ORDER BY nombre ASC', callback);
    },

    // Obtener una categoría específica por ID
    getById: (id, callback) => {
        db.query('SELECT * FROM categorias WHERE id = ?', [id], callback);
    },

    // Crear una nueva categoría de productos
    create: (datos, callback) => {
        db.query('INSERT INTO categorias (nombre, descripcion, tipo) VALUES (?,?,?)',
            [datos.nombre, datos.descripcion || null, datos.tipo], callback);
    },

    // Actualizar datos de una categoría existente
    update: (id, datos, callback) => {
        db.query('UPDATE categorias SET nombre=?, descripcion=?, tipo=? WHERE id=?',
            [datos.nombre, datos.descripcion || null, datos.tipo, id], callback);
    },

    // Eliminar una categoría del sistema
    delete: (id, callback) => {
        db.query('DELETE FROM categorias WHERE id = ?', [id], callback);
    },

    // Endpoint extra: categorías filtradas por tipo (maquillaje o skincare)
    getByTipo: (tipo, callback) => {
        db.query('SELECT * FROM categorias WHERE tipo = ?', [tipo], callback);
    }
};

module.exports = Categorias;

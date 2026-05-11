const db = require('../config/db');

const Productos = {
    // Obtener todos los productos del catálogo Saurely
    getAll: (callback) => {
        db.query(`SELECT p.*, c.nombre AS categoria_nombre
                  FROM productos p
                  LEFT JOIN categorias c ON p.categoria_id = c.id
                  ORDER BY p.nombre ASC`, callback);
    },

    // Obtener un producto específico por su ID
    getById: (id, callback) => {
        db.query('SELECT * FROM productos WHERE id = ?', [id], callback);
    },

    // Registrar un nuevo producto en el catálogo
    create: (datos, callback) => {
        const sql = `INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, tipo_piel, imagen)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [
            datos.nombre, datos.descripcion, datos.precio,
            datos.stock, datos.categoria_id, datos.tipo_piel,
            datos.imagen || 'default.jpg'
        ], callback);
    },

    // Actualizar datos de un producto existente
    update: (id, datos, callback) => {
        const sql = `UPDATE productos SET nombre=?, descripcion=?, precio=?,
                     stock=?, categoria_id=?, tipo_piel=? WHERE id=?`;
        db.query(sql, [
            datos.nombre, datos.descripcion, datos.precio,
            datos.stock, datos.categoria_id, datos.tipo_piel, id
        ], callback);
    },

    // Eliminar un producto del catálogo
    delete: (id, callback) => {
        db.query('DELETE FROM productos WHERE id = ?', [id], callback);
    },

    // Endpoint extra: productos recomendados según tipo de piel
    getByTipoPiel: (tipo, callback) => {
        db.query(`SELECT * FROM productos WHERE tipo_piel = ? OR tipo_piel = 'todos'
                  ORDER BY nombre ASC`, [tipo], callback);
    }
};

module.exports = Productos;

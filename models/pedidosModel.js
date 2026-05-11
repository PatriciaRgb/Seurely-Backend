const db = require('../config/db');

const Pedidos = {
    // Obtener todos los pedidos con nombre del cliente
    getAll: (callback) => {
        db.query(`SELECT p.*, c.nombre AS cliente_nombre
                  FROM pedidos p
                  LEFT JOIN clientes c ON p.cliente_id = c.id
                  ORDER BY p.created_at DESC`, callback);
    },

    // Obtener un pedido específico por ID
    getById: (id, callback) => {
        db.query('SELECT * FROM pedidos WHERE id = ?', [id], callback);
    },

    // Registrar un nuevo pedido al completar la compra
    create: (datos, callback) => {
        const sql = `INSERT INTO pedidos (cliente_id, total, estado, tracking, items_json)
                     VALUES (?, ?, 'procesando', ?, ?)`;
        db.query(sql, [
            datos.cliente_id, datos.total,
            datos.tracking, datos.items_json
        ], callback);
    },

    // Actualizar el estado del pedido (procesando, enviado, entregado)
    update: (id, datos, callback) => {
        db.query('UPDATE pedidos SET estado=? WHERE id=?', [datos.estado, id], callback);
    },

    // Cancelar o eliminar un pedido
    delete: (id, callback) => {
        db.query('DELETE FROM pedidos WHERE id = ?', [id], callback);
    },

    // Endpoint extra: pedidos de un cliente específico
    getByCliente: (cliente_id, callback) => {
        db.query('SELECT * FROM pedidos WHERE cliente_id = ? ORDER BY created_at DESC',
            [cliente_id], callback);
    }
};

module.exports = Pedidos;

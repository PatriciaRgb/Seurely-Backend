const db = require('../config/db');

const ResultadosPiel = {
    // Obtener todos los resultados del Skin Match
    getAll: (callback) => {
        db.query(`SELECT r.*, c.nombre AS cliente_nombre
                  FROM resultados_piel r
                  LEFT JOIN clientes c ON r.cliente_id = c.id
                  ORDER BY r.fecha DESC`, callback);
    },

    // Obtener un resultado específico por ID
    getById: (id, callback) => {
        db.query('SELECT * FROM resultados_piel WHERE id = ?', [id], callback);
    },

    // Guardar resultado del análisis de piel (cámara o cuestionario)
    create: (datos, callback) => {
        const sql = `INSERT INTO resultados_piel
                     (cliente_id, tipo_piel, hidratacion, sebo, sensibilidad, metodo)
                     VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(sql, [
            datos.cliente_id, datos.tipo_piel,
            datos.hidratacion || null, datos.sebo || null,
            datos.sensibilidad || null, datos.metodo || 'cuestionario'
        ], callback);
    },

    // Actualizar resultado si la clienta repite el análisis
    update: (id, datos, callback) => {
        const sql = `UPDATE resultados_piel SET tipo_piel=?, hidratacion=?,
                     sebo=?, sensibilidad=?, metodo=? WHERE id=?`;
        db.query(sql, [
            datos.tipo_piel, datos.hidratacion || null,
            datos.sebo || null, datos.sensibilidad || null,
            datos.metodo || 'cuestionario', id
        ], callback);
    },

    // Eliminar un resultado de piel
    delete: (id, callback) => {
        db.query('DELETE FROM resultados_piel WHERE id = ?', [id], callback);
    },

    // Endpoint extra: último resultado de la clienta logueada
    getUltimoPorCliente: (cliente_id, callback) => {
        db.query(`SELECT * FROM resultados_piel WHERE cliente_id = ?
                  ORDER BY fecha DESC LIMIT 1`, [cliente_id], callback);
    }
};

module.exports = ResultadosPiel;

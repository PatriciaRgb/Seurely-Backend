const Pedidos = require('../models/pedidosModel');

// Obtener todos los pedidos
const getAll = (req, res) => {
    Pedidos.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Obtener pedido por ID
const getById = (req, res) => {
    Pedidos.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        res.json(results[0]);
    });
};

// Crear nuevo pedido
const create = (req, res) => {
    const { cliente_id, total, items_json } = req.body;

    // Validar campos obligatorios del pedido
    if (!cliente_id || !total || !items_json) {
        return res.status(400).json({ mensaje: 'cliente_id, total e items_json son requeridos' });
    }

    // El total del pedido debe ser mayor a cero
    if (parseFloat(total) <= 0) {
        return res.status(400).json({ mensaje: 'El total del pedido debe ser mayor a 0' });
    }

    // Generar número de tracking único para Saurely
    const tracking = `SAU-${Date.now().toString().slice(-4)}-${Math.floor(Math.random()*1000)}`;

    const datos = {
        cliente_id, total, tracking,
        items_json: typeof items_json === 'string' ? items_json : JSON.stringify(items_json)
    };

    Pedidos.create(datos, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: 'Pedido creado correctamente', id: result.insertId, tracking });
    });
};

// Actualizar estado del pedido
const update = (req, res) => {
    const { estado } = req.body;
    const estadosValidos = ['procesando', 'enviado', 'entregado', 'cancelado'];

    // Validar que el estado sea uno de los permitidos
    if (!estado || !estadosValidos.includes(estado)) {
        return res.status(400).json({ mensaje: `Estado inválido. Usa: ${estadosValidos.join(', ')}` });
    }

    Pedidos.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Pedido no encontrado' });

        Pedidos.update(req.params.id, req.body, (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ mensaje: 'Estado del pedido actualizado correctamente' });
        });
    });
};

// Eliminar pedido
const remove = (req, res) => {
    Pedidos.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Pedido no encontrado' });

        Pedidos.delete(req.params.id, (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ mensaje: 'Pedido eliminado correctamente' });
        });
    });
};

// Endpoint extra: pedidos de un cliente (mis pedidos)
const getMisPedidos = (req, res) => {
    Pedidos.getByCliente(req.usuario.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

module.exports = { getAll, getById, create, update, remove, getMisPedidos };

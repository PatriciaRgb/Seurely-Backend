const Productos = require('../models/productosModel');

// Obtener todos los productos del catálogo
const getAll = (req, res) => {
    Productos.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Obtener un producto por ID
const getById = (req, res) => {
    Productos.getById(req.params.id, (err, results) => {
        if (err)  return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
        res.json(results[0]);
    });
};

// Crear nuevo producto — protegido
const create = (req, res) => {
    const { nombre, precio, stock, categoria_id, tipo_piel } = req.body;

    // Validar campos obligatorios del producto
    if (!nombre || precio === undefined || stock === undefined || !categoria_id || !tipo_piel) {
        return res.status(400).json({ mensaje: 'Nombre, precio, stock, categoria_id y tipo_piel son requeridos' });
    }

    // No permitir precios negativos
    if (parseFloat(precio) < 0) {
        return res.status(400).json({ mensaje: 'El precio no puede ser negativo' });
    }

    // No permitir stock negativo
    if (parseInt(stock) < 0) {
        return res.status(400).json({ mensaje: 'El stock no puede ser negativo' });
    }

    // Validar tipo de piel válido para Saurely
    const tiposValidos = ['grasa', 'seca', 'mixta', 'todos'];
    if (!tiposValidos.includes(tipo_piel)) {
        return res.status(400).json({ mensaje: 'tipo_piel debe ser: grasa, seca, mixta o todos' });
    }

    Productos.create(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: 'Producto creado correctamente', id: result.insertId });
    });
};

// Actualizar producto existente
const update = (req, res) => {
    const { nombre, precio, stock, categoria_id, tipo_piel } = req.body;

    // Validar campos requeridos para actualización
    if (!nombre || precio === undefined || stock === undefined || !categoria_id || !tipo_piel) {
        return res.status(400).json({ mensaje: 'Nombre, precio, stock, categoria_id y tipo_piel son requeridos' });
    }

    if (parseFloat(precio) < 0) {
        return res.status(400).json({ mensaje: 'El precio no puede ser negativo' });
    }

    if (parseInt(stock) < 0) {
        return res.status(400).json({ mensaje: 'El stock no puede ser negativo' });
    }

    Productos.getById(req.params.id, (err, results) => {
        if (err)  return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });

        Productos.update(req.params.id, req.body, (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ mensaje: 'Producto actualizado correctamente' });
        });
    });
};

// Eliminar producto
const remove = (req, res) => {
    Productos.getById(req.params.id, (err, results) => {
        if (err)  return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });

        Productos.delete(req.params.id, (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ mensaje: 'Producto eliminado correctamente' });
        });
    });
};

// Endpoint extra: productos recomendados por tipo de piel (Skin Match)
const getByTipoPiel = (req, res) => {
    const { tipo } = req.params;
    const tiposValidos = ['grasa', 'seca', 'mixta', 'todos'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({ mensaje: 'Tipo de piel inválido. Usa: grasa, seca, mixta o todos' });
    }
    Productos.getByTipoPiel(tipo, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

module.exports = { getAll, getById, create, update, remove, getByTipoPiel };

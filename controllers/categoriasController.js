const Categorias = require('../models/categoriasModel');

// Obtener todas las categorías
const getAll = (req, res) => {
    Categorias.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Obtener categoría por ID
const getById = (req, res) => {
    Categorias.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        res.json(results[0]);
    });
};

// Crear nueva categoría
const create = (req, res) => {
    const { nombre, tipo } = req.body;

    // Validar campos obligatorios de la categoría
    if (!nombre || !tipo) {
        return res.status(400).json({ mensaje: 'Nombre y tipo son requeridos' });
    }

    // Solo se permiten categorías de maquillaje o skincare en Saurely
    if (!['maquillaje', 'skincare'].includes(tipo)) {
        return res.status(400).json({ mensaje: 'El tipo debe ser: maquillaje o skincare' });
    }

    Categorias.create(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: 'Categoría creada correctamente', id: result.insertId });
    });
};

// Actualizar categoría
const update = (req, res) => {
    const { nombre, tipo } = req.body;
    if (!nombre || !tipo) {
        return res.status(400).json({ mensaje: 'Nombre y tipo son requeridos' });
    }

    if (!['maquillaje', 'skincare'].includes(tipo)) {
        return res.status(400).json({ mensaje: 'El tipo debe ser: maquillaje o skincare' });
    }

    Categorias.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Categoría no encontrada' });

        Categorias.update(req.params.id, req.body, (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ mensaje: 'Categoría actualizada correctamente' });
        });
    });
};

// Eliminar categoría
const remove = (req, res) => {
    Categorias.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Categoría no encontrada' });

        Categorias.delete(req.params.id, (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ mensaje: 'Categoría eliminada correctamente' });
        });
    });
};

// Endpoint extra: categorías por tipo (maquillaje o skincare)
const getByTipo = (req, res) => {
    const { tipo } = req.params;
    if (!['maquillaje', 'skincare'].includes(tipo)) {
        return res.status(400).json({ mensaje: 'Tipo inválido. Usa: maquillaje o skincare' });
    }
    Categorias.getByTipo(tipo, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

module.exports = { getAll, getById, create, update, remove, getByTipo };

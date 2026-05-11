const Clientes = require('../models/clientesModel');
const bcrypt   = require('bcryptjs');

// Obtener todos los clientes
const getAll = (req, res) => {
    Clientes.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Obtener cliente por ID
const getById = (req, res) => {
    Clientes.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        res.json(results[0]);
    });
};

// Crear nuevo cliente
const create = (req, res) => {
    const { nombre, email, password, telefono } = req.body;

    // Validar campos obligatorios del cliente
    if (!nombre || !email || !password) {
        return res.status(400).json({ mensaje: 'Nombre, email y password son requeridos' });
    }

    // Verificar que el email no esté ya registrado
    Clientes.findByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            return res.status(400).json({ mensaje: 'Ya existe un cliente con ese email' });
        }

        // Encriptar contraseña antes de guardar
        const passwordEncriptada = bcrypt.hashSync(password, 10);

        Clientes.create({ nombre, email, password: passwordEncriptada, telefono }, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ mensaje: 'Cliente registrado correctamente', id: result.insertId });
        });
    });
};

// Actualizar datos del cliente
const update = (req, res) => {
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({ mensaje: 'El nombre es requerido' });
    }

    // Validar tipo de piel si se envía
    const tiposValidos = ['grasa', 'seca', 'mixta', null, ''];
    if (req.body.tipo_piel && !['grasa','seca','mixta'].includes(req.body.tipo_piel)) {
        return res.status(400).json({ mensaje: 'tipo_piel debe ser: grasa, seca o mixta' });
    }

    Clientes.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

        Clientes.update(req.params.id, req.body, (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ mensaje: 'Cliente actualizado correctamente' });
        });
    });
};

// Eliminar cliente
const remove = (req, res) => {
    Clientes.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

        Clientes.delete(req.params.id, (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ mensaje: 'Cliente eliminado correctamente' });
        });
    });
};

// Endpoint extra: clientes por tipo de piel
const getByTipoPiel = (req, res) => {
    const { tipo } = req.params;
    if (!['grasa','seca','mixta'].includes(tipo)) {
        return res.status(400).json({ mensaje: 'Tipo de piel inválido. Usa: grasa, seca o mixta' });
    }
    Clientes.getByTipoPiel(tipo, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

module.exports = { getAll, getById, create, update, remove, getByTipoPiel };

const ResultadosPiel = require('../models/resultadosPielModel');

// Obtener todos los resultados
const getAll = (req, res) => {
    ResultadosPiel.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Obtener resultado por ID
const getById = (req, res) => {
    ResultadosPiel.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Resultado no encontrado' });
        res.json(results[0]);
    });
};

// Guardar nuevo resultado del Skin Match
const create = (req, res) => {
    const { tipo_piel, metodo } = req.body;

    // Validar que se envíe el tipo de piel detectado
    if (!tipo_piel) {
        return res.status(400).json({ mensaje: 'tipo_piel es requerido' });
    }

    // Validar que el tipo de piel sea uno de los tres válidos en Saurely
    if (!['grasa', 'seca', 'mixta'].includes(tipo_piel)) {
        return res.status(400).json({ mensaje: 'tipo_piel debe ser: grasa, seca o mixta' });
    }

    // Validar que el método sea cuestionario o camara
    if (metodo && !['cuestionario', 'camara'].includes(metodo)) {
        return res.status(400).json({ mensaje: 'metodo debe ser: cuestionario o camara' });
    }

    const datos = { ...req.body, cliente_id: req.usuario.id };

    ResultadosPiel.create(datos, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: 'Resultado de piel guardado correctamente', id: result.insertId });
    });
};

// Actualizar resultado de piel
const update = (req, res) => {
    const { tipo_piel } = req.body;
    if (!tipo_piel) return res.status(400).json({ mensaje: 'tipo_piel es requerido' });

    if (!['grasa', 'seca', 'mixta'].includes(tipo_piel)) {
        return res.status(400).json({ mensaje: 'tipo_piel debe ser: grasa, seca o mixta' });
    }

    ResultadosPiel.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Resultado no encontrado' });

        ResultadosPiel.update(req.params.id, req.body, (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ mensaje: 'Resultado actualizado correctamente' });
        });
    });
};

// Eliminar resultado
const remove = (req, res) => {
    ResultadosPiel.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Resultado no encontrado' });

        ResultadosPiel.delete(req.params.id, (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ mensaje: 'Resultado eliminado correctamente' });
        });
    });
};

// Endpoint extra: mi último resultado de Skin Match
const getMiResultado = (req, res) => {
    ResultadosPiel.getUltimoPorCliente(req.usuario.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Aún no tienes resultados de Skin Match' });
        res.json(results[0]);
    });
};

module.exports = { getAll, getById, create, update, remove, getMiResultado };

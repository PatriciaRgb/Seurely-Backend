const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const Auth   = require('../models/authModel');
require('dotenv').config();

// Registrar nuevo cliente con contraseña encriptada
const registro = (req, res) => {
    const { nombre, email, password } = req.body;

    // Validar que lleguen todos los campos requeridos
    if (!nombre || !email || !password) {
        return res.status(400).json({ mensaje: 'Nombre, email y password son requeridos' });
    }

    // Verificar que el email no esté ya registrado
    Auth.findByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            return res.status(400).json({ mensaje: 'Este email ya está registrado' });
        }

        // Encriptar contraseña antes de guardar en la BD
        const passwordEncriptada = bcrypt.hashSync(password, 10);

        Auth.createUser({ nombre, email, password: passwordEncriptada }, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ mensaje: 'Cliente registrado correctamente', id: result.insertId });
        });
    });
};

// Iniciar sesión y recibir token JWT
const login = (req, res) => {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
        return res.status(400).json({ mensaje: 'Email y password son requeridos' });
    }

    Auth.findByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        const cliente = results[0];

        // Comparar contraseña ingresada con la encriptada en la BD
        const passwordCorrecta = bcrypt.compareSync(password, cliente.password);
        if (!passwordCorrecta) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        // Generar token JWT con datos del cliente autenticado
        const token = jwt.sign(
            { id: cliente.id, email: cliente.email, nombre: cliente.nombre },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );

       res.json({ mensaje: 'Login exitoso', token, nombre: cliente.nombre });
    });
};

module.exports = { registro, login };

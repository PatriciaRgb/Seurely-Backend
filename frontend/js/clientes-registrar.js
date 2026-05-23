const API   = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');

if (!token) window.location.href = 'login.html';

function registrar() {
    const nombre   = document.getElementById('nombre').value.trim();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const btn      = document.getElementById('btnGuardar');

    if (!nombre || !email || !password) {
        mostrarAlerta('Nombre, email y password son requeridos.', 'warning');
        return;
    }
    if (password.length < 6) {
        mostrarAlerta('La contraseña debe tener al menos 6 caracteres.', 'warning');
        return;
    }

    btn.disabled    = true;
    btn.textContent = 'Guardando...';

    fetch(`${API}/clientes`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body:    JSON.stringify({ nombre, email, password, telefono })
    })
    .then(res => {
        if (res.status === 401) { sessionStorage.clear(); window.location.href = 'login.html'; return; }
        return res.json();
    })
    .then(data => {
        if (!data) return;
        if (data.error || (data.mensaje && data.mensaje.includes('registrado'))) {
            mostrarAlerta(data.mensaje || data.error, 'danger');
            return;
        }
        mostrarAlerta('¡Cliente registrada correctamente! ✅ Redirigiendo...', 'success');
        setTimeout(() => { window.location.href = 'clientes.html'; }, 1500);
    })
    .catch(() => mostrarAlerta('Error al guardar.', 'danger'))
    .finally(() => { btn.disabled = false; btn.textContent = 'Guardar Cliente'; });
}

function cerrarSesion() { sessionStorage.clear(); window.location.href = 'login.html'; }

function mostrarAlerta(mensaje, tipo) {
    document.getElementById('alerta').innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
}

const API   = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');
const id    = new URLSearchParams(window.location.search).get('id');

if (!token) window.location.href = 'login.html';
if (!id) window.location.href = 'clientes.html';

function cargarCliente() {
    fetch(`${API}/clientes/${id}`)
    .then(res => res.json())
    .then(c => {
        document.getElementById('spinner').classList.add('d-none');
        document.getElementById('formEditar').classList.remove('d-none');
        document.getElementById('nombre').value    = c.nombre;
        document.getElementById('telefono').value  = c.telefono || '';
        document.getElementById('tipo_piel').value = c.tipo_piel || '';
    })
    .catch(() => mostrarAlerta('Error al cargar la cliente.', 'danger'));
}

function actualizar() {
    const nombre    = document.getElementById('nombre').value.trim();
    const telefono  = document.getElementById('telefono').value.trim();
    const tipo_piel = document.getElementById('tipo_piel').value;
    const btn       = document.getElementById('btnActualizar');

    if (!nombre) {
        mostrarAlerta('El nombre es requerido.', 'warning');
        return;
    }

    btn.disabled    = true;
    btn.textContent = 'Actualizando...';

    fetch(`${API}/clientes/${id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body:    JSON.stringify({ nombre, telefono, tipo_piel })
    })
    .then(res => {
        if (res.status === 401) { sessionStorage.clear(); window.location.href = 'login.html'; return; }
        return res.json();
    })
    .then(data => {
        if (!data) return;
        mostrarAlerta('¡Cliente actualizada correctamente! ✅ Redirigiendo...', 'success');
        setTimeout(() => { window.location.href = 'clientes.html'; }, 1500);
    })
    .catch(() => mostrarAlerta('Error al actualizar.', 'danger'))
    .finally(() => { btn.disabled = false; btn.textContent = 'Actualizar Cliente'; });
}

function cerrarSesion() { sessionStorage.clear(); window.location.href = 'login.html'; }

function mostrarAlerta(mensaje, tipo) {
    document.getElementById('alerta').innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
}

cargarCliente();

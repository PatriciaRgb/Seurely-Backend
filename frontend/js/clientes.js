const API    = 'http://localhost:3000/api';
const token  = sessionStorage.getItem('token');
const nombre = sessionStorage.getItem('nombre');

if (!token) window.location.href = 'login.html';
if (document.getElementById('nombreUsuario')) {
    document.getElementById('nombreUsuario').textContent = nombre || '';
}

let todosLosClientes = [];

function cargarClientes() {
    fetch(`${API}/clientes`)
    .then(res => res.json())
    .then(data => {
        todosLosClientes = data;
        renderTabla(data);
    })
    .catch(() => mostrarAlerta('Error al cargar clientes.', 'danger'));
}

function renderTabla(clientes) {
    document.getElementById('spinner').classList.add('d-none');
    document.getElementById('tablaWrap').classList.remove('d-none');

    const tbody = document.getElementById('tablaClientes');
    if (clientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No hay clientes registrados</td></tr>';
        return;
    }

    const badgesPiel = { grasa:'bg-warning text-dark', seca:'bg-info text-dark', mixta:'bg-success' };

    tbody.innerHTML = clientes.map(c => `
        <tr>
            <td class="ps-4">
                <div class="d-flex align-items-center gap-2">
                    <div class="avatar">${c.nombre.charAt(0).toUpperCase()}</div>
                    <strong>${c.nombre}</strong>
                </div>
            </td>
            <td class="text-muted">${c.email}</td>
            <td>${c.telefono || '<span class="text-muted">—</span>'}</td>
            <td>${c.tipo_piel
                ? `<span class="badge ${badgesPiel[c.tipo_piel] || 'bg-secondary'}">${c.tipo_piel}</span>`
                : '<span class="text-muted">Sin detectar</span>'}</td>
            <td class="text-muted">${c.created_at ? c.created_at.slice(0,10) : '—'}</td>
            <td class="text-center">
                <a href="clientes-editar.html?id=${c.id}" class="btn btn-sm btn-outline-warning me-1">✏️ Editar</a>
                <button onclick="eliminar(${c.id})" class="btn btn-sm btn-outline-danger">🗑️ Eliminar</button>
            </td>
        </tr>`).join('');
}

function buscar() {
    const texto = document.getElementById('buscador').value.toLowerCase();
    const piel  = document.getElementById('filtroPiel').value;
    const filtrados = todosLosClientes.filter(c => {
        const matchTexto = c.nombre.toLowerCase().includes(texto) || c.email.toLowerCase().includes(texto);
        const matchPiel  = !piel || c.tipo_piel === piel;
        return matchTexto && matchPiel;
    });
    renderTabla(filtrados);
}

function eliminar(id) {
    if (!confirm('¿Segura que deseas eliminar esta cliente?')) return;
    fetch(`${API}/clientes/${id}`, {
        method:  'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
        if (res.status === 401) { sessionStorage.clear(); window.location.href = 'login.html'; return; }
        return res.json();
    })
    .then(data => {
        if (!data) return;
        mostrarAlerta('Cliente eliminada correctamente ✅', 'success');
        cargarClientes();
    })
    .catch(() => mostrarAlerta('Error al eliminar.', 'danger'));
}

function cerrarSesion() { sessionStorage.clear(); window.location.href = 'login.html'; }

function mostrarAlerta(mensaje, tipo) {
    document.getElementById('alerta').innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
}

document.getElementById('buscador').addEventListener('keyup', buscar);
cargarClientes();

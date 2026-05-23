const API    = 'http://localhost:3000/api';
const token  = sessionStorage.getItem('token');
const nombre = sessionStorage.getItem('nombre');

if (!token) window.location.href = 'login.html';
if (document.getElementById('nombreUsuario')) {
    document.getElementById('nombreUsuario').textContent = nombre || '';
}

let todosLosProductos = [];

function cargarProductos() {
    fetch(`${API}/productos`)
    .then(res => res.json())
    .then(data => {
        todosLosProductos = data;
        renderTabla(data);
    })
    .catch(() => mostrarAlerta('Error al cargar productos.', 'danger'));
}

function renderTabla(productos) {
    document.getElementById('spinner').classList.add('d-none');
    document.getElementById('tablaWrap').classList.remove('d-none');

    const tbody = document.getElementById('tablaProductos');
    if (productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No hay productos registrados</td></tr>';
        return;
    }

    const badges = { grasa:'badge-grasa', seca:'badge-seca', mixta:'badge-mixta', todos:'badge-todos' };

    tbody.innerHTML = productos.map(p => `
        <tr>
            <td class="ps-4 text-muted">${p.id}</td>
            <td><strong>${p.nombre}</strong><br><small class="text-muted">${p.descripcion || ''}</small></td>
            <td><strong style="color:#D4AF37;">$${parseFloat(p.precio).toFixed(0)}</strong></td>
            <td>${p.stock > 0 ? p.stock : '<span class="badge bg-danger">Agotado</span>'}</td>
            <td><span class="badge ${badges[p.tipo_piel] || 'badge-todos'} px-2 py-1">${p.tipo_piel}</span></td>
            <td>${p.categoria_nombre || p.categoria_id}</td>
            <td class="text-center">
                <a href="productos-editar.html?id=${p.id}" class="btn btn-sm btn-outline-warning me-1">✏️ Editar</a>
                <button onclick="eliminar(${p.id})" class="btn btn-sm btn-outline-danger">🗑️ Eliminar</button>
            </td>
        </tr>`).join('');
}

function buscar() {
    const texto = document.getElementById('buscador').value.toLowerCase();
    const piel  = document.getElementById('filtroPiel').value;
    const filtrados = todosLosProductos.filter(p => {
        const matchTexto = p.nombre.toLowerCase().includes(texto) || (p.descripcion || '').toLowerCase().includes(texto);
        const matchPiel  = !piel || p.tipo_piel === piel;
        return matchTexto && matchPiel;
    });
    renderTabla(filtrados);
}

function eliminar(id) {
    if (!confirm('¿Segura que deseas eliminar este producto?')) return;
    fetch(`${API}/productos/${id}`, {
        method:  'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
        if (res.status === 401) { sessionStorage.clear(); window.location.href = 'login.html'; return; }
        return res.json();
    })
    .then(data => {
        if (!data) return;
        mostrarAlerta('Producto eliminado correctamente ✅', 'success');
        cargarProductos();
    })
    .catch(() => mostrarAlerta('Error al eliminar.', 'danger'));
}

function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

function mostrarAlerta(mensaje, tipo) {
    document.getElementById('alerta').innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
}

document.getElementById('buscador').addEventListener('keyup', buscar);
cargarProductos();

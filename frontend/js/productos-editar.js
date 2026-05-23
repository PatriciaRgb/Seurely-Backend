const API   = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');
const id    = new URLSearchParams(window.location.search).get('id');

if (!token) window.location.href = 'login.html';
if (!id) window.location.href = 'productos.html';

function cargarProducto() {
    fetch(`${API}/productos/${id}`)
    .then(res => res.json())
    .then(p => {
        document.getElementById('spinner').classList.add('d-none');
        document.getElementById('formEditar').classList.remove('d-none');
        document.getElementById('nombre').value      = p.nombre;
        document.getElementById('descripcion').value = p.descripcion || '';
        document.getElementById('precio').value      = p.precio;
        document.getElementById('stock').value       = p.stock;
        document.getElementById('categoria_id').value = p.categoria_id;
        document.getElementById('tipo_piel').value   = p.tipo_piel;
    })
    .catch(() => mostrarAlerta('Error al cargar el producto.', 'danger'));
}

function actualizar() {
    const nombre       = document.getElementById('nombre').value.trim();
    const descripcion  = document.getElementById('descripcion').value.trim();
    const precio       = document.getElementById('precio').value;
    const stock        = document.getElementById('stock').value;
    const categoria_id = document.getElementById('categoria_id').value;
    const tipo_piel    = document.getElementById('tipo_piel').value;
    const btn          = document.getElementById('btnActualizar');

    if (!nombre || !precio || !stock || !categoria_id || !tipo_piel) {
        mostrarAlerta('Completa todos los campos requeridos.', 'warning');
        return;
    }

    btn.disabled    = true;
    btn.textContent = 'Actualizando...';

    fetch(`${API}/productos/${id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body:    JSON.stringify({ nombre, descripcion, precio: parseFloat(precio), stock: parseInt(stock), categoria_id: parseInt(categoria_id), tipo_piel })
    })
    .then(res => {
        if (res.status === 401) { sessionStorage.clear(); window.location.href = 'login.html'; return; }
        return res.json();
    })
    .then(data => {
        if (!data) return;
        mostrarAlerta('¡Producto actualizado correctamente! ✅ Redirigiendo...', 'success');
        setTimeout(() => { window.location.href = 'productos.html'; }, 1500);
    })
    .catch(() => mostrarAlerta('Error al actualizar.', 'danger'))
    .finally(() => { btn.disabled = false; btn.textContent = 'Actualizar Producto'; });
}

function cerrarSesion() { sessionStorage.clear(); window.location.href = 'login.html'; }

function mostrarAlerta(mensaje, tipo) {
    document.getElementById('alerta').innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
}

cargarProducto();

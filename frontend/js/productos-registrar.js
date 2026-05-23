const API   = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');

if (!token) window.location.href = 'login.html';

function registrar() {
    const nombre       = document.getElementById('nombre').value.trim();
    const descripcion  = document.getElementById('descripcion').value.trim();
    const precio       = document.getElementById('precio').value;
    const stock        = document.getElementById('stock').value;
    const categoria_id = document.getElementById('categoria_id').value;
    const tipo_piel    = document.getElementById('tipo_piel').value;
    const btn          = document.getElementById('btnGuardar');

    if (!nombre || !precio || !stock || !categoria_id || !tipo_piel) {
        mostrarAlerta('Completa todos los campos requeridos.', 'warning');
        return;
    }
    if (parseFloat(precio) < 0) {
        mostrarAlerta('El precio no puede ser negativo.', 'warning');
        return;
    }
    if (parseInt(stock) < 0) {
        mostrarAlerta('El stock no puede ser negativo.', 'warning');
        return;
    }

    btn.disabled    = true;
    btn.textContent = 'Guardando...';

    fetch(`${API}/productos`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body:    JSON.stringify({ nombre, descripcion, precio: parseFloat(precio), stock: parseInt(stock), categoria_id: parseInt(categoria_id), tipo_piel })
    })
    .then(res => {
        if (res.status === 401) { sessionStorage.clear(); window.location.href = 'login.html'; return; }
        return res.json();
    })
    .then(data => {
        if (!data) return;
        if (data.error) { mostrarAlerta(data.mensaje || data.error, 'danger'); return; }
        mostrarAlerta('¡Producto creado correctamente! ✅ Redirigiendo...', 'success');
        setTimeout(() => { window.location.href = 'productos.html'; }, 1500);
    })
    .catch(() => mostrarAlerta('Error al guardar.', 'danger'))
    .finally(() => { btn.disabled = false; btn.textContent = 'Guardar Producto'; });
}

function cerrarSesion() { sessionStorage.clear(); window.location.href = 'login.html'; }

function mostrarAlerta(mensaje, tipo) {
    document.getElementById('alerta').innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
}

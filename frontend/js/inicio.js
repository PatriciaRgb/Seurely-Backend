const API    = 'http://localhost:3000/api';
const token  = sessionStorage.getItem('token');
const nombre = sessionStorage.getItem('nombre');

if (!token) window.location.href = 'login.html';

document.getElementById('nombreUsuario').textContent = nombre || '';

function cargarInicio() {
    fetch(`${API}/inicio`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
        if (res.status === 401) { sessionStorage.clear(); window.location.href = 'login.html'; return; }
        return res.json();
    })
    .then(data => {
        if (!data) return;
        document.getElementById('spinner').classList.add('d-none');
        document.getElementById('contenido').classList.remove('d-none');
        document.getElementById('tituloBienvenida').textContent = `Bienvenida, ${nombre} 🌙`;
        document.getElementById('fechaHora').textContent = new Date(data.fecha).toLocaleDateString('es-MX', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        const contenedor = document.getElementById('tarjetasModulos');
        contenedor.innerHTML = '';

        // Tarjetas de módulos
        const iconos = { Productos:'💄', Clientes:'👩', Pedidos:'📦', 'Resultados de Piel':'🔬', Categorias:'🗂️' };
        data.modulos.forEach(modulo => {
            const icono = iconos[modulo] || '📋';
            const modulosConPagina = ['Productos', 'Clientes'];
const href = modulosConPagina.includes(modulo) 
    ? modulo.toLowerCase() + '.html' 
    : '#';
const disabled = modulosConPagina.includes(modulo) ? '' : 'disabled';
            contenedor.innerHTML += `
                <div class="col-md-4">
                    <div class="card card-modulo shadow-sm h-100">
                        <div class="card-body p-4">
                            <div style="font-size:32px;margin-bottom:10px;">${icono}</div>
                            <h5 class="card-title fw-bold">${modulo}</h5>
                            <a href="${href}" class="btn btn-saurely btn-sm mt-2 ${disabled}">
    ${modulosConPagina.includes(modulo) ? 'Ir al módulo →' : 'Próximamente'}
</a>
                        </div>
                    </div>
                </div>`;
        });

        // Dato dinámico
        if (data.datos_dinamicos) {
            Object.keys(data.datos_dinamicos).forEach(key => {
                contenedor.innerHTML += `
                    <div class="col-md-4">
                        <div class="card card-stat h-100">
                            <div class="card-body text-center p-4">
                                <h1 class="display-4 fw-bold" style="color:#D4AF37;">${data.datos_dinamicos[key]}</h1>
                                <p class="text-muted text-capitalize">${key.replace(/_/g,' ')}</p>
                            </div>
                        </div>
                    </div>`;
            });
        }
    })
    .catch(() => {
        document.getElementById('spinner').classList.add('d-none');
        mostrarAlerta('Error al cargar. Verifica que el servidor esté corriendo.', 'danger');
    });
}

function cerrarSesion() {
    if (!confirm('¿Segura que deseas cerrar sesión?')) return;
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

cargarInicio();

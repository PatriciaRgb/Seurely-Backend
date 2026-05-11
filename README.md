# 🌙 Saurely Backend

Sistema de gestión para Saurely — tienda de maquillaje y cuidado de piel mexicana.

**Integrantes:** _(agrega tu nombre aquí)_

## Descripción de los 5 módulos

| Módulo | Descripción |
|--------|-------------|
| **Productos** | Catálogo de maquillaje y skincare con filtro por tipo de piel |
| **Clientes** | Registro y perfil de clientas con tipo de piel detectado |
| **Pedidos** | Compras realizadas con tracking de envío |
| **Resultados de Piel** | Resultados del Skin Match (cámara o cuestionario) |
| **Categorías** | Organización del catálogo en maquillaje y skincare |

## Instalación

```bash
npm install
```

Importar base de datos:
```bash
mysql -u root -p < saurely.sql
```

Configurar `.env` con tu password de MySQL y correr:
```bash
npm run dev
```

## Lista de endpoints

### Autenticación
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/auth/registro | ❌ | Registrar nueva clienta |
| POST | /api/auth/login | ❌ | Iniciar sesión |

### Inicio
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/inicio | ✅ | Bienvenida con datos del sistema |

### Productos
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/productos | ❌ | Todos los productos |
| GET | /api/productos/piel/:tipo | ❌ | Por tipo de piel (Skin Match) |
| GET | /api/productos/:id | ❌ | Producto por ID |
| POST | /api/productos | ✅ | Crear producto |
| PUT | /api/productos/:id | ✅ | Actualizar producto |
| DELETE | /api/productos/:id | ✅ | Eliminar producto |

### Clientes
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/clientes | ❌ | Todas las clientas |
| GET | /api/clientes/piel/:tipo | ❌ | Por tipo de piel |
| GET | /api/clientes/:id | ❌ | Clienta por ID |
| POST | /api/clientes | ✅ | Registrar clienta |
| PUT | /api/clientes/:id | ✅ | Actualizar perfil |
| DELETE | /api/clientes/:id | ✅ | Eliminar clienta |

### Pedidos
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/pedidos | ✅ | Todos los pedidos |
| GET | /api/pedidos/mis-pedidos | ✅ | Mis pedidos |
| GET | /api/pedidos/:id | ✅ | Pedido por ID |
| POST | /api/pedidos | ✅ | Crear pedido |
| PUT | /api/pedidos/:id | ✅ | Actualizar estado |
| DELETE | /api/pedidos/:id | ✅ | Eliminar pedido |

### Resultados de Piel
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/resultados-piel | ✅ | Todos los resultados |
| GET | /api/resultados-piel/mi-resultado | ✅ | Mi último Skin Match |
| GET | /api/resultados-piel/:id | ✅ | Resultado por ID |
| POST | /api/resultados-piel | ✅ | Guardar resultado |
| PUT | /api/resultados-piel/:id | ✅ | Actualizar resultado |
| DELETE | /api/resultados-piel/:id | ✅ | Eliminar resultado |

### Categorías
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/categorias | ❌ | Todas las categorías |
| GET | /api/categorias/tipo/:tipo | ❌ | Por tipo (maquillaje/skincare) |
| GET | /api/categorias/:id | ❌ | Categoría por ID |
| POST | /api/categorias | ✅ | Crear categoría |
| PUT | /api/categorias/:id | ✅ | Actualizar categoría |
| DELETE | /api/categorias/:id | ✅ | Eliminar categoría |

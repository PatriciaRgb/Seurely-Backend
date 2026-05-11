-- ═══════════════════════════════════════════════════════
--  SAURELY — Script SQL completo
--  Tienda de maquillaje y cuidado de piel mexicana
-- ═══════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS saurely;
USE saurely;

-- ── Tabla: clientes ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS clientes (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    telefono   VARCHAR(15),
    tipo_piel  ENUM('grasa','seca','mixta') DEFAULT NULL COMMENT 'Resultado del Skin Match',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Tabla: categorias ────────────────────────────────────
CREATE TABLE IF NOT EXISTS categorias (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo        ENUM('maquillaje','skincare') NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Tabla: productos ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS productos (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(150) NOT NULL,
    descripcion  TEXT,
    precio       DECIMAL(8,2) NOT NULL,
    stock        INT NOT NULL DEFAULT 0,
    categoria_id INT NOT NULL,
    tipo_piel    ENUM('grasa','seca','mixta','todos') DEFAULT 'todos',
    imagen       VARCHAR(255) DEFAULT 'default.jpg',
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- ── Tabla: pedidos ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS pedidos (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    total      DECIMAL(10,2) NOT NULL,
    estado     ENUM('procesando','enviado','entregado','cancelado') DEFAULT 'procesando',
    tracking   VARCHAR(30),
    items_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- ── Tabla: resultados_piel ───────────────────────────────
CREATE TABLE IF NOT EXISTS resultados_piel (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id  INT NOT NULL,
    tipo_piel   ENUM('grasa','seca','mixta') NOT NULL,
    hidratacion INT DEFAULT NULL COMMENT 'Porcentaje 0-100',
    sebo        INT DEFAULT NULL COMMENT 'Porcentaje 0-100',
    sensibilidad INT DEFAULT NULL COMMENT 'Porcentaje 0-100',
    metodo      ENUM('cuestionario','camara') DEFAULT 'cuestionario',
    fecha       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- ════════════════════════════════════════════════════════
--  DATOS DE PRUEBA REALES
-- ════════════════════════════════════════════════════════

-- Clientes (password: saurely123)
INSERT INTO clientes (nombre, email, password, telefono, tipo_piel) VALUES
('Valentina Reyes',  'vale@gmail.com',      '$2a$10$rX8nS.hHQ5V5sMkFqJnUvuqzDaHx9X6JNxLkKY3P4bT1qG7ZmCvGW', '5512345678', 'mixta'),
('Sofía Mendoza',    'sofia@hotmail.com',   '$2a$10$rX8nS.hHQ5V5sMkFqJnUvuqzDaHx9X6JNxLkKY3P4bT1qG7ZmCvGW', '5523456789', 'grasa'),
('Camila Torres',    'cami@gmail.com',      '$2a$10$rX8nS.hHQ5V5sMkFqJnUvuqzDaHx9X6JNxLkKY3P4bT1qG7ZmCvGW', '5534567890', 'seca'),
('Daniela Fuentes',  'dani@outlook.com',   '$2a$10$rX8nS.hHQ5V5sMkFqJnUvuqzDaHx9X6JNxLkKY3P4bT1qG7ZmCvGW', '5545678901', 'mixta'),
('Karla Bautista',   'karla@gmail.com',    '$2a$10$rX8nS.hHQ5V5sMkFqJnUvuqzDaHx9X6JNxLkKY3P4bT1qG7ZmCvGW', '5556789012', 'grasa'),
('Lucía Morales',    'lucia@gmail.com',    '$2a$10$rX8nS.hHQ5V5sMkFqJnUvuqzDaHx9X6JNxLkKY3P4bT1qG7ZmCvGW', '5567890123',  NULL);

-- Categorías
INSERT INTO categorias (nombre, descripcion, tipo) VALUES
('Labiales',         'Labiales líquidos, en barra y gloss',               'maquillaje'),
('Bases y BB Cream', 'Bases fluidas, en polvo y BB creams',               'maquillaje'),
('Rubores',          'Blush en polvo, crema y líquido',                   'maquillaje'),
('Sérums',           'Sérums hidratantes, antioxidantes y antiedad',      'skincare'),
('Cremas',           'Cremas hidratantes, equilibrantes y nutritivas',    'skincare'),
('Protectores',      'Protectores solares y filtros UV',                  'skincare');

-- Productos
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, tipo_piel) VALUES
('Labial Velvet Moon',      'Labial líquido de larga duración, acabado mate aterciopelado',   299.00, 45, 1, 'todos'),
('Base Lunar Glow FPS15',   'Base fluida con cobertura media y acabado luminoso natural',     499.00,  8, 2, 'grasa'),
('Blush Pink Lily',         'Rubor en polvo, tono rosa lila suave para look natural',         350.00, 32, 3, 'todos'),
('Sérum Hialurónico 2%',    'Sérum hidratante con ácido hialurónico de triple peso molecular',580.00,  3, 4, 'seca'),
('Crema Equilibrante Rosa', 'Crema ligera con niacinamida 5% y extracto de rosa búlgara',    450.00, 27, 5, 'mixta'),
('Protector Solar FPS50',   'Protector sin residuo blanco, toque seco inmediato',             490.00, 15, 6, 'grasa'),
('Labial Nude Velvet',      'Labial nude rosado de larga duración con vitamina E',            280.00, 38, 1, 'todos'),
('Sérum Vitamina C',        'Sérum antioxidante con vitamina C al 15% para piel opaca',      620.00,  6, 4, 'todos'),
('Crema Nutritiva Noche',   'Crema reparadora nocturna con retinol para piel seca',           550.00, 12, 5, 'seca');

-- Pedidos
INSERT INTO pedidos (cliente_id, total, estado, tracking, items_json) VALUES
(1, 648.00, 'entregado', 'SAU-2847', '[{"nombre":"Labial Velvet Moon","cantidad":2,"precio":299}]'),
(2, 499.00, 'enviado',   'SAU-2831', '[{"nombre":"Base Lunar Glow","cantidad":1,"precio":499}]'),
(3, 580.00, 'procesando','SAU-2819', '[{"nombre":"Sérum Hialurónico","cantidad":1,"precio":580}]'),
(4, 800.00, 'entregado', 'SAU-2804', '[{"nombre":"Blush Pink Lily","cantidad":1,"precio":350},{"nombre":"Protector Solar","cantidad":1,"precio":490}]'),
(5, 299.00, 'procesando','SAU-2798', '[{"nombre":"Labial Velvet Moon","cantidad":1,"precio":299}]');

-- Resultados de piel (Skin Match)
INSERT INTO resultados_piel (cliente_id, tipo_piel, hidratacion, sebo, sensibilidad, metodo) VALUES
(1, 'mixta',  62, 58, 35, 'cuestionario'),
(2, 'grasa',  45, 82, 40, 'camara'),
(3, 'seca',   78, 22, 55, 'cuestionario'),
(4, 'mixta',  60, 65, 30, 'camara'),
(5, 'grasa',  40, 88, 45, 'cuestionario');

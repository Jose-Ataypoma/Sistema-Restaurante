-- Usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'cashier',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categorías
CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(100),
    color VARCHAR(7),
    orden INTEGER,
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Productos
CREATE TABLE productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    categoria_id UUID NOT NULL REFERENCES categorias(id),
    imagen_url TEXT,
    disponible BOOLEAN DEFAULT TRUE,
    stock INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mesas
CREATE TABLE mesas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero INTEGER NOT NULL UNIQUE,
    asientos INTEGER NOT NULL DEFAULT 2,
    estado VARCHAR(50) NOT NULL DEFAULT 'libre',
    ocupada_desde TIMESTAMP,
    pedido_actual_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pedidos
CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mesa_id UUID REFERENCES mesas(id),
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    igv DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    metodo_pago VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completado_en TIMESTAMP
);

-- Detalle de Pedidos
CREATE TABLE detalle_pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES productos(id),
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pagos
CREATE TABLE pagos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    metodo VARCHAR(50) NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    vuelto DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Caja (Cash Register)
CREATE TABLE cajas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    abierta_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cerrada_en TIMESTAMP,
    monto_inicial DECIMAL(10, 2) NOT NULL,
    monto_final DECIMAL(10, 2),
    total_efectivo DECIMAL(10, 2) DEFAULT 0,
    total_tarjeta DECIMAL(10, 2) DEFAULT 0,
    total_yape DECIMAL(10, 2) DEFAULT 0,
    total_plin DECIMAL(10, 2) DEFAULT 0,
    estado VARCHAR(50) NOT NULL DEFAULT 'abierta'
);

-- Comprobantes SUNAT
CREATE TABLE comprobantes_sunat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo VARCHAR(50) NOT NULL,
    numero VARCHAR(50) NOT NULL UNIQUE,
    ruc VARCHAR(11),
    dni VARCHAR(8),
    pedido_id UUID NOT NULL REFERENCES pedidos(id),
    codigo_qr TEXT,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    mensaje_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clientes
CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20),
    ruc VARCHAR(11),
    dni VARCHAR(8),
    direccion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor performance
CREATE INDEX idx_pedidos_mesa_id ON pedidos(mesa_id);
CREATE INDEX idx_pedidos_usuario_id ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_detalle_pedidos_pedido_id ON detalle_pedidos(pedido_id);
CREATE INDEX idx_detalle_pedidos_producto_id ON detalle_pedidos(producto_id);
CREATE INDEX idx_productos_categoria_id ON productos(categoria_id);
CREATE INDEX idx_pagos_pedido_id ON pagos(pedido_id);
CREATE INDEX idx_cajas_usuario_id ON cajas(usuario_id);
CREATE INDEX idx_comprobantes_pedido_id ON comprobantes_sunat(pedido_id);

-- Datos iniciales
INSERT INTO categorias (nombre, descripcion, icono, color, orden) VALUES
    ('Entradas', 'Entradas y aperitivos', '🥗', '#10b981', 1),
    ('Fondos', 'Platos principales', '🍚', '#b833ff', 2),
    ('Bebidas', 'Bebidas variadas', '🥤', '#00ffff', 3),
    ('Postres', 'Postres y dulces', '🍰', '#fbbf24', 4);

INSERT INTO usuarios (username, email, password_hash, role) VALUES
    ('admin', 'admin@neopos.com', '$2b$10$xXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'admin'),
    ('cajero1', 'cajero1@neopos.com', '$2b$10$xXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'cashier'),
    ('cocinero1', 'cocinero1@neopos.com', '$2b$10$xXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'cook');

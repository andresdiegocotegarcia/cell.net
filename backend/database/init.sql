-- ============================================
-- CeluFix - Base de Datos PostgreSQL
-- Sistema de Gestión de Taller de Reparación
-- ============================================

-- Crear la base de datos
DROP DATABASE IF EXISTS celufix_db;
CREATE DATABASE celufix_db;

-- Conectar a la base de datos
\c celufix_db;

-- ============================================
-- TABLAS
-- ============================================

-- Tabla de usuarios del sistema
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'tecnico' CHECK (rol IN ('administrador', 'tecnico')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de órdenes de reparación
CREATE TABLE ordenes (
  id SERIAL PRIMARY KEY,
  numero_orden VARCHAR(20) UNIQUE NOT NULL,
  cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL,
  cliente_nombre VARCHAR(100) NOT NULL,
  marca VARCHAR(50) NOT NULL,
  modelo VARCHAR(50) NOT NULL,
  color VARCHAR(30),
  imei VARCHAR(15),
  condiciones_ingreso TEXT NOT NULL,
  accesorios TEXT,
  motivo_reparacion TEXT NOT NULL,
  contrasena_equipo VARCHAR(50),
  fecha_recepcion DATE NOT NULL DEFAULT CURRENT_DATE,
  estado VARCHAR(20) NOT NULL DEFAULT 'en_espera' CHECK (estado IN ('en_espera', 'en_reparacion', 'listo', 'entregado')),
  diagnostico TEXT,
  repuestos TEXT,
  procedimiento TEXT,
  costo DECIMAL(10,2),
  fecha_entrega DATE,
  condiciones_entrega TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Usuarios del sistema
INSERT INTO usuarios (nombre, email, password, rol) VALUES
  ('Admin CeluFix', 'admin@celufix.com', 'admin123', 'administrador'),
  ('Pedro Técnico', 'pedro@celufix.com', 'tecnico123', 'tecnico');

-- Clientes
INSERT INTO clientes (nombre, cedula, telefono, email) VALUES
  ('Juan Pérez', '1098765432', '3001234567', 'juan@email.com'),
  ('María López', '1087654321', '3109876543', 'maria@email.com'),
  ('Carlos García', '1076543210', '3205551234', 'carlos@email.com');

-- Órdenes de reparación
INSERT INTO ordenes (numero_orden, cliente_id, cliente_nombre, marca, modelo, color, imei, condiciones_ingreso, accesorios, motivo_reparacion, contrasena_equipo, fecha_recepcion, estado, diagnostico, repuestos, procedimiento, costo, fecha_entrega, condiciones_entrega) VALUES
  ('ORD-001', 1, 'Juan Pérez', 'Samsung', 'Galaxy S21', 'Negro', '356938035643809', 'Pantalla rota en esquina inferior derecha, rayones leves en la parte trasera, batería al 45%', 'Cargador original, forro silicona', 'Cambio de pantalla', '1234', '2026-07-01', 'en_reparacion', 'Pantalla LCD dañada, se requiere reemplazo completo del módulo', 'Pantalla LCD Samsung S21 original', 'Desmontaje de pantalla dañada, instalación de módulo nuevo, pruebas de tactil y display', 180000, NULL, NULL),
  ('ORD-002', 2, 'María López', 'iPhone', '13 Pro', 'Azul', '490154203237518', 'Equipo no enciende, sin daños físicos visibles, sin accesorios', 'Ninguno', 'No enciende', '', '2026-07-03', 'listo', 'Placa base con corto en chip de carga', 'Chip IC de carga iPhone 13 Pro', 'Microsoldadura del chip de carga, limpieza de placa, pruebas de encendido y carga', 120000, NULL, NULL),
  ('ORD-003', 3, 'Carlos García', 'Xiaomi', 'Redmi Note 12', 'Verde', '861536030196001', 'Batería se descarga rápido, hinchazón leve en tapa trasera', 'Cargador genérico', 'Cambio de batería', 'patron', '2026-06-28', 'entregado', 'Batería hinchada, requiere reemplazo inmediato', 'Batería original Xiaomi Redmi Note 12', 'Retiro de batería dañada, instalación de batería nueva, calibración de carga', 65000, '2026-07-02', 'Equipo funcionando correctamente, batería calibrada, se entrega con cargador genérico del cliente');

-- Índices para mejor rendimiento
CREATE INDEX idx_ordenes_estado ON ordenes(estado);
CREATE INDEX idx_ordenes_cliente_id ON ordenes(cliente_id);
CREATE INDEX idx_ordenes_numero ON ordenes(numero_orden);
CREATE INDEX idx_clientes_cedula ON clientes(cedula);

import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ============================================
// RUTAS DE AUTENTICACIÓN
// ============================================

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const result = await pool.query(
      'SELECT id, nombre, email, rol FROM usuarios WHERE LOWER(email) = LOWER($1) AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];
    res.json({ success: true, user: { nombre: user.nombre, email: user.email, rol: user.rol } });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si el email ya existe
    const existing = await pool.query(
      'SELECT id FROM usuarios WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'email_exists' });
    }

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
      [nombre, email, password, 'tecnico']
    );

    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Error en register:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ============================================
// RUTAS DE CLIENTES
// ============================================

// GET /api/clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo clientes:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/clientes
app.post('/api/clientes', async (req, res) => {
  try {
    const { nombre, cedula, telefono, email } = req.body;

    if (!nombre || !cedula || !telefono) {
      return res.status(400).json({ error: 'Nombre, cédula y teléfono son obligatorios' });
    }

    const result = await pool.query(
      'INSERT INTO clientes (nombre, cedula, telefono, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, cedula, telefono, email || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Ya existe un cliente con esa cédula' });
    }
    console.error('Error creando cliente:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ============================================
// RUTAS DE ÓRDENES
// ============================================

// GET /api/ordenes
app.get('/api/ordenes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ordenes ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo órdenes:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/ordenes/:id
app.get('/api/ordenes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM ordenes WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error obteniendo orden:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/ordenes
app.post('/api/ordenes', async (req, res) => {
  try {
    const {
      cliente_id, cliente_nombre, marca, modelo, color, imei,
      condiciones_ingreso, accesorios, motivo_reparacion, contrasena_equipo, fotos_recepcion
    } = req.body;

    if (!cliente_nombre || !marca || !modelo || !condiciones_ingreso || !motivo_reparacion) {
      return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    // Generar número de orden
    const countResult = await pool.query('SELECT COUNT(*) as total FROM ordenes');
    const nextNum = parseInt(countResult.rows[0].total) + 1;
    const numero_orden = `ORD-${String(nextNum).padStart(3, '0')}`;

    const result = await pool.query(
      `INSERT INTO ordenes (numero_orden, cliente_id, cliente_nombre, marca, modelo, color, imei, condiciones_ingreso, accesorios, motivo_reparacion, contrasena_equipo, fotos_recepcion, fecha_recepcion, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_DATE, 'en_espera')
       RETURNING *`,
      [numero_orden, cliente_id || null, cliente_nombre, marca, modelo, color || null, imei || null, condiciones_ingreso, accesorios || null, motivo_reparacion, contrasena_equipo || null, fotos_recepcion || []]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creando orden:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/ordenes/:id
app.put('/api/ordenes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verificar que la orden existe
    const existing = await pool.query('SELECT * FROM ordenes WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // Construir query dinámico
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = ['estado', 'diagnostico', 'repuestos', 'procedimiento', 'costo', 'fecha_entrega', 'condiciones_entrega', 'fotos_recepcion', 'fotos_entrega', 'marca', 'modelo', 'color', 'imei', 'condiciones_ingreso', 'accesorios', 'motivo_reparacion', 'contrasena_equipo', 'cliente_nombre'];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        fields.push(`${field} = $${paramIndex}`);
        values.push(updates[field]);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    // Agregar updated_at
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(id);
    const query = `UPDATE ordenes SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error actualizando orden:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/clientes/:id
app.put('/api/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cedula, telefono, email } = req.body;
    const result = await pool.query(
      'UPDATE clientes SET nombre = $1, cedula = $2, telefono = $3, email = $4 WHERE id = $5 RETURNING *',
      [nombre, cedula, telefono, email || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error actualizando cliente:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/clientes/:id
app.delete('/api/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM clientes WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ success: true, message: 'Cliente eliminado' });
  } catch (err) {
    console.error('Error eliminando cliente:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/ordenes/:id
app.delete('/api/ordenes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM ordenes WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    res.json({ success: true, message: 'Orden eliminada' });
  } catch (err) {
    console.error('Error eliminando orden:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ============================================
// RUTA DE SALUD
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CeluFix API funcionando correctamente' });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 CeluFix API corriendo en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   POST /api/auth/login`);
  console.log(`   POST /api/auth/register`);
  console.log(`   GET  /api/clientes`);
  console.log(`   POST /api/clientes`);
  console.log(`   GET  /api/ordenes`);
  console.log(`   GET  /api/ordenes/:id`);
  console.log(`   POST /api/ordenes`);
  console.log(`   PUT  /api/ordenes/:id`);
  console.log(`   GET  /api/health`);
});

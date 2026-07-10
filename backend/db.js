import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'celufix_db',
  password: 'admin',
  port: 5432,
});

// Verificar conexión al iniciar
pool.query('SELECT NOW()')
  .then(() => console.log('✅ Conectado a PostgreSQL - celufix_db'))
  .catch(err => console.error('❌ Error conectando a PostgreSQL:', err.message));

export default pool;

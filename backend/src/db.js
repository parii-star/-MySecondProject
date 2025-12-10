const { Pool } = require('pg');

const DEFAULT_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/appdb';

// Cloud SQL connection configuration
const getPoolConfig = () => {
  // If running on Cloud Run with Cloud SQL Unix socket
  if (process.env.DB_SOCKET_PATH) {
    return {
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'appdb',
      host: process.env.DB_SOCKET_PATH,
    };
  }
  
  // Use connection string for local or other deployments
  return {
    connectionString: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
    ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,
  };
};

const pool = new Pool(getPoolConfig());

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS entries (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

module.exports = {
  pool,
  initDb,
};

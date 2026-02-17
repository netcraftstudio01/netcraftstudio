import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool with Supabase support
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  // Enable SSL for Supabase (required for remote connections)
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('supabase') ? { rejectUnauthorized: false } : false,
});

// Test connection
pool.on('connect', () => {
  console.log('✓ Database connection pool established');
});

pool.on('error', (err) => {
  console.error('✗ Unexpected error on idle client:', err);
});

export const query = (text, params) => pool.query(text, params);

export const getClient = () => pool.connect();

// Initialize database schema
export const initializeDatabase = async () => {
  try {
    console.log('Testing database connection...');
    
    // Just test the connection, don't create tables (they're already in Supabase)
    await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful');
    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('✗ Error connecting to database:', error.message);
    console.error('Make sure:');
    console.error('1. Your Supabase credentials are correct in .env');
    console.error('2. The database tables are created in Supabase');
    console.error('3. Your internet connection is working');
  }
};

export default pool;

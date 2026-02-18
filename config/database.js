import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Shutdown flag to prevent multiple pool closures
let isShuttingDown = false;

// Detect environment
const isSupabase = process.env.DB_HOST && process.env.DB_HOST.includes('supabase'); 
const isLocal = !process.env.DB_HOST || process.env.DB_HOST === 'localhost';

console.log(`🔗 Database target: ${isSupabase ? 'Supabase PostgreSQL' : isLocal ? 'Local PostgreSQL' : 'Remote PostgreSQL'}`);

// Create SINGLE global PostgreSQL pool instance - DO NOT recreate during runtime
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  
  // SSL configuration for Supabase - more permissive for connection issues
  ssl: isSupabase ? { 
    rejectUnauthorized: false,
    require: true 
  } : false,
  
  // Adjusted pool configuration for Supabase compatibility
  max: isSupabase ? 2 : 10, // Supabase free tier limit vs generous local limit
  min: 0, // No minimum connections
  idleTimeoutMillis: 30000, // 30 seconds idle timeout
  connectionTimeoutMillis: 10000, // 10 second connection timeout (increased for Supabase)
  acquireTimeoutMillis: 15000, // 15 seconds to acquire from pool (increased)
  
  // Connection settings optimized for Supabase
  keepAlive: true, // Keep connections alive for reuse
  keepAliveInitialDelayMillis: 10000, // 10 second delay before first keepalive
  statement_timeout: 30000, // 30 second statement timeout
  query_timeout: 25000, // 25 second query timeout
  
  // Additional Supabase-specific settings
  application_name: 'netcraft-studio',
  ...(isSupabase && {
    options: '--search_path=public',
  })
});

// Enhanced pool monitoring with detailed logging
pool.on('connect', (client) => {
  console.log(`✓ Database connection established`);
  logPoolStatus('connect');
});

pool.on('acquire', (client) => {
  console.log(`→ Connection acquired from pool`);
  logPoolStatus('acquire');
});

pool.on('release', (client) => {
  console.log(`← Connection released to pool`);
  logPoolStatus('release');
});

pool.on('error', (err, client) => {
  console.error(`✗ Idle client error: ${err.message}`);
  logPoolStatus('error');
  // DO NOT call pool.end() here - let the pool handle recovery
});

pool.on('remove', (client) => {
  console.log(`🗑️  Client removed from pool`);
  logPoolStatus('remove');
});

// Helper function for consistent pool status logging
function logPoolStatus(event) {
  console.log(`📊 Pool Status [${event}] - Total: ${pool.totalCount}, Idle: ${pool.idleCount}, Waiting: ${pool.waitingCount}`);
}

// Main query function - uses pool.query() directly to prevent connection leaks
export const query = async (text, params = []) => {
  const startTime = Date.now();
  
  try {
    console.log(`🔍 Executing query...`);
    logPoolStatus('pre-query');
    
    // Use pool.query() directly - automatically handles connection acquire/release
    const result = await pool.query(text, params);
    
    const duration = Date.now() - startTime;
    console.log(`✅ Query completed successfully in ${duration}ms`);
    logPoolStatus('post-query');
    
    return result;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Query failed after ${duration}ms: ${error.message}`);
    logPoolStatus('query-error');
    
    // Log error details but DO NOT destroy the pool
    if (error.code) {
      console.error(`   Error Code: ${error.code}`);
    }
    
    // Retry logic for transient errors (optional)
    const transientErrors = ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'CONNECTION_ENDED'];
    if (transientErrors.includes(error.code)) {
      console.warn(`🔄 Transient error detected, query may be retried by the application`);
    }
    
    // For Supabase connection limit errors, provide helpful context
    if (error.message.includes('MaxClientsInSessionMode') || error.message.includes('max clients reached')) {
      console.warn(`⚠️  Supabase connection limit reached. This is normal for free tier.`);
      console.warn(`💡 The pool will recover automatically as connections are released.`);
    }
    
    // Re-throw the original error - DO NOT modify pool state
    throw error;
  }
};

// Health check function - simple and reliable
export const healthCheck = async () => {
  try {
    console.log('🏥 Health check: Testing database connection...');
    
    // Simple health check query - no manual connection handling
    await pool.query('SELECT 1 as health_check');
    
    console.log('✅ Health check passed');
    return { 
      status: 'healthy', 
      pool: {
        totalConnections: pool.totalCount,
        idleConnections: pool.idleCount,
        waitingClients: pool.waitingCount
      }
    };
    
  } catch (error) {
    console.error(`❌ Health check failed: ${error.message}`);
    return { 
      status: 'unhealthy', 
      error: error.message,
      pool: {
        totalConnections: pool.totalCount,
        idleConnections: pool.idleCount, 
        waitingClients: pool.waitingCount
      }
    };
  }
};

// Get pool statistics for monitoring
export const getPoolStats = () => {
  return {
    totalConnections: pool.totalCount,
    idleConnections: pool.idleCount,
    waitingClients: pool.waitingCount,
    maxConnections: pool.options.max,
    minConnections: pool.options.min || 0,
    isShuttingDown
  };
};

// Graceful shutdown function with proper flag handling
export const closePool = async () => {
  if (isShuttingDown) {
    console.log('⚠️  Pool shutdown already in progress, skipping...');
    return;
  }
  
  isShuttingDown = true;
  console.log('🔒 Gracefully closing database connection pool...');
  
  try {
    // End the pool - this will close all connections
    await pool.end();
    console.log('✅ Database connection pool closed successfully');
  } catch (error) {
    console.error(`❌ Error closing pool: ${error.message}`);
  }
};

// Single shutdown handler to prevent duplicate calls
const handleShutdown = async (signal) => {
  console.log(`📢 Received ${signal}. Initiating graceful shutdown...`);
  await closePool();
  process.exit(0);
};

// Process termination handlers - only close pool once
process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', async (error) => {
  console.error('💥 Uncaught Exception:', error);
  await closePool();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  await closePool(); 
  process.exit(1);
});

// Database initialization with comprehensive diagnostics
export const initializeDatabase = async () => {
  try {
    console.log('🔍 Initializing database connection...');
    console.log(`📊 Pool Configuration:`);
    console.log(`   Max Connections: ${pool.options.max}`);
    console.log(`   Min Connections: ${pool.options.min || 0}`);
    console.log(`   Idle Timeout: ${pool.options.idleTimeoutMillis}ms`);
    console.log(`   Connection Timeout: ${pool.options.connectionTimeoutMillis}ms`);
    console.log(`   Target: ${isSupabase ? 'Supabase' : isLocal ? 'Local' : 'Remote'} PostgreSQL`);
    
    // Environment validation
    if (isLocal && !process.env.DB_PASSWORD) {
      console.warn('⚠️  No database password configured!');
      console.warn('📝 Create .env file or set DB_PASSWORD environment variable');
    }
    
    // Test database connection
    const result = await query('SELECT NOW() as current_time, version() as postgres_version, current_database() as database_name');
    const dbInfo = result.rows[0];
    
    console.log('✅ Database connection successful!');
    console.log(`🕒 Server Time: ${dbInfo.current_time}`);
    console.log(`📋 PostgreSQL Version: ${dbInfo.postgres_version.split(' ')[0]}`);
    console.log(`🗄️  Database Name: ${dbInfo.database_name}`);
    console.log('✅ Database initialization complete');
    
    // Log initial pool status
    logPoolStatus('initialization');
    
  } catch (error) {
    console.error(`❌ Database initialization failed: ${error.message}`);
    
    // Provide helpful troubleshooting steps
    console.error('\n🔧 Troubleshooting Steps:');
    
    if (isLocal) {
      console.error('📝 LOCAL DATABASE:');
      console.error('   1. Install PostgreSQL locally');
      console.error('   2. Create database and user');
      console.error('   3. Set DB_HOST=localhost, DB_USER=postgres, DB_PASSWORD=your_password');
    } else if (isSupabase) {
      console.error('☁️  SUPABASE DATABASE:');
      console.error('   1. Verify Supabase project is active (not paused)');
      console.error('   2. Check connection string in Supabase dashboard');
      console.error('   3. Ensure database tables exist');
      console.error('   4. Free tier has connection limits (~2 concurrent)');
    } else {
      console.error('🌐 REMOTE DATABASE:');
      console.error('   1. Check network connectivity');
      console.error('   2. Verify firewall settings');
      console.error('   3. Confirm database credentials');
    }
    
    console.error('\n🌐 GENERAL:');
    console.error('   • Check internet connection');
    console.error('   • Verify .env file exists and has correct values');
    console.error('   • Restart development server');
    
    // Don't throw the error - let the app start and retry connections
    console.warn('⚠️  Continuing startup - database will retry connections as needed');
  }
};

// Export the pool instance for direct access if needed (use sparingly)
export { pool };

// Default export
export default pool;

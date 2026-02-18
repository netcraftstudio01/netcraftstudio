import { VercelRequest, VercelResponse } from '@vercel/node';
import { healthCheck, getPoolStats } from '../config/database.js';

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const startTime = Date.now();
  
  try {
    // Use the new healthCheck function - no manual connection handling
    const dbHealth = await healthCheck();
    const poolStats = getPoolStats();
    const responseTime = Date.now() - startTime;
    
    const response = {
      status: 'Server is running',
      database: dbHealth.status,
      email: 'configured',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      pool: {
        ...poolStats,
        health: dbHealth.pool
      }
    };

    // Return appropriate status code based on database health
    const statusCode = dbHealth.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(response);
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    res.status(500).json({
      status: 'Server is running',
      database: 'error',
      email: 'configured',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      pool: getPoolStats()
    });
  }
};

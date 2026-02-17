import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../config/database.js';

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Test database connection
    await query('SELECT NOW()');
    
    res.json({
      status: 'Server is running',
      database: 'connected',
      email: 'configured',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'Server is running',
      database: 'disconnected',
      email: 'configured',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
};

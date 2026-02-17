import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../../config/database.js';

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // GET all team members
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM team_members ORDER BY created_at DESC');
      return res.json(result.rows);
    }

    // CREATE team member
    if (req.method === 'POST') {
      const { name, role, image } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const result = await query(
        'INSERT INTO team_members (name, role, image) VALUES ($1, $2, $3) RETURNING *',
        [name, role || 'Team Member', image]
      );

      return res.status(201).json(result.rows[0]);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error processing team request:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

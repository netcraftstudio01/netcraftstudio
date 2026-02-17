import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../config/database.js';

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
    const { id } = req.query;

    // GET all team members or single team member
    if (req.method === 'GET') {
      if (id) {
        // Get single team member
        const result = await query('SELECT * FROM team_members WHERE id = $1', [id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Team member not found' });
        }
        return res.json(result.rows[0]);
      } else {
        // Get all team members
        const result = await query('SELECT * FROM team_members ORDER BY created_at DESC');
        return res.json(result.rows);
      }
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

    // UPDATE team member
    if (req.method === 'PUT') {
      if (!id) {
        return res.status(400).json({ error: 'Team member ID is required' });
      }

      const { name, role, image } = req.body;

      const result = await query(
        `UPDATE team_members SET
          name = $1, role = $2, image = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *`,
        [name, role, image, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Team member not found' });
      }

      return res.json(result.rows[0]);
    }

    // DELETE team member
    if (req.method === 'DELETE') {
      if (!id) {
        return res.status(400).json({ error: 'Team member ID is required' });
      }

      const result = await query('DELETE FROM team_members WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Team member not found' });
      }

      return res.json({ message: 'Team member deleted successfully', member: result.rows[0] });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error processing team request:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

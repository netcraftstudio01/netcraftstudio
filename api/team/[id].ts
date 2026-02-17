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
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Team member ID is required' });
    }

    // GET single team member
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM team_members WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Team member not found' });
      }
      return res.json(result.rows[0]);
    }

    // UPDATE team member
    if (req.method === 'PUT') {
      const { name, role, image, displayOrder } = req.body;

      const result = await query(
        `UPDATE team_members SET
          name = $1, role = $2, image = $3, display_order = $4, updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *`,
        [name, role, image, displayOrder ?? null, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Team member not found' });
      }

      return res.json(result.rows[0]);
    }

    // DELETE team member
    if (req.method === 'DELETE') {
      const result = await query('DELETE FROM team_members WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Team member not found' });
      }

      return res.json({ message: 'Team member deleted successfully', member: result.rows[0] });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error processing team member request:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

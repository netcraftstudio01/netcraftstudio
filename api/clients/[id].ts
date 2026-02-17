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
      return res.status(400).json({ error: 'Client ID is required' });
    }

    // GET single client
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM clients WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }
      return res.json(result.rows[0]);
    }

    // UPDATE client
    if (req.method === 'PUT') {
      const { name, image, alt } = req.body;

      const result = await query(
        `UPDATE clients SET
          name = $1, image = $2, alt = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *`,
        [name, image, alt, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }

      return res.json(result.rows[0]);
    }

    // DELETE client
    if (req.method === 'DELETE') {
      const result = await query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }

      return res.json({ message: 'Client deleted successfully', client: result.rows[0] });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error processing client request:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

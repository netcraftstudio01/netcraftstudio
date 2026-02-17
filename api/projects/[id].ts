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
      return res.status(400).json({ error: 'Project ID is required' });
    }

    // GET single project
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM portfolio_projects WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.json(result.rows[0]);
    }

    // UPDATE project
    if (req.method === 'PUT') {
      const {
        title,
        category,
        description,
        fullDescription,
        image,
        tags,
        features,
        technologies,
        year,
        client,
        liveUrl,
        sourceCodeUrl,
      } = req.body;

      const result = await query(
        `UPDATE portfolio_projects SET
          title = $1, category = $2, description = $3, full_description = $4,
          image = $5, tags = $6, features = $7, technologies = $8,
          year = $9, client = $10, live_url = $11, source_code_url = $12,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $13
        RETURNING *`,
        [
          title,
          category,
          description,
          fullDescription,
          image,
          JSON.stringify(tags),
          JSON.stringify(features),
          JSON.stringify(technologies),
          year,
          client,
          liveUrl,
          sourceCodeUrl,
          id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.json(result.rows[0]);
    }

    // DELETE project
    if (req.method === 'DELETE') {
      const result = await query('DELETE FROM portfolio_projects WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.json({ message: 'Project deleted successfully', project: result.rows[0] });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error processing project request:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

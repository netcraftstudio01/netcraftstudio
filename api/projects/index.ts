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
    // GET all projects
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM portfolio_projects ORDER BY created_at DESC');
      return res.json(result.rows);
    }

    // CREATE project
    if (req.method === 'POST') {
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

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const result = await query(
        `INSERT INTO portfolio_projects (
          title, category, description, full_description, image,
          tags, features, technologies, year, client, live_url, source_code_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *`,
        [
          title,
          category || 'Uncategorized',
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
        ]
      );

      return res.status(201).json(result.rows[0]);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error processing projects request:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

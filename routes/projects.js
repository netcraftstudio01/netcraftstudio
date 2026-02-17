import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM portfolio_projects ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM portfolio_projects WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create project
router.post('/', async (req, res) => {
  try {
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

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
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

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM portfolio_projects WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully', project: result.rows[0] });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;

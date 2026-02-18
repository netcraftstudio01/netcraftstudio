import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// Get all team members - optimized with caching
router.get('/', async (req, res) => {
  try {
    // Select only required fields: id, name, role, image, display_order
    const result = await query('SELECT id, name, role, image, display_order FROM team_members ORDER BY display_order ASC NULLS LAST, created_at DESC');
    
    // Set cache headers (cache for 10 minutes)
    res.set('Cache-Control', 'public, max-age=600');
    res.set('ETag', `W/"team-${result.rows.length}-${Date.now()}"`);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Get single team member
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM team_members WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ error: 'Failed to fetch team member' });
  }
});

// Create team member
router.post('/', async (req, res) => {
  try {
    const { name, role, image, displayOrder } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = await query(
      'INSERT INTO team_members (name, role, image, display_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, role || 'Team Member', image, displayOrder ?? null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

// Update team member
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
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

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

// Delete team member
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM team_members WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({ message: 'Team member deleted successfully', member: result.rows[0] });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

export default router;

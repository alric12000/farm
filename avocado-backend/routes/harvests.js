import { Router } from 'express';
import { getDb } from '../db/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/harvests — record a new harvest
router.post('/', requireAuth, (req, res) => {
    try {
        const { tree_id, harvest_date, quantity_kg, quality_grade, notes } = req.body;

        if (!tree_id || !harvest_date) {
            return res.status(400).json({ error: 'tree_id and harvest_date are required.' });
        }

        const db = getDb();
        const tree = db.prepare('SELECT * FROM trees WHERE id = ?').get(tree_id);

        if (!tree) {
            return res.status(404).json({ error: 'Tree not found.' });
        }

        // Insert harvest record
        const result = db.prepare(`
      INSERT INTO harvests (tree_id, harvest_date, quantity_kg, quality_grade, notes, recorded_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(tree_id, harvest_date, quantity_kg || null, quality_grade || null, notes || null, req.user.id);

        // Update tree's last_harvested and compute next_harvest_date
        const nextDate = new Date(harvest_date);
        nextDate.setDate(nextDate.getDate() + tree.harvest_interval_days);
        const next_harvest_date = nextDate.toISOString().split('T')[0];

        db.prepare(`
      UPDATE trees SET last_harvested = ?, next_harvest_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(harvest_date, next_harvest_date, tree_id);

        const harvest = db.prepare('SELECT * FROM harvests WHERE id = ?').get(result.lastInsertRowid);
        const updatedTree = db.prepare('SELECT * FROM trees WHERE id = ?').get(tree_id);

        res.status(201).json({
            harvest,
            tree: updatedTree,
            message: `Harvest recorded for tree ${tree.tree_no}. Next harvest expected on ${next_harvest_date}.`
        });
    } catch (err) {
        console.error('Record harvest error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET /api/harvests — list all harvests (optional ?tree_id= and ?limit=)
router.get('/', requireAuth, (req, res) => {
    try {
        const db = getDb();
        const { tree_id, limit } = req.query;
        const maxRows = parseInt(limit) || 50;

        let query = `
      SELECT h.*, t.tree_no, t.avocado_type
      FROM harvests h
      JOIN trees t ON h.tree_id = t.id
    `;
        const params = [];

        if (tree_id) {
            query += ' WHERE h.tree_id = ?';
            params.push(tree_id);
        }

        query += ' ORDER BY h.harvest_date DESC LIMIT ?';
        params.push(maxRows);

        const harvests = db.prepare(query).all(...params);
        res.json(harvests);
    } catch (err) {
        console.error('Get harvests error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET /api/harvests/alerts — trees that are overdue or due soon
router.get('/alerts', requireAuth, (req, res) => {
    try {
        const db = getDb();
        const trees = db.prepare(`
      SELECT * FROM trees
      WHERE status = 'active'
        AND next_harvest_date IS NOT NULL
        AND next_harvest_date <= date('now', '+7 days')
      ORDER BY next_harvest_date ASC
    `).all();

        const alerts = trees.map((tree) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const nextDate = new Date(tree.next_harvest_date);
            nextDate.setHours(0, 0, 0, 0);
            const days_remaining = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));

            let alert_type = 'soon';
            if (days_remaining < 0) alert_type = 'overdue';
            else if (days_remaining === 0) alert_type = 'today';

            return { ...tree, days_remaining, alert_type };
        });

        res.json({ count: alerts.length, alerts });
    } catch (err) {
        console.error('Get alerts error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET /api/harvests/stats — dashboard summary
router.get('/stats', requireAuth, (req, res) => {
    try {
        const db = getDb();

        const { total_trees } = db.prepare("SELECT COUNT(*) as total_trees FROM trees WHERE status = 'active'").get();
        const { total_harvests } = db.prepare('SELECT COUNT(*) as total_harvests FROM harvests').get();
        const { total_kg } = db.prepare('SELECT COALESCE(SUM(quantity_kg), 0) as total_kg FROM harvests').get();
        const { overdue } = db.prepare(`
      SELECT COUNT(*) as overdue FROM trees
      WHERE status = 'active' AND next_harvest_date < date('now')
    `).get();
        const { due_soon } = db.prepare(`
      SELECT COUNT(*) as due_soon FROM trees
      WHERE status = 'active'
        AND next_harvest_date >= date('now')
        AND next_harvest_date <= date('now', '+7 days')
    `).get();

        res.json({
            total_trees,
            total_harvests,
            total_kg_harvested: parseFloat(total_kg.toFixed(2)),
            overdue_trees: overdue,
            due_soon_trees: due_soon
        });
    } catch (err) {
        console.error('Get stats error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// DELETE /api/harvests/:id — delete a harvest record
router.delete('/:id', requireAuth, (req, res) => {
    try {
        const db = getDb();
        const harvest = db.prepare('SELECT * FROM harvests WHERE id = ?').get(req.params.id);

        if (!harvest) {
            return res.status(404).json({ error: 'Harvest record not found.' });
        }

        db.prepare('DELETE FROM harvests WHERE id = ?').run(req.params.id);

        res.json({ message: `Harvest record #${harvest.id} has been deleted.` });
    } catch (err) {
        console.error('Delete harvest error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;

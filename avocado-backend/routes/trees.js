import { Router } from 'express';
import { getDb } from '../db/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Utility: compute days_remaining and harvest_status for a tree
function enrichTree(tree) {
    let days_remaining = null;
    let harvest_status = 'scheduled';

    if (tree.next_harvest_date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextDate = new Date(tree.next_harvest_date);
        nextDate.setHours(0, 0, 0, 0);
        days_remaining = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));

        if (days_remaining < 0) harvest_status = 'overdue';
        else if (days_remaining === 0) harvest_status = 'today';
        else if (days_remaining <= 7) harvest_status = 'soon';
        else harvest_status = 'scheduled';
    }

    return { ...tree, days_remaining, harvest_status };
}

// GET /api/trees — all trees with computed fields
router.get('/', requireAuth, (req, res) => {
    try {
        const db = getDb();
        const trees = db.prepare('SELECT * FROM trees ORDER BY tree_no').all();

        const enriched = trees.map((tree) => {
            const { count } = db.prepare('SELECT COUNT(*) as count FROM harvests WHERE tree_id = ?').get(tree.id);
            return { ...enrichTree(tree), total_harvests: count };
        });

        res.json(enriched);
    } catch (err) {
        console.error('Get trees error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET /api/trees/:id — single tree with harvests
router.get('/:id', requireAuth, (req, res) => {
    try {
        const db = getDb();
        const tree = db.prepare('SELECT * FROM trees WHERE id = ?').get(req.params.id);

        if (!tree) {
            return res.status(404).json({ error: 'Tree not found.' });
        }

        const harvests = db.prepare(
            'SELECT * FROM harvests WHERE tree_id = ? ORDER BY harvest_date DESC'
        ).all(req.params.id);

        const { count } = db.prepare('SELECT COUNT(*) as count FROM harvests WHERE tree_id = ?').get(tree.id);

        res.json({
            ...enrichTree(tree),
            total_harvests: count,
            harvests
        });
    } catch (err) {
        console.error('Get tree error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// POST /api/trees — create a new tree
router.post('/', requireAuth, (req, res) => {
    try {
        const { tree_no, avocado_type, planted_date, location, harvest_interval_days, last_harvested, notes } = req.body;

        if (!tree_no || !avocado_type) {
            return res.status(400).json({ error: 'tree_no and avocado_type are required.' });
        }

        const db = getDb();
        const existing = db.prepare('SELECT id FROM trees WHERE tree_no = ?').get(tree_no);
        if (existing) {
            return res.status(409).json({ error: `Tree with tree_no "${tree_no}" already exists.` });
        }

        const interval = harvest_interval_days || 120;
        let next_harvest_date = null;

        if (last_harvested) {
            const lastDate = new Date(last_harvested);
            lastDate.setDate(lastDate.getDate() + interval);
            next_harvest_date = lastDate.toISOString().split('T')[0];
        }

        const result = db.prepare(`
      INSERT INTO trees (tree_no, avocado_type, planted_date, location, harvest_interval_days, last_harvested, next_harvest_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(tree_no, avocado_type, planted_date || null, location || null, interval, last_harvested || null, next_harvest_date, notes || null);

        const newTree = db.prepare('SELECT * FROM trees WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json(enrichTree(newTree));
    } catch (err) {
        console.error('Create tree error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// PATCH /api/trees/:id — update a tree
router.patch('/:id', requireAuth, (req, res) => {
    try {
        const db = getDb();
        const tree = db.prepare('SELECT * FROM trees WHERE id = ?').get(req.params.id);

        if (!tree) {
            return res.status(404).json({ error: 'Tree not found.' });
        }

        const allowedFields = ['avocado_type', 'planted_date', 'location', 'harvest_interval_days', 'notes', 'status'];
        const updates = [];
        const values = [];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates.push(`${field} = ?`);
                values.push(req.body[field]);
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No valid fields to update.' });
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(req.params.id);

        db.prepare(`UPDATE trees SET ${updates.join(', ')} WHERE id = ?`).run(...values);

        // If harvest_interval_days changed, recalculate next_harvest_date
        if (req.body.harvest_interval_days !== undefined && tree.last_harvested) {
            const lastDate = new Date(tree.last_harvested);
            lastDate.setDate(lastDate.getDate() + req.body.harvest_interval_days);
            const next_harvest_date = lastDate.toISOString().split('T')[0];
            db.prepare('UPDATE trees SET next_harvest_date = ? WHERE id = ?').run(next_harvest_date, req.params.id);
        }

        const updatedTree = db.prepare('SELECT * FROM trees WHERE id = ?').get(req.params.id);
        res.json(enrichTree(updatedTree));
    } catch (err) {
        console.error('Update tree error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// DELETE /api/trees/:id — delete a tree (harvests cascade)
router.delete('/:id', requireAuth, (req, res) => {
    try {
        const db = getDb();
        const tree = db.prepare('SELECT * FROM trees WHERE id = ?').get(req.params.id);

        if (!tree) {
            return res.status(404).json({ error: 'Tree not found.' });
        }

        db.prepare('DELETE FROM trees WHERE id = ?').run(req.params.id);

        res.json({ message: `Tree ${tree.tree_no} and all its harvest records have been deleted.` });
    } catch (err) {
        console.error('Delete tree error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// POST /api/trees/import — bulk import trees from CSV data
router.post('/import', requireAuth, (req, res) => {
    try {
        const { trees: treeRows } = req.body;

        if (!Array.isArray(treeRows) || treeRows.length === 0) {
            return res.status(400).json({ error: 'Request body must contain a non-empty "trees" array.' });
        }

        const db = getDb();
        const insertStmt = db.prepare(`
      INSERT INTO trees (tree_no, avocado_type, planted_date, location, harvest_interval_days, last_harvested, next_harvest_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const imported = [];
        const skipped = [];

        const insertAll = db.transaction(() => {
            for (const row of treeRows) {
                const tree_no = (row.tree_no || '').trim();
                const avocado_type = (row.avocado_type || '').trim();

                if (!tree_no || !avocado_type) {
                    skipped.push({ tree_no: tree_no || '(empty)', reason: 'Missing tree_no or avocado_type' });
                    continue;
                }

                const existing = db.prepare('SELECT id FROM trees WHERE tree_no = ?').get(tree_no);
                if (existing) {
                    skipped.push({ tree_no, reason: 'Duplicate tree_no' });
                    continue;
                }

                const interval = parseInt(row.harvest_interval_days) || 120;
                const last_harvested = row.last_harvested || null;
                let next_harvest_date = null;

                if (last_harvested) {
                    const lastDate = new Date(last_harvested);
                    lastDate.setDate(lastDate.getDate() + interval);
                    next_harvest_date = lastDate.toISOString().split('T')[0];
                }

                insertStmt.run(
                    tree_no,
                    avocado_type,
                    row.planted_date || null,
                    row.location || null,
                    interval,
                    last_harvested,
                    next_harvest_date,
                    row.notes || null
                );

                imported.push(tree_no);
            }
        });

        insertAll();

        res.status(201).json({
            message: `Imported ${imported.length} trees. ${skipped.length} skipped.`,
            imported_count: imported.length,
            skipped_count: skipped.length,
            skipped,
        });
    } catch (err) {
        console.error('Import trees error:', err);
        res.status(500).json({ error: 'Import failed: ' + err.message });
    }
});

export default router;

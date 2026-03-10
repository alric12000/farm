import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'farm.db');

let db;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function initializeDatabase() {
  const db = getDb();

  // ── Create tables ──────────────────────────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'farmer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS trees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tree_no TEXT UNIQUE NOT NULL,
      avocado_type TEXT NOT NULL,
      planted_date DATE,
      location TEXT,
      harvest_interval_days INTEGER DEFAULT 120,
      last_harvested DATE,
      next_harvest_date DATE,
      notes TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS harvests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tree_id INTEGER NOT NULL,
      harvest_date DATE NOT NULL,
      quantity_kg REAL,
      quality_grade TEXT,
      notes TEXT,
      recorded_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tree_id) REFERENCES trees(id) ON DELETE CASCADE,
      FOREIGN KEY (recorded_by) REFERENCES users(id)
    );
  `);

  // ── Seed admin user ────────────────────────────────────────────
  const existingAdmin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync('farm1234', 10);
    db.prepare(
      'INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)'
    ).run('admin', hashedPassword, 'Farm Administrator', 'admin');
    console.log('✅ Seeded admin user (admin / farm1234)');
  }

  // ── Seed sample trees ─────────────────────────────────────────
  const treeCount = db.prepare('SELECT COUNT(*) as count FROM trees').get().count;
  if (treeCount === 0) {
    const sampleTrees = [
      {
        tree_no: 'AVO-001',
        avocado_type: 'Hass',
        planted_date: '2023-03-15',
        location: 'Block A - North Slope',
        harvest_interval_days: 120,
        last_harvested: '2025-11-10',
        notes: 'Mature tree, consistent producer'
      },
      {
        tree_no: 'AVO-002',
        avocado_type: 'Fuerte',
        planted_date: '2023-06-20',
        location: 'Block A - East Ridge',
        harvest_interval_days: 110,
        last_harvested: '2025-12-05',
        notes: 'Green-skinned variety, good yield'
      },
      {
        tree_no: 'AVO-003',
        avocado_type: 'Reed',
        planted_date: '2024-01-10',
        location: 'Block B - Valley Floor',
        harvest_interval_days: 130,
        last_harvested: '2025-10-20',
        notes: 'Large round fruit, excellent flavor'
      },
      {
        tree_no: 'AVO-004',
        avocado_type: 'Bacon',
        planted_date: '2024-04-05',
        location: 'Block B - South Terrace',
        harvest_interval_days: 100,
        last_harvested: '2026-01-15',
        notes: 'Cold-hardy variety, mild taste'
      },
      {
        tree_no: 'AVO-005',
        avocado_type: 'Pinkerton',
        planted_date: '2024-07-22',
        location: 'Block C - Hilltop',
        harvest_interval_days: 115,
        last_harvested: '2026-02-01',
        notes: 'Elongated pear shape, small seed'
      }
    ];

    const insertTree = db.prepare(`
      INSERT INTO trees (tree_no, avocado_type, planted_date, location, harvest_interval_days, last_harvested, next_harvest_date, notes)
      VALUES (@tree_no, @avocado_type, @planted_date, @location, @harvest_interval_days, @last_harvested, @next_harvest_date, @notes)
    `);

    const insertMany = db.transaction((trees) => {
      for (const tree of trees) {
        // Calculate next_harvest_date from last_harvested + interval
        const lastDate = new Date(tree.last_harvested);
        lastDate.setDate(lastDate.getDate() + tree.harvest_interval_days);
        const next_harvest_date = lastDate.toISOString().split('T')[0];

        insertTree.run({ ...tree, next_harvest_date });
      }
    });

    insertMany(sampleTrees);
    console.log('✅ Seeded 5 sample avocado trees');
  }

  console.log('✅ Database initialized successfully');
  return db;
}

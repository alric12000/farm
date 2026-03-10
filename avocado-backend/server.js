import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import treesRoutes from './routes/trees.js';
import harvestsRoutes from './routes/harvests.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/trees', treesRoutes);
app.use('/api/harvests', harvestsRoutes);

// ── Health check ─────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        name: 'Ghordaura Krishi Farm API',
        timestamp: new Date().toISOString()
    });
});

// ── 404 handler ──────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// ── Error handler ────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error.' });
});

// ── Start ────────────────────────────────────────────────────────
initializeDatabase();

app.listen(PORT, () => {
    console.log(`\n🥑 Ghordaura Krishi Farm API`);
    console.log(`   Running on http://localhost:${PORT}`);
    console.log(`   Health:     http://localhost:${PORT}/api/health\n`);
});

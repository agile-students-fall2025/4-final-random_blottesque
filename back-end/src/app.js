import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import groupsRouter from './routes/groups.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Core middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// Static files
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'roomier', ts: Date.now() }));

// Domain routes
app.use('/api', groupsRouter);

// 404 for unknown API paths
app.use('/api/*', (_req, res) => res.status(404).json({ error: 'Not Found' }));

export default app;

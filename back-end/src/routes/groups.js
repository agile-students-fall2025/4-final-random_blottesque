import { Router } from 'express';
import { db } from '../data/store.js';

const r = Router();

// List groups
r.get('/groups', (_req, res) => {
  res.json(db.listGroups());
});

// Create group
r.post('/groups', (req, res) => {
  const g = db.createGroup(req.body || {});
  res.status(201).json(g);
});

// Read group
r.get('/groups/:id', (req, res) => {
  const g = db.getGroup(req.params.id);
  if (!g) return res.status(404).json({ error: 'Group not found' });
  res.json(g);
});

// Update group
r.put('/groups/:id', (req, res) => {
  const g = db.updateGroup(req.params.id, req.body || {});
  if (!g) return res.status(404).json({ error: 'Group not found' });
  res.json(g);
});

// Dashboard aggregate
r.get('/groups/:id/dashboard', (req, res) => {
  const d = db.dashboard(req.params.id);
  if (!d) return res.status(404).json({ error: 'Group not found' });
  res.json(d);
});

// Preferences only
r.get('/groups/:id/prefs', (req, res) => {
  const g = db.getGroup(req.params.id);
  if (!g) return res.status(404).json({ error: 'Group not found' });
  res.json(g.prefs);
});

r.put('/groups/:id/prefs', (req, res) => {
  const g = db.getGroup(req.params.id);
  if (!g) return res.status(404).json({ error: 'Group not found' });
  g.prefs = { ...g.prefs, ...(req.body || {}) };
  res.json(g.prefs);
});

export default r;

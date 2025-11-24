import { Router } from 'express';
import { db } from '../data/store.js';
import '../data/db.mjs';

const r = Router();

r.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = db.getUserByEmail(email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({ token: `mock-token-${user.id}`, userId: user.id });
});

r.post('/signup', (req, res) => {
  const { email, password } = req.body;
  
  const newUser = db.createUser({ email, password });
  
  if (!newUser) {
    return res.status(409).json({ error: 'User already exists' });
  }
  
  res.status(201).json({ id: newUser.id, email: newUser.email });
});

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

// Inventory only
r.get('/groups/:id/inventory', (req, res) => {
  const g = db.getGroup(req.params.id);
  if (!g) return res.status(404).json({ error: 'Group not found' });
  res.json(g.inventory);
});

r.put('/groups/:id/inventory', (req, res) => {
  const g = db.getGroup(req.params.id);
  if (!g) return res.status(404).json({ error: 'Group not found' });
  g.inventory = { ...g.inventory, ...(req.body || {}) };
  res.json(g.inventory);
});


// Get chores only
r.get('/groups/:id/chores', (req, res) => {
  const g = db.getGroup(req.params.id);
  if (!g) return res.status(404).json({ error: 'Group not found' });
  res.json(g.chores);
});

// Add chore
r.post('/groups/:id/chores', (req, res) => {
  const chore = db.createChore(req.params.id, req.body || {});
  if (!chore) return res.status(404).json({ error: 'Group not found' });
  res.status(201).json(chore);
});

// Edit chore (or update done status)
r.put('/groups/:id/chores/:cid', (req, res) => {
  const chore = db.updateChore(req.params.id, req.params.cid, req.body || {});
  if (!chore) return res.status(404).json({ error: 'Chore not found' });
  res.json(chore);
});

// Delete chore
r.delete('/groups/:gid/chores/:cid', (req, res) => {
  const ok = db.deleteChore(req.params.gid, req.params.cid);
  if (!ok) return res.status(404).json({ error: 'Chore not found' });
  res.json({ ok: true });
});

export default r;

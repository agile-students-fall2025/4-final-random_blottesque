import { Router } from 'express';
import { db } from '../data/store.js';

const router = Router();

/**
 * POST /api/signup
 * Body: { email, password, name? }
 * 201 -> { id, email, name?, ... } (no password)
 */
router.post('/signup', (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const existing = db.getUserByEmail(email);
  if (existing) return res.status(409).json({ error: 'email already registered' });

  const user = db.createUser({ email, password, name });
  return res.status(201).json(db.sanitizeUser(user));
});

/**
 * POST /api/login
 * Body: { email, password }
 * 200 -> { token, user }
 * 401 -> { error }
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const user = db.getUserByEmail(email);
  if (!db.verifyUserPassword(user, password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = db.issueToken(user.id);
  return res.json({ token, user: db.sanitizeUser(user) });
});

export default router;

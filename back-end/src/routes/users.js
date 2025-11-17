import { Router } from 'express';
import { db } from '../data/store.js';

const router = Router();

/**
 * GET /api/users/:id
 * 200 -> sanitized user
 * 404 -> { error }
 */
router.get('/users/:id', (req, res) => {
  const user = db.getUser(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json(db.sanitizeUser(user));
});

/**
 * PUT /api/users/:id
 * Body: { name?, phone?, photoUrl? }
 * 200 -> sanitized updated user
 * 404 -> { error }
 */
router.put('/users/:id', (req, res) => {
  const updated = db.updateUser(req.params.id, req.body || {});
  if (!updated) return res.status(404).json({ error: 'User not found' });
  return res.json(db.sanitizeUser(updated));
});

export default router;

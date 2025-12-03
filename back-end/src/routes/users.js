import { Router } from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { validateUpdateUser } from '../middleware/validators.js';

const router = Router();

/**
 * GET /api/users/:id
 * Get user by ID
 * Returns: user object (without password)
 */
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to get user' });
  }
});

/**
 * PUT /api/users/:id
 * Update user profile
 * Body: { name?, phone?, photoUrl? }
 * Returns: updated user object
 */
router.put('/users/:id', authenticate, validateUpdateUser, async (req, res) => {
  try {
    const { name, phone, photoUrl } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * DELETE /api/users/:id
 * Delete user account (protected)
 */
router.delete('/users/:id', authenticate, async (req, res) => {
  try {
    // Only allow users to delete their own account
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Not authorized to delete this account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ ok: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
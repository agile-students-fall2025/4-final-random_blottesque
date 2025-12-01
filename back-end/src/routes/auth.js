import { Router } from 'express';
import User from '../models/User.js';
import { generateToken, authenticate } from '../middleware/auth.js';
import { validateSignup, validateLogin } from '../middleware/validators.js';

const router = Router();

/**
 * POST /api/signup
 * Register a new user
 * Body: { email, password, name? }
 * Returns: { token, user }
 */
router.post('/signup', validateSignup, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name: name || email.split('@')[0]
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Failed to create account' });
  }
});

/**
 * POST /api/login
 * Authenticate user and return token
 * Body: { email, password }
 * Returns: { token, user }
 */
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * GET /api/me
 * Get current authenticated user
 * Requires: Bearer token
 * Returns: user object
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

/**
 * POST /api/logout
 * Logout user (client-side token removal)
 * Returns: { ok: true }
 */
router.post('/logout', (req, res) => {
  // JWT tokens are stateless, so logout is handled client-side
  // This endpoint is for API completeness
  res.json({ ok: true, message: 'Logged out successfully' });
});

export default router;
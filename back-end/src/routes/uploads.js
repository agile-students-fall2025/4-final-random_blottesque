import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import Group from '../models/Group.js';

const router = Router();

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.params.type || 'misc';
    const typeDir = path.join(uploadsDir, type);
    
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }
    
    cb(null, typeDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: id-timestamp.ext
    const id = req.params.id || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${id}-${timestamp}${ext}`);
  }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }
};

// Multer upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  }
});

/**
 * POST /api/uploads/profile/:id
 * Upload user profile picture
 */
router.post('/uploads/profile/:id', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Verify user is uploading their own photo
    if (req.user._id.toString() !== req.params.id) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    // Build the photo URL
    const photoUrl = `/uploads/profile/${req.file.filename}`;

    // Update user's photoUrl in database
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { photoUrl },
      { new: true }
    ).select('-password');

    if (!user) {
      // Delete uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      photoUrl,
      user
    });
  } catch (error) {
    console.error('Profile upload error:', error);
    // Clean up file if error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

/**
 * POST /api/uploads/group/:id
 * Upload group picture
 */
router.post('/uploads/group/:id', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Find group and verify user is a member
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is creator or member
    const isCreator = group.createdBy?.toString() === req.user._id.toString();
    const isMember = group.members?.some(m => m.toString() === req.user._id.toString());
    
    if (!isCreator && !isMember) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ error: 'Not authorized to update this group' });
    }

    // Build the photo URL
    const photoUrl = `/uploads/group/${req.file.filename}`;

    // Update group's photoUrl
    group.photoUrl = photoUrl;
    await group.save();

    res.json({
      success: true,
      message: 'Group picture uploaded successfully',
      photoUrl,
      group
    });
  } catch (error) {
    console.error('Group upload error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to upload group picture' });
  }
});

/**
 * DELETE /api/uploads/profile/:id
 * Remove user profile picture
 */
router.delete('/uploads/profile/:id', authenticate, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old file if exists
    if (user.photoUrl && user.photoUrl.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '../..', user.photoUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Clear photoUrl
    user.photoUrl = null;
    await user.save();

    res.json({
      success: true,
      message: 'Profile picture removed',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Delete profile pic error:', error);
    res.status(500).json({ error: 'Failed to remove profile picture' });
  }
});

/**
 * DELETE /api/uploads/group/:id
 * Remove group picture
 */
router.delete('/uploads/group/:id', authenticate, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check authorization
    const isCreator = group.createdBy?.toString() === req.user._id.toString();
    const isMember = group.members?.some(m => m.toString() === req.user._id.toString());
    
    if (!isCreator && !isMember) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Delete old file if exists
    if (group.photoUrl && group.photoUrl.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '../..', group.photoUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Clear photoUrl
    group.photoUrl = null;
    await group.save();

    res.json({
      success: true,
      message: 'Group picture removed',
      group
    });
  } catch (error) {
    console.error('Delete group pic error:', error);
    res.status(500).json({ error: 'Failed to remove group picture' });
  }
});

export default router;

import express from 'express';
// Import the middleware
import { protect } from '../middleware/authMiddleware.js';
// Import the controller functions
import { getProfile, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

// These routes are both protected by the `protect` middleware
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;  
import User from '../models/user.model.js';
import mongoose from 'mongoose';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (protected)
export const getProfile = async (req, res) => {
    // The `protect` middleware adds the authenticated user's details to req.user
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                website: user.website,
                role: user.role
            }
        });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (protected)
export const updateProfile = async (req, res) => {
    const { username, email, bio, website } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.website = website || user.website;

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            data: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio,
                website: updatedUser.website,
                role: updatedUser.role
            },
            message: 'Profile updated successfully'
        });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
};
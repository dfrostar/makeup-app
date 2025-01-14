const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { validateProfileUpdate } = require('../middleware/validation');
const { User } = require('../models');
const { uploadImage } = require('../utils/imageUpload');

// Get user profile
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-password')
            .populate('profile.favoriteProducts')
            .populate('profile.savedLooks');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.profile);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
});

// Update user profile
router.put('/', auth, validateProfileUpdate, async (req, res) => {
    try {
        const {
            name,
            skinType,
            skinConcerns,
            preferredBrands,
            notifications,
            newsletter
        } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update profile fields
        if (name) user.profile.name = name;
        if (skinType) user.profile.skinType = skinType;
        if (skinConcerns) user.profile.skinConcerns = skinConcerns;
        if (preferredBrands) user.profile.preferredBrands = preferredBrands;
        
        // Update preferences
        if (typeof notifications !== 'undefined') {
            user.preferences.notifications = notifications;
        }
        if (typeof newsletter !== 'undefined') {
            user.preferences.newsletter = newsletter;
        }

        await user.save();
        res.json(user.profile);
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
});

// Upload profile picture
router.post('/picture', auth, uploadImage.single('picture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profile.picture = req.file.path;
        await user.save();

        res.json({ picture: user.profile.picture });
    } catch (error) {
        console.error('Profile picture upload error:', error);
        res.status(500).json({ message: 'Server error while uploading picture' });
    }
});

// Add favorite product
router.post('/favorites/products/:productId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { productId } = req.params;
        if (!user.profile.favoriteProducts.includes(productId)) {
            user.profile.favoriteProducts.push(productId);
            await user.save();
        }

        res.json(user.profile.favoriteProducts);
    } catch (error) {
        console.error('Add favorite product error:', error);
        res.status(500).json({ message: 'Server error while adding favorite' });
    }
});

// Remove favorite product
router.delete('/favorites/products/:productId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { productId } = req.params;
        user.profile.favoriteProducts = user.profile.favoriteProducts
            .filter(id => id.toString() !== productId);
        await user.save();

        res.json(user.profile.favoriteProducts);
    } catch (error) {
        console.error('Remove favorite product error:', error);
        res.status(500).json({ message: 'Server error while removing favorite' });
    }
});

// Save look
router.post('/looks/:lookId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { lookId } = req.params;
        if (!user.profile.savedLooks.includes(lookId)) {
            user.profile.savedLooks.push(lookId);
            await user.save();
        }

        res.json(user.profile.savedLooks);
    } catch (error) {
        console.error('Save look error:', error);
        res.status(500).json({ message: 'Server error while saving look' });
    }
});

// Remove saved look
router.delete('/looks/:lookId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { lookId } = req.params;
        user.profile.savedLooks = user.profile.savedLooks
            .filter(id => id.toString() !== lookId);
        await user.save();

        res.json(user.profile.savedLooks);
    } catch (error) {
        console.error('Remove saved look error:', error);
        res.status(500).json({ message: 'Server error while removing look' });
    }
});

// Get user activity
router.get('/activity', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user's recent activity
        const activity = await Promise.all([
            // Get recent reviews
            Review.find({ user: user._id })
                .sort('-createdAt')
                .limit(5)
                .populate('product'),
            
            // Get recent looks
            Look.find({ creator: user._id })
                .sort('-createdAt')
                .limit(5),
            
            // Get recent comments
            Comment.find({ user: user._id })
                .sort('-createdAt')
                .limit(5)
                .populate('parentId')
        ]);

        res.json({
            reviews: activity[0],
            looks: activity[1],
            comments: activity[2]
        });
    } catch (error) {
        console.error('Activity fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching activity' });
    }
});

module.exports = router;

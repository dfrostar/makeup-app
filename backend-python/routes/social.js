const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User, Look, Product } = require('../models');

// Follow a user
router.post('/follow/:userId', auth, async (req, res) => {
    try {
        if (req.user.id === req.params.userId) {
            return res.status(400).json({ message: 'Cannot follow yourself' });
        }

        const userToFollow = await User.findById(req.params.userId);
        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = await User.findById(req.user.id);
        if (user.following.includes(req.params.userId)) {
            return res.status(400).json({ message: 'Already following this user' });
        }

        user.following.push(req.params.userId);
        userToFollow.followers.push(req.user.id);

        await Promise.all([user.save(), userToFollow.save()]);

        res.json({ message: 'Successfully followed user' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Unfollow a user
router.post('/unfollow/:userId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const userToUnfollow = await User.findById(req.params.userId);

        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.following = user.following.filter(id => id.toString() !== req.params.userId);
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req.user.id);

        await Promise.all([user.save(), userToUnfollow.save()]);

        res.json({ message: 'Successfully unfollowed user' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Share a look
router.post('/share/:lookId', auth, async (req, res) => {
    try {
        const look = await Look.findById(req.params.lookId);
        if (!look) {
            return res.status(404).json({ message: 'Look not found' });
        }

        const user = await User.findById(req.user.id);
        user.sharedLooks.push({
            look: req.params.lookId,
            sharedAt: new Date()
        });

        look.shares += 1;

        await Promise.all([user.save(), look.save()]);

        res.json({ message: 'Look shared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user's social feed
router.get('/feed', auth, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const user = await User.findById(req.user.id);

        const feed = await Look.find({
            $or: [
                { creator: { $in: user.following } },
                { 'likes': { $in: user.following } }
            ]
        })
        .populate('creator', 'username profileImage')
        .populate('products.product', 'name brand image')
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit);

        const total = await Look.countDocuments({
            $or: [
                { creator: { $in: user.following } },
                { 'likes': { $in: user.following } }
            ]
        });

        res.json({
            feed,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user's activity
router.get('/activity', auth, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const user = await User.findById(req.user.id)
            .populate({
                path: 'activity',
                options: {
                    sort: { createdAt: -1 },
                    skip: (page - 1) * limit,
                    limit: limit
                },
                populate: {
                    path: 'look product user',
                    select: 'name title username profileImage'
                }
            });

        res.json({
            activity: user.activity,
            totalPages: Math.ceil(user.activity.length / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

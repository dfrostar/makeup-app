const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analytics');
const auth = require('../middleware/auth');

// Track user activity
router.post('/track', auth, async (req, res) => {
    try {
        const { activityType, details } = req.body;
        await analyticsService.trackActivity(req.user.id, activityType, details);
        res.status(200).json({ message: 'Activity tracked successfully' });
    } catch (error) {
        console.error('Activity tracking error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get product analytics
router.get('/product/:productId', auth, async (req, res) => {
    try {
        const { productId } = req.params;
        const { period } = req.query;
        const analytics = await analyticsService.getProductAnalytics(productId, period);
        res.json(analytics);
    } catch (error) {
        console.error('Product analytics error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get look analytics
router.get('/look/:lookId', auth, async (req, res) => {
    try {
        const { lookId } = req.params;
        const { period } = req.query;
        const analytics = await analyticsService.getLookAnalytics(lookId, period);
        res.json(analytics);
    } catch (error) {
        console.error('Look analytics error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get trending content
router.get('/trending', async (req, res) => {
    try {
        const trending = await analyticsService.getTrendingAnalytics();
        res.json(trending);
    } catch (error) {
        console.error('Trending analytics error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user engagement score
router.get('/engagement/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        // Check if user is requesting their own score or is an admin
        if (req.user.id !== userId && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }
        const score = await analyticsService.updateUserEngagement(userId);
        res.json({ engagementScore: score });
    } catch (error) {
        console.error('Engagement score error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

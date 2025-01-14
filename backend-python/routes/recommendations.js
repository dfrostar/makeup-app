const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Product, Look, User } = require('../models');
const { recommendationEngine } = require('../services/recommendationEngine');

// Get personalized product recommendations
router.get('/products', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('recentlyViewed.products')
            .populate('favorites.products');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const recommendations = await recommendationEngine.getProductRecommendations(user);
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get look recommendations based on user preferences
router.get('/looks', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('recentlyViewed.looks')
            .populate('favorites.looks');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const recommendations = await recommendationEngine.getLookRecommendations(user);
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get trending products and looks
router.get('/trending', async (req, res) => {
    try {
        const { category, timeframe = '7d' } = req.query;

        const trendingProducts = await recommendationEngine.getTrendingProducts({
            category,
            timeframe
        });

        const trendingLooks = await recommendationEngine.getTrendingLooks({
            timeframe
        });

        res.json({
            products: trendingProducts,
            looks: trendingLooks
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get seasonal recommendations
router.get('/seasonal', async (req, res) => {
    try {
        const { season } = req.query;
        const recommendations = await recommendationEngine.getSeasonalRecommendations(season);
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User, Product } = require('../models');
const { validateRoutine } = require('../middleware/validation');

// Get user's skincare routine
router.get('/routines/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate('skincareRoutine.morning.products')
            .populate('skincareRoutine.evening.products');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.skincareRoutine);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create or update skincare routine
router.post('/routines', auth, validateRoutine, async (req, res) => {
    try {
        const { morning, evening, skinType, concerns } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.skincareRoutine = {
            morning: {
                products: morning.products,
                steps: morning.steps
            },
            evening: {
                products: evening.products,
                steps: evening.steps
            },
            skinType,
            concerns
        };

        await user.save();
        res.json(user.skincareRoutine);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update specific routine
router.put('/routines/:routineId', auth, validateRoutine, async (req, res) => {
    try {
        const { products, steps, timeOfDay } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.skincareRoutine[timeOfDay] = {
            products,
            steps
        };

        await user.save();
        res.json(user.skincareRoutine);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get recommended products for skin type
router.get('/recommendations', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const recommendations = await Product.find({
            category: { $in: ['Cleanser', 'Moisturizer', 'Serum', 'Sunscreen'] },
            'attributes.skinType': user.skincareRoutine.skinType,
            'attributes.concerns': { $in: user.skincareRoutine.concerns }
        }).limit(10);

        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Look, User, Product } = require('../models');
const { validateLook } = require('../middleware/validation');
const { uploadImage } = require('../utils/imageUpload');

// Get all looks with filtering
router.get('/', async (req, res) => {
    try {
        const {
            category,
            occasion,
            season,
            difficulty,
            duration,
            products,
            sort,
            page = 1,
            limit = 12
        } = req.query;

        // Build query
        const query = {};
        if (category) query.category = category;
        if (occasion) query.occasion = occasion;
        if (season) query.season = season;
        if (difficulty) query.difficulty = difficulty;
        if (duration) query.duration = duration;
        if (products) {
            query['products.product'] = {
                $all: products.split(',')
            };
        }

        // Build sort
        let sortQuery = {};
        switch (sort) {
            case 'popular':
                sortQuery.likes = -1;
                break;
            case 'trending':
                sortQuery.views = -1;
                break;
            case 'newest':
                sortQuery.createdAt = -1;
                break;
            default:
                sortQuery.createdAt = -1;
        }

        const looks = await Look.find(query)
            .sort(sortQuery)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('creator', 'profile.name profile.picture')
            .populate('products.product');

        const total = await Look.countDocuments(query);

        res.json({
            looks,
            page: Number(page),
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error('Looks fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching looks' });
    }
});

// Create new look
router.post('/', auth, validateLook, uploadImage.array('images', 10), async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            occasion,
            season,
            products,
            steps,
            tags
        } = req.body;

        // Validate products exist
        const productIds = JSON.parse(products).map(p => p.product);
        const existingProducts = await Product.find({ _id: { $in: productIds } });
        if (existingProducts.length !== productIds.length) {
            return res.status(400).json({ message: 'Some products do not exist' });
        }

        // Create look
        const look = new Look({
            name,
            description,
            category,
            occasion,
            season,
            creator: req.user.userId,
            products: JSON.parse(products),
            steps: JSON.parse(steps),
            tags: JSON.parse(tags),
            images: req.files.map(file => file.path)
        });

        await look.save();

        // Update user's created looks
        await User.findByIdAndUpdate(req.user.userId, {
            $push: { 'profile.createdLooks': look._id }
        });

        res.status(201).json(look);
    } catch (error) {
        console.error('Look creation error:', error);
        res.status(500).json({ message: 'Server error while creating look' });
    }
});

// Get single look
router.get('/:id', async (req, res) => {
    try {
        const look = await Look.findById(req.params.id)
            .populate('creator', 'profile.name profile.picture')
            .populate('products.product')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'profile.name profile.picture'
                }
            });

        if (!look) {
            return res.status(404).json({ message: 'Look not found' });
        }

        // Increment view count
        look.views += 1;
        await look.save();

        res.json(look);
    } catch (error) {
        console.error('Look fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching look' });
    }
});

// Update look
router.put('/:id', auth, validateLook, async (req, res) => {
    try {
        const look = await Look.findById(req.params.id);
        if (!look) {
            return res.status(404).json({ message: 'Look not found' });
        }

        // Check ownership
        if (look.creator.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this look' });
        }

        const updatedLook = await Look.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(updatedLook);
    } catch (error) {
        console.error('Look update error:', error);
        res.status(500).json({ message: 'Server error while updating look' });
    }
});

// Delete look
router.delete('/:id', auth, async (req, res) => {
    try {
        const look = await Look.findById(req.params.id);
        if (!look) {
            return res.status(404).json({ message: 'Look not found' });
        }

        // Check ownership
        if (look.creator.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this look' });
        }

        await look.remove();

        // Remove from user's created looks
        await User.findByIdAndUpdate(req.user.userId, {
            $pull: { 'profile.createdLooks': look._id }
        });

        res.json({ message: 'Look deleted successfully' });
    } catch (error) {
        console.error('Look deletion error:', error);
        res.status(500).json({ message: 'Server error while deleting look' });
    }
});

// Like/unlike look
router.post('/:id/like', auth, async (req, res) => {
    try {
        const look = await Look.findById(req.params.id);
        if (!look) {
            return res.status(404).json({ message: 'Look not found' });
        }

        const index = look.likes.indexOf(req.user.userId);
        if (index === -1) {
            look.likes.push(req.user.userId);
        } else {
            look.likes.splice(index, 1);
        }

        await look.save();
        res.json({ likes: look.likes.length });
    } catch (error) {
        console.error('Look like/unlike error:', error);
        res.status(500).json({ message: 'Server error while updating like' });
    }
});

// Add comment to look
router.post('/:id/comments', auth, async (req, res) => {
    try {
        const look = await Look.findById(req.params.id);
        if (!look) {
            return res.status(404).json({ message: 'Look not found' });
        }

        const comment = {
            user: req.user.userId,
            content: req.body.content,
            createdAt: Date.now()
        };

        look.comments.push(comment);
        await look.save();

        // Populate user info for the new comment
        const populatedLook = await Look.findById(req.params.id)
            .populate({
                path: 'comments.user',
                select: 'profile.name profile.picture'
            });

        const newComment = populatedLook.comments[populatedLook.comments.length - 1];
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Comment creation error:', error);
        res.status(500).json({ message: 'Server error while creating comment' });
    }
});

// Get trending looks
router.get('/trending', async (req, res) => {
    try {
        const looks = await Look.find()
            .sort({ views: -1, likes: -1 })
            .limit(6)
            .populate('creator', 'profile.name profile.picture')
            .populate('products.product');

        res.json(looks);
    } catch (error) {
        console.error('Trending looks fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching trending looks' });
    }
});

module.exports = router;

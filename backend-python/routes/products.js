const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Product, Review } = require('../models');
const { validateReview } = require('../middleware/validation');
const { uploadImage } = require('../utils/imageUpload');

// Get all products with filtering
router.get('/', async (req, res) => {
    try {
        const {
            category,
            brand,
            skinType,
            priceRange,
            rating,
            ingredients,
            sort,
            page = 1,
            limit = 20
        } = req.query;

        // Build query
        const query = {};
        if (category) query.category = category;
        if (brand) query.brand = brand;
        if (skinType) query['attributes.skinType'] = skinType;
        if (ingredients) {
            query.ingredients = {
                $all: ingredients.split(',').map(i => new RegExp(i.trim(), 'i'))
            };
        }
        if (priceRange) {
            const [min, max] = priceRange.split('-');
            query.price = { $gte: Number(min), $lte: Number(max) };
        }
        if (rating) {
            query.rating = { $gte: Number(rating) };
        }

        // Build sort
        let sortQuery = {};
        if (sort) {
            switch (sort) {
                case 'price-asc':
                    sortQuery.price = 1;
                    break;
                case 'price-desc':
                    sortQuery.price = -1;
                    break;
                case 'rating':
                    sortQuery.rating = -1;
                    break;
                case 'newest':
                    sortQuery.createdAt = -1;
                    break;
                default:
                    sortQuery.createdAt = -1;
            }
        }

        const products = await Product.find(query)
            .sort(sortQuery)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('brand')
            .populate('category');

        const total = await Product.countDocuments(query);

        res.json({
            products,
            page: Number(page),
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error('Products fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching products' });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('brand')
            .populate('category')
            .populate({
                path: 'reviews',
                populate: {
                    path: 'user',
                    select: 'profile.name profile.picture'
                }
            });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Product fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching product' });
    }
});

// Add product review
router.post('/:id/reviews', auth, validateReview, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({
            product: req.params.id,
            user: req.user.userId
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const review = new Review({
            product: req.params.id,
            user: req.user.userId,
            rating: req.body.rating,
            title: req.body.title,
            content: req.body.content,
            pros: req.body.pros,
            cons: req.body.cons
        });

        await review.save();

        // Update product rating
        const reviews = await Review.find({ product: req.params.id });
        const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
        product.rating = avgRating;
        product.reviewCount = reviews.length;
        await product.save();

        res.status(201).json(review);
    } catch (error) {
        console.error('Review creation error:', error);
        res.status(500).json({ message: 'Server error while creating review' });
    }
});

// Get product reviews
router.get('/:id/reviews', async (req, res) => {
    try {
        const { sort = 'newest', page = 1, limit = 10 } = req.query;

        let sortQuery = {};
        switch (sort) {
            case 'helpful':
                sortQuery.helpful = -1;
                break;
            case 'rating-high':
                sortQuery.rating = -1;
                break;
            case 'rating-low':
                sortQuery.rating = 1;
                break;
            case 'newest':
            default:
                sortQuery.createdAt = -1;
        }

        const reviews = await Review.find({ product: req.params.id })
            .sort(sortQuery)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('user', 'profile.name profile.picture');

        const total = await Review.countDocuments({ product: req.params.id });

        res.json({
            reviews,
            page: Number(page),
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error('Reviews fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching reviews' });
    }
});

// Mark review as helpful
router.post('/:id/reviews/:reviewId/helpful', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (!review.helpfulBy.includes(req.user.userId)) {
            review.helpful += 1;
            review.helpfulBy.push(req.user.userId);
            await review.save();
        }

        res.json({ helpful: review.helpful });
    } catch (error) {
        console.error('Mark helpful error:', error);
        res.status(500).json({ message: 'Server error while marking review helpful' });
    }
});

// Get similar products
router.get('/:id/similar', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find products in same category with similar attributes
        const similarProducts = await Product.find({
            _id: { $ne: product._id },
            category: product.category,
            $or: [
                { brand: product.brand },
                { 'attributes.skinType': product.attributes.skinType },
                { price: { $gte: product.price * 0.8, $lte: product.price * 1.2 } }
            ]
        })
        .limit(6)
        .populate('brand')
        .populate('category');

        res.json(similarProducts);
    } catch (error) {
        console.error('Similar products fetch error:', error);
        res.status(500).json({ message: 'Server error while fetching similar products' });
    }
});

module.exports = router;

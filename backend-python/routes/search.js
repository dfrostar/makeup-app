const express = require('express');
const router = express.Router();
const { Product, Look, User } = require('../models');

// Global search across all content types
router.get('/', async (req, res) => {
    try {
        const { q, type, page = 1, limit = 20 } = req.query;
        const searchRegex = new RegExp(q, 'i');

        let results = {};
        const skip = (page - 1) * limit;

        // Search based on type
        switch (type) {
            case 'products':
                results = await searchProducts(searchRegex, skip, limit);
                break;
            case 'looks':
                results = await searchLooks(searchRegex, skip, limit);
                break;
            case 'users':
                results = await searchUsers(searchRegex, skip, limit);
                break;
            default:
                // Search all types
                const [products, looks, users] = await Promise.all([
                    searchProducts(searchRegex, 0, 5),
                    searchLooks(searchRegex, 0, 5),
                    searchUsers(searchRegex, 0, 5)
                ]);

                results = {
                    products: products.items,
                    looks: looks.items,
                    users: users.items,
                    total: {
                        products: products.total,
                        looks: looks.total,
                        users: users.total
                    }
                };
        }

        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Server error while searching' });
    }
});

// Advanced product search
async function searchProducts(searchRegex, skip, limit) {
    const query = {
        $or: [
            { name: searchRegex },
            { description: searchRegex },
            { brand: searchRegex },
            { category: searchRegex },
            { 'ingredients.name': searchRegex },
            { tags: searchRegex }
        ]
    };

    const [items, total] = await Promise.all([
        Product.find(query)
            .skip(skip)
            .limit(limit)
            .populate('brand')
            .populate('category'),
        Product.countDocuments(query)
    ]);

    return {
        items,
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit)
    };
}

// Advanced look search
async function searchLooks(searchRegex, skip, limit) {
    const query = {
        $or: [
            { name: searchRegex },
            { description: searchRegex },
            { category: searchRegex },
            { occasion: searchRegex },
            { tags: searchRegex },
            { 'steps.description': searchRegex }
        ]
    };

    const [items, total] = await Promise.all([
        Look.find(query)
            .skip(skip)
            .limit(limit)
            .populate('creator', 'profile.name profile.picture')
            .populate('products.product'),
        Look.countDocuments(query)
    ]);

    return {
        items,
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit)
    };
}

// User search
async function searchUsers(searchRegex, skip, limit) {
    const query = {
        $or: [
            { 'profile.name': searchRegex },
            { email: searchRegex },
            { 'profile.skinType': searchRegex },
            { 'profile.skinConcerns': searchRegex }
        ]
    };

    const [items, total] = await Promise.all([
        User.find(query)
            .select('-password')
            .skip(skip)
            .limit(limit),
        User.countDocuments(query)
    ]);

    return {
        items,
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit)
    };
}

// Autocomplete suggestions
router.get('/suggest', async (req, res) => {
    try {
        const { q, type } = req.query;
        const searchRegex = new RegExp('^' + q, 'i');
        const limit = 5;

        let suggestions = [];

        switch (type) {
            case 'products':
                suggestions = await Product.find({ name: searchRegex })
                    .select('name brand category')
                    .limit(limit)
                    .populate('brand', 'name');
                break;

            case 'looks':
                suggestions = await Look.find({ name: searchRegex })
                    .select('name category')
                    .limit(limit);
                break;

            case 'ingredients':
                suggestions = await Product.distinct('ingredients.name', {
                    'ingredients.name': searchRegex
                }).limit(limit);
                break;

            default:
                // Combined suggestions
                const [products, looks, ingredients] = await Promise.all([
                    Product.find({ name: searchRegex })
                        .select('name brand')
                        .limit(3),
                    Look.find({ name: searchRegex })
                        .select('name')
                        .limit(3),
                    Product.distinct('ingredients.name', {
                        'ingredients.name': searchRegex
                    }).limit(3)
                ]);

                suggestions = {
                    products,
                    looks,
                    ingredients
                };
        }

        res.json(suggestions);
    } catch (error) {
        console.error('Suggestion error:', error);
        res.status(500).json({ message: 'Server error while getting suggestions' });
    }
});

// Recent searches
router.get('/recent', async (req, res) => {
    try {
        const recentSearches = await Search.find()
            .sort('-timestamp')
            .limit(10)
            .select('query type timestamp');

        res.json(recentSearches);
    } catch (error) {
        console.error('Recent searches error:', error);
        res.status(500).json({ message: 'Server error while getting recent searches' });
    }
});

module.exports = router;

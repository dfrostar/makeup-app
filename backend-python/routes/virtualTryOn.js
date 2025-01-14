const express = require('express');
const router = express.Router();
const multer = require('multer');
const virtualTryOnService = require('../services/virtualTryOn');

// Configure multer for image upload
const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
});

// Try on makeup
router.post('/try-on', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image provided' });
        }

        const { productType, productColor } = req.body;
        if (!productType || !productColor) {
            return res.status(400).json({ error: 'Product type and color are required' });
        }

        const resultImage = await virtualTryOnService.processImage(
            req.file.buffer,
            productType,
            productColor
        );

        res.set('Content-Type', 'image/png');
        res.send(resultImage);
    } catch (error) {
        console.error('Virtual try-on error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get supported product types
router.get('/supported-types', (req, res) => {
    const supportedTypes = [
        {
            type: 'lipstick',
            description: 'Virtual lipstick application'
        },
        {
            type: 'eyeshadow',
            description: 'Virtual eyeshadow application'
        },
        {
            type: 'blush',
            description: 'Virtual blush application'
        },
        {
            type: 'foundation',
            description: 'Virtual foundation application'
        }
    ];

    res.json(supportedTypes);
});

module.exports = router;

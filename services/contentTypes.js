// Content Types and Categories Configuration
export const ContentTypes = {
    PRODUCTS: {
        categories: [
            'face', 'eyes', 'lips', 'skincare', 'tools',
            'clean-beauty', 'vegan', 'cruelty-free'
        ],
        subcategories: {
            face: ['foundation', 'concealer', 'blush', 'bronzer', 'highlighter'],
            eyes: ['eyeshadow', 'eyeliner', 'mascara', 'brows'],
            lips: ['lipstick', 'lip-gloss', 'lip-liner', 'lip-care'],
            skincare: ['cleanser', 'moisturizer', 'serum', 'mask'],
            tools: ['brushes', 'sponges', 'applicators']
        }
    },

    LOOKS: {
        categories: [
            'natural', 'glam', 'editorial', 'bridal',
            'seasonal', 'night-out', 'work-appropriate'
        ],
        occasions: [
            'everyday', 'special-event', 'wedding',
            'photoshoot', 'festival', 'holiday'
        ],
        seasons: ['spring', 'summer', 'fall', 'winter']
    },

    INGREDIENTS: {
        categories: [
            'hydrating', 'anti-aging', 'brightening',
            'acne-fighting', 'soothing', 'exfoliating'
        ],
        concerns: [
            'sensitive-skin', 'acne-prone', 'aging',
            'hyperpigmentation', 'dryness', 'oiliness'
        ],
        certifications: [
            'organic', 'natural', 'vegan',
            'cruelty-free', 'dermatologist-tested'
        ]
    },

    TUTORIALS: {
        types: [
            'quick-tips', 'step-by-step', 'video',
            'expert-advice', 'user-generated'
        ],
        skillLevels: ['beginner', 'intermediate', 'advanced'],
        duration: ['5-min', '10-min', '15-min', '30-min']
    },

    TRENDS: {
        categories: [
            'seasonal-trends', 'runway-inspired',
            'street-style', 'celebrity-looks'
        ],
        regions: ['global', 'local', 'runway', 'social-media']
    },

    SUSTAINABILITY: {
        categories: [
            'packaging', 'ingredients', 'manufacturing',
            'ethical-sourcing', 'recycling'
        ],
        certifications: [
            'leaping-bunny', 'ecocert', 'usda-organic',
            'b-corp', 'fair-trade'
        ]
    }
};

// Content Relationships for Related Content
export const ContentRelationships = {
    getRelatedProducts(product) {
        return {
            category: product.category,
            subcategory: product.subcategory,
            ingredients: product.ingredients,
            looks: product.featured_in_looks
        };
    },

    getRelatedLooks(look) {
        return {
            products: look.products,
            category: look.category,
            occasion: look.occasion,
            season: look.season
        };
    },

    getRelatedIngredients(ingredient) {
        return {
            benefits: ingredient.benefits,
            concerns: ingredient.concerns,
            products: ingredient.found_in_products
        };
    }
};

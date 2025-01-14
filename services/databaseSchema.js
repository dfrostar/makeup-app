// Database Schema Definitions
const Schema = {
    User: {
        id: 'string',
        email: 'string',
        passwordHash: 'string',
        profile: {
            name: 'string',
            skinType: 'string',
            skinConcerns: ['string'],
            preferredBrands: ['string'],
            favoriteProducts: ['ref:Product'],
            savedLooks: ['ref:Look']
        },
        preferences: {
            notifications: 'boolean',
            newsletter: 'boolean',
            privacySettings: {
                showProfile: 'boolean',
                showActivity: 'boolean'
            }
        },
        createdAt: 'date',
        updatedAt: 'date'
    },

    Product: {
        id: 'string',
        name: 'string',
        brand: 'string',
        category: 'string',
        subcategory: 'string',
        description: 'string',
        ingredients: ['ref:Ingredient'],
        shades: [{
            name: 'string',
            hexCode: 'string',
            imageUrl: 'string'
        }],
        price: 'number',
        size: 'string',
        rating: 'number',
        reviews: ['ref:Review'],
        sustainability: {
            packaging: 'string',
            certifications: ['string'],
            recyclingInfo: 'string'
        },
        images: ['string'],
        createdAt: 'date',
        updatedAt: 'date'
    },

    Look: {
        id: 'string',
        name: 'string',
        creator: 'ref:User',
        description: 'string',
        category: 'string',
        occasion: 'string',
        season: 'string',
        products: [{
            product: 'ref:Product',
            usage: 'string'
        }],
        steps: [{
            order: 'number',
            description: 'string',
            image: 'string'
        }],
        images: ['string'],
        likes: 'number',
        comments: ['ref:Comment'],
        tags: ['string'],
        createdAt: 'date',
        updatedAt: 'date'
    },

    Ingredient: {
        id: 'string',
        name: 'string',
        description: 'string',
        benefits: ['string'],
        concerns: ['string'],
        safetyRating: 'number',
        scientificName: 'string',
        category: 'string',
        source: 'string',
        createdAt: 'date',
        updatedAt: 'date'
    },

    Review: {
        id: 'string',
        product: 'ref:Product',
        user: 'ref:User',
        rating: 'number',
        title: 'string',
        content: 'string',
        pros: ['string'],
        cons: ['string'],
        images: ['string'],
        helpful: 'number',
        verified: 'boolean',
        createdAt: 'date',
        updatedAt: 'date'
    },

    Comment: {
        id: 'string',
        user: 'ref:User',
        content: 'string',
        parentId: 'string',
        likes: 'number',
        createdAt: 'date',
        updatedAt: 'date'
    }
};

export default Schema;

const { Product, User, Look, UserActivity } = require('../models');
const tf = require('@tensorflow/tfjs-node');
const { Matrix } = require('ml-matrix');

class RecommendationEngine {
    constructor() {
        this.modelCache = new Map();
        this.similarityMatrix = null;
        this.lastUpdate = null;
        this.updateInterval = 24 * 60 * 60 * 1000; // 24 hours
    }

    // Initialize similarity matrix
    async initializeSimilarityMatrix() {
        if (this.similarityMatrix && 
            (Date.now() - this.lastUpdate) < this.updateInterval) {
            return;
        }

        try {
            const products = await Product.find().select('category brand ingredients attributes');
            const matrix = new Matrix(products.length, products.length);

            for (let i = 0; i < products.length; i++) {
                for (let j = i + 1; j < products.length; j++) {
                    const similarity = this.calculateProductSimilarity(
                        products[i],
                        products[j]
                    );
                    matrix.set(i, j, similarity);
                    matrix.set(j, i, similarity);
                }
            }

            this.similarityMatrix = matrix;
            this.lastUpdate = Date.now();
        } catch (error) {
            console.error('Error initializing similarity matrix:', error);
            throw error;
        }
    }

    // Calculate similarity between two products
    calculateProductSimilarity(product1, product2) {
        let similarity = 0;
        let weights = {
            category: 0.3,
            brand: 0.1,
            ingredients: 0.3,
            attributes: 0.3
        };

        // Category similarity
        if (product1.category === product2.category) {
            similarity += weights.category;
        }

        // Brand similarity
        if (product1.brand === product2.brand) {
            similarity += weights.brand;
        }

        // Ingredients similarity
        const commonIngredients = product1.ingredients.filter(i => 
            product2.ingredients.includes(i)
        ).length;
        const ingredientSimilarity = commonIngredients / 
            Math.max(product1.ingredients.length, product2.ingredients.length);
        similarity += weights.ingredients * ingredientSimilarity;

        // Attributes similarity
        const attributeSimilarity = this.calculateAttributeSimilarity(
            product1.attributes,
            product2.attributes
        );
        similarity += weights.attributes * attributeSimilarity;

        return similarity;
    }

    // Calculate attribute similarity
    calculateAttributeSimilarity(attrs1, attrs2) {
        const attributes = ['skinType', 'concern', 'finish', 'coverage'];
        let similarity = 0;

        for (const attr of attributes) {
            if (attrs1[attr] === attrs2[attr]) {
                similarity += 1;
            }
        }

        return similarity / attributes.length;
    }

    // Get personalized recommendations for a user
    async getPersonalizedRecommendations(userId, limit = 10) {
        try {
            const user = await User.findById(userId)
                .populate('profile.favoriteProducts')
                .populate('profile.viewedProducts')
                .populate('profile.purchasedProducts');

            // Get user preferences
            const userPreferences = {
                skinType: user.profile.skinType,
                skinConcerns: user.profile.skinConcerns,
                preferredBrands: user.profile.preferredBrands
            };

            // Get user interaction history
            const userHistory = {
                favorites: user.profile.favoriteProducts,
                viewed: user.profile.viewedProducts,
                purchased: user.profile.purchasedProducts
            };

            // Calculate recommendation scores
            const recommendations = await this.calculateRecommendationScores(
                userPreferences,
                userHistory
            );

            // Sort and limit recommendations
            return recommendations
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);

        } catch (error) {
            console.error('Error getting personalized recommendations:', error);
            throw error;
        }
    }

    // Calculate recommendation scores
    async calculateRecommendationScores(preferences, history) {
        await this.initializeSimilarityMatrix();

        const allProducts = await Product.find();
        const scores = [];

        for (const product of allProducts) {
            // Skip products user has already interacted with
            if (this.hasUserInteracted(product._id, history)) {
                continue;
            }

            let score = 0;

            // Preference match score
            score += this.calculatePreferenceScore(product, preferences);

            // Similarity score based on user history
            score += await this.calculateSimilarityScore(product, history);

            // Popularity score
            score += await this.calculatePopularityScore(product);

            scores.push({
                product,
                score
            });
        }

        return scores;
    }

    // Check if user has interacted with product
    hasUserInteracted(productId, history) {
        return history.favorites.some(p => p._id.equals(productId)) ||
               history.purchased.some(p => p._id.equals(productId));
    }

    // Calculate preference match score
    calculatePreferenceScore(product, preferences) {
        let score = 0;
        const weights = {
            skinType: 0.4,
            skinConcerns: 0.3,
            brand: 0.3
        };

        // Skin type match
        if (product.attributes.skinType === preferences.skinType) {
            score += weights.skinType;
        }

        // Skin concerns match
        const concernMatch = product.attributes.concerns.some(c => 
            preferences.skinConcerns.includes(c)
        );
        if (concernMatch) {
            score += weights.skinConcerns;
        }

        // Preferred brand match
        if (preferences.preferredBrands.includes(product.brand)) {
            score += weights.brand;
        }

        return score;
    }

    // Calculate similarity score based on user history
    async calculateSimilarityScore(product, history) {
        let score = 0;
        const weights = {
            favorites: 0.5,
            purchased: 0.3,
            viewed: 0.2
        };

        for (const type in history) {
            for (const historyProduct of history[type]) {
                const similarity = this.similarityMatrix.get(
                    product._id.toString(),
                    historyProduct._id.toString()
                );
                score += similarity * weights[type];
            }
        }

        return score;
    }

    // Calculate popularity score
    async calculatePopularityScore(product) {
        const now = new Date();
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));

        const stats = await UserActivity.aggregate([
            {
                $match: {
                    product: product._id,
                    timestamp: { $gte: monthAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    views: {
                        $sum: { $cond: [{ $eq: ["$type", "view"] }, 1, 0] }
                    },
                    purchases: {
                        $sum: { $cond: [{ $eq: ["$type", "purchase"] }, 1, 0] }
                    },
                    favorites: {
                        $sum: { $cond: [{ $eq: ["$type", "favorite"] }, 1, 0] }
                    }
                }
            }
        ]);

        if (!stats.length) return 0;

        const { views, purchases, favorites } = stats[0];
        return (views * 0.3 + purchases * 0.5 + favorites * 0.2) / 100;
    }

    // Get similar products
    async getSimilarProducts(productId, limit = 5) {
        await this.initializeSimilarityMatrix();

        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        const similarities = [];
        const allProducts = await Product.find({ _id: { $ne: productId } });

        for (const otherProduct of allProducts) {
            const similarity = this.similarityMatrix.get(
                product._id.toString(),
                otherProduct._id.toString()
            );
            similarities.push({
                product: otherProduct,
                similarity
            });
        }

        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit)
            .map(s => s.product);
    }

    // Get trending products
    async getTrendingProducts(limit = 10) {
        const now = new Date();
        const weekAgo = new Date(now.setDate(now.getDate() - 7));

        const trending = await UserActivity.aggregate([
            {
                $match: {
                    timestamp: { $gte: weekAgo }
                }
            },
            {
                $group: {
                    _id: "$product",
                    score: {
                        $sum: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$type", "purchase"] }, then: 5 },
                                    { case: { $eq: ["$type", "favorite"] }, then: 3 },
                                    { case: { $eq: ["$type", "view"] }, then: 1 }
                                ],
                                default: 0
                            }
                        }
                    }
                }
            },
            {
                $sort: { score: -1 }
            },
            {
                $limit: limit
            }
        ]);

        return Promise.all(
            trending.map(t => Product.findById(t._id))
        );
    }
}

module.exports = new RecommendationEngine();

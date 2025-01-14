import { Product, UserPreferences } from '../types/auth';
import { getSimilarityScore } from '../utils/similarity';
import { weightedAverage } from '../utils/math';

interface RecommendationFactors {
    skinTypeMatch: number;
    skinToneMatch: number;
    concernsMatch: number;
    rating: number;
    popularity: number;
    seasonality: number;
    pricePoint: number;
    brandAffinity: number;
}

export class RecommendationEngine {
    private products: Product[];
    private userPreferences: UserPreferences;
    private purchaseHistory: Product[];
    private viewHistory: Product[];

    constructor(
        products: Product[],
        userPreferences: UserPreferences,
        purchaseHistory: Product[],
        viewHistory: Product[]
    ) {
        this.products = products;
        this.userPreferences = userPreferences;
        this.purchaseHistory = purchaseHistory;
        this.viewHistory = viewHistory;
    }

    public getPersonalizedRecommendations(limit: number = 10): Product[] {
        const scoredProducts = this.products.map(product => ({
            product,
            score: this.calculateProductScore(product),
        }));

        return this.filterAndSortProducts(scoredProducts, limit);
    }

    public getTrendingProducts(limit: number = 10): Product[] {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

        const scoredProducts = this.products.map(product => ({
            product,
            score: this.calculateTrendingScore(product, thirtyDaysAgo),
        }));

        return this.filterAndSortProducts(scoredProducts, limit);
    }

    public getSimilarProducts(productId: string, limit: number = 10): Product[] {
        const baseProduct = this.products.find(p => p.id === productId);
        if (!baseProduct) return [];

        const scoredProducts = this.products
            .filter(p => p.id !== productId)
            .map(product => ({
                product,
                score: this.calculateSimilarityScore(baseProduct, product),
            }));

        return this.filterAndSortProducts(scoredProducts, limit);
    }

    private calculateProductScore(product: Product): number {
        const factors = this.calculateRecommendationFactors(product);
        
        // Weights for different factors (should be fine-tuned based on data)
        const weights = {
            skinTypeMatch: 0.25,
            skinToneMatch: 0.25,
            concernsMatch: 0.20,
            rating: 0.10,
            popularity: 0.05,
            seasonality: 0.05,
            pricePoint: 0.05,
            brandAffinity: 0.05,
        };

        return weightedAverage(factors, weights);
    }

    private calculateRecommendationFactors(product: Product): RecommendationFactors {
        return {
            skinTypeMatch: this.calculateSkinTypeMatch(product),
            skinToneMatch: this.calculateSkinToneMatch(product),
            concernsMatch: this.calculateConcernsMatch(product),
            rating: this.normalizeRating(product.rating),
            popularity: this.calculatePopularity(product),
            seasonality: this.calculateSeasonality(product),
            pricePoint: this.calculatePricePointMatch(product),
            brandAffinity: this.calculateBrandAffinity(product),
        };
    }

    private calculateSkinTypeMatch(product: Product): number {
        return product.suitableSkinTypes.includes(this.userPreferences.skinType) ? 1 : 0;
    }

    private calculateSkinToneMatch(product: Product): number {
        const toneMatch = product.suitableSkinTones.includes(this.userPreferences.skinTone);
        const undertoneMatch = product.suitableUndertones.includes(this.userPreferences.undertone);
        return (toneMatch && undertoneMatch) ? 1 : toneMatch ? 0.5 : 0;
    }

    private calculateConcernsMatch(product: Product): number {
        const userConcerns = new Set(this.userPreferences.concerns);
        const productBenefits = new Set(product.benefits);
        
        const intersection = new Set(
            [...userConcerns].filter(x => productBenefits.has(x))
        );
        
        return intersection.size / userConcerns.size;
    }

    private normalizeRating(rating: { average: number; count: number }): number {
        // Wilson score interval for rating normalization
        const z = 1.96; // 95% confidence
        const n = rating.count;
        const p = rating.average / 5;
        
        const left = p + z * z / (2 * n);
        const right = z * Math.sqrt((p * (1 - p) + z * z / (4 * n)) / n);
        const under = 1 + z * z / n;
        
        return (left - right) / under;
    }

    private calculatePopularity(product: Product): number {
        const views = product.stats.views;
        const purchases = product.stats.purchases;
        const wishlists = product.stats.wishlists;
        
        // Normalize each metric
        const normalizedViews = views / Math.max(...this.products.map(p => p.stats.views));
        const normalizedPurchases = purchases / Math.max(...this.products.map(p => p.stats.purchases));
        const normalizedWishlists = wishlists / Math.max(...this.products.map(p => p.stats.wishlists));
        
        // Weight and combine metrics
        return (normalizedViews * 0.2) + (normalizedPurchases * 0.5) + (normalizedWishlists * 0.3);
    }

    private calculateSeasonality(product: Product): number {
        const currentMonth = new Date().getMonth();
        const seasonalityScore = product.seasonality[currentMonth];
        return seasonalityScore / 100;
    }

    private calculatePricePointMatch(product: Product): number {
        const userPriceRange = this.userPreferences.priceRange;
        const productPrice = product.price;
        
        if (productPrice >= userPriceRange.min && productPrice <= userPriceRange.max) {
            return 1;
        }
        
        const distanceToRange = Math.min(
            Math.abs(productPrice - userPriceRange.min),
            Math.abs(productPrice - userPriceRange.max)
        );
        
        return Math.max(0, 1 - (distanceToRange / userPriceRange.max));
    }

    private calculateBrandAffinity(product: Product): number {
        const purchasedBrands = new Set(
            this.purchaseHistory.map(p => p.brand)
        );
        
        if (purchasedBrands.has(product.brand)) {
            return 1;
        }
        
        const viewedBrands = new Set(
            this.viewHistory.map(p => p.brand)
        );
        
        return viewedBrands.has(product.brand) ? 0.5 : 0;
    }

    private calculateTrendingScore(product: Product, since: Date): number {
        const recentStats = product.stats.getStatsSince(since);
        
        const viewsWeight = 1;
        const purchasesWeight = 3;
        const wishlistsWeight = 2;
        
        const normalizedViews = recentStats.views / Math.max(...this.products.map(p => p.stats.getStatsSince(since).views));
        const normalizedPurchases = recentStats.purchases / Math.max(...this.products.map(p => p.stats.getStatsSince(since).purchases));
        const normalizedWishlists = recentStats.wishlists / Math.max(...this.products.map(p => p.stats.getStatsSince(since).wishlists));
        
        const weightedSum = (normalizedViews * viewsWeight) +
                          (normalizedPurchases * purchasesWeight) +
                          (normalizedWishlists * wishlistsWeight);
                          
        return weightedSum / (viewsWeight + purchasesWeight + wishlistsWeight);
    }

    private calculateSimilarityScore(product1: Product, product2: Product): number {
        const categoryScore = product1.category === product2.category ? 1 : 0;
        const brandScore = product1.brand === product2.brand ? 1 : 0;
        const priceScore = 1 - Math.abs(product1.price - product2.price) / Math.max(product1.price, product2.price);
        
        const benefitsScore = getSimilarityScore(product1.benefits, product2.benefits);
        const ingredientsScore = getSimilarityScore(product1.ingredients, product2.ingredients);
        const skinTypesScore = getSimilarityScore(product1.suitableSkinTypes, product2.suitableSkinTypes);
        
        const weights = {
            category: 0.3,
            brand: 0.1,
            price: 0.1,
            benefits: 0.2,
            ingredients: 0.2,
            skinTypes: 0.1,
        };
        
        return weightedAverage({
            category: categoryScore,
            brand: brandScore,
            price: priceScore,
            benefits: benefitsScore,
            ingredients: ingredientsScore,
            skinTypes: skinTypesScore,
        }, weights);
    }

    private filterAndSortProducts(
        scoredProducts: Array<{ product: Product; score: number }>,
        limit: number
    ): Product[] {
        return scoredProducts
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(sp => sp.product);
    }
}

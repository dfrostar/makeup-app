import { ContentAPI } from '../../api';

export interface ContentAgentConfig {
  cacheTimeout?: number;
  batchSize?: number;
  retryAttempts?: number;
}

export class ContentAgent {
  private config: ContentAgentConfig;
  private cache: Map<string, { data: any; timestamp: number }>;

  constructor(config: ContentAgentConfig = {}) {
    this.config = {
      cacheTimeout: 5 * 60 * 1000, // 5 minutes
      batchSize: 20,
      retryAttempts: 3,
      ...config
    };
    this.cache = new Map();
  }

  async getProducts(category?: string) {
    const cacheKey = `products-${category || 'all'}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const products = await ContentAPI.getProducts(category);
      this.setCache(cacheKey, products);
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getIngredients(query?: string) {
    const cacheKey = `ingredients-${query || 'all'}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const ingredients = await ContentAPI.getIngredients(query);
      this.setCache(cacheKey, ingredients);
      return ingredients;
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      throw error;
    }
  }

  async getTrendingLooks() {
    const cacheKey = 'trending-looks';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const looks = await ContentAPI.getTrendingLooks();
      this.setCache(cacheKey, looks);
      return looks;
    } catch (error) {
      console.error('Error fetching trending looks:', error);
      throw error;
    }
  }

  private getCached(key: string) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.config.cacheTimeout!) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }
}

import { ContentAgent } from './ContentAgent';

export interface SearchAgentConfig {
  minQueryLength?: number;
  maxResults?: number;
  scoreThreshold?: number;
}

export class SearchAgent {
  private contentAgent: ContentAgent;
  private config: SearchAgentConfig;

  constructor(contentAgent: ContentAgent, config: SearchAgentConfig = {}) {
    this.contentAgent = contentAgent;
    this.config = {
      minQueryLength: 2,
      maxResults: 50,
      scoreThreshold: 0.5,
      ...config
    };
  }

  async search(query: string, filters: Record<string, any> = {}) {
    if (query.length < this.config.minQueryLength!) {
      return [];
    }

    try {
      // Get all content
      const [products, ingredients, looks] = await Promise.all([
        this.contentAgent.getProducts(),
        this.contentAgent.getIngredients(),
        this.contentAgent.getTrendingLooks()
      ]);

      // Search across all content types
      const results = [
        ...this.searchProducts(query, products, filters),
        ...this.searchIngredients(query, ingredients),
        ...this.searchLooks(query, looks)
      ];

      // Sort by relevance score and limit results
      return results
        .sort((a, b) => b.score - a.score)
        .filter(result => result.score >= this.config.scoreThreshold!)
        .slice(0, this.config.maxResults!);
    } catch (error) {
      console.error('Error performing search:', error);
      throw error;
    }
  }

  private searchProducts(query: string, products: any[], filters: Record<string, any>) {
    return products
      .filter(product => this.matchesFilters(product, filters))
      .map(product => ({
        type: 'product',
        item: product,
        score: this.calculateScore(query, [
          product.name,
          product.description,
          product.category,
          ...(product.tags || [])
        ])
      }));
  }

  private searchIngredients(query: string, ingredients: string[]) {
    return ingredients.map(ingredient => ({
      type: 'ingredient',
      item: ingredient,
      score: this.calculateScore(query, [ingredient])
    }));
  }

  private searchLooks(query: string, looks: any[]) {
    return looks.map(look => ({
      type: 'look',
      item: look,
      score: this.calculateScore(query, [
        look.title,
        look.description,
        ...(look.tags || [])
      ])
    }));
  }

  private calculateScore(query: string, fields: string[]): number {
    const queryTerms = query.toLowerCase().split(/\s+/);
    const fieldText = fields.join(' ').toLowerCase();

    let score = 0;
    for (const term of queryTerms) {
      if (fieldText.includes(term)) {
        score += 1;
      }
    }

    return score / queryTerms.length;
  }

  private matchesFilters(item: any, filters: Record<string, any>): boolean {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return item[key] === value;
    });
  }
}

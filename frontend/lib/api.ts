import { IProduct } from '../models/Product';

interface CacheItem<T> {
  data: T;
  expiry: number;
}

const cache: { [key: string]: CacheItem<any> } = {};

export const fetchWithCache = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  expiryMinutes: number = 5
): Promise<T> => {
  const now = Date.now();
  const cached = cache[key];

  if (cached && cached.expiry > now) {
    return cached.data;
  }

  const data = await fetcher();
  cache[key] = {
    data,
    expiry: now + (expiryMinutes * 60 * 1000)
  };

  return data;
};

// Fallback data for when API calls fail
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: 'Sample Lipstick',
    description: 'A beautiful matte lipstick',
    price: 19.99,
    category: 'Lips',
    image: '/images/products/lipstick.jpg'
  }
];

const FALLBACK_INGREDIENTS = ['Mica', 'Titanium Dioxide', 'Iron Oxides'];

const FALLBACK_LOOKS = [
  {
    id: 1,
    title: 'Natural Glam',
    description: 'Perfect for everyday wear',
    image: '/images/looks/natural-glam.jpg'
  }
];

export class ContentAPI {
  static endpoints = {
    products: '/api/products',
    ingredients: '/api/ingredients',
    looks: '/api/looks',
    trends: '/api/trending-looks'
  };

  static async getProducts(category: string | null = null): Promise<IProduct[]> {
    const url = category 
      ? `${ContentAPI.endpoints.products}?category=${encodeURIComponent(category)}`
      : ContentAPI.endpoints.products;

    try {
      const response = await fetchWithCache(
        `products-${category || 'all'}`,
        () => fetch(url).then(res => res.json())
      );
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      return FALLBACK_PRODUCTS;
    }
  }

  static async getIngredients(query: string = ''): Promise<string[]> {
    const url = query
      ? `${ContentAPI.endpoints.ingredients}?q=${encodeURIComponent(query)}`
      : ContentAPI.endpoints.ingredients;

    try {
      const response = await fetchWithCache(
        `ingredients-${query}`,
        () => fetch(url).then(res => res.json())
      );
      return response;
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      return FALLBACK_INGREDIENTS;
    }
  }

  static async getTrendingLooks(): Promise<any[]> {
    try {
      const response = await fetchWithCache(
        'trending-looks',
        () => fetch(ContentAPI.endpoints.trends).then(res => res.json())
      );
      return response;
    } catch (error) {
      console.error('Error fetching trending looks:', error);
      return FALLBACK_LOOKS;
    }
  }
}

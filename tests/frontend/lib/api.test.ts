import { ContentAPI, fetchWithCache } from '../../../frontend/lib/api';

// Mock fetch
global.fetch = jest.fn();

describe('API Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchWithCache', () => {
    it('should cache and return data', async () => {
      const mockData = { test: 'data' };
      const fetchFn = jest.fn().mockResolvedValue(mockData);

      const result1 = await fetchWithCache('test-key', fetchFn);
      const result2 = await fetchWithCache('test-key', fetchFn);

      expect(result1).toEqual(mockData);
      expect(result2).toEqual(mockData);
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('ContentAPI', () => {
    describe('getProducts', () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Sample Lipstick',
          description: 'A beautiful matte lipstick',
          price: 19.99,
          category: 'Lips',
          image: '/images/products/lipstick.jpg'
        }
      ];

      it('should fetch products', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          json: () => Promise.resolve(mockProducts)
        });

        const result = await ContentAPI.getProducts();
        expect(global.fetch).toHaveBeenCalledWith('/api/products');
        expect(result).toEqual(mockProducts);
      });

      it('should return fallback data on error', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        const result = await ContentAPI.getProducts();
        expect(result).toEqual(mockProducts);
      });
    });

    describe('getIngredients', () => {
      const mockIngredients = ['Mica', 'Titanium Dioxide', 'Iron Oxides'];

      it('should fetch ingredients', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          json: () => Promise.resolve(mockIngredients)
        });

        const result = await ContentAPI.getIngredients();
        expect(global.fetch).toHaveBeenCalledWith('/api/ingredients');
        expect(result).toEqual(mockIngredients);
      });

      it('should return fallback data on error', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        const result = await ContentAPI.getIngredients();
        expect(result).toEqual(mockIngredients);
      });
    });

    describe('getTrendingLooks', () => {
      const mockLooks = [
        {
          id: 1,
          title: 'Natural Glam',
          description: 'Perfect for everyday wear',
          image: '/images/looks/natural-glam.jpg'
        }
      ];

      it('should fetch trending looks', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          json: () => Promise.resolve(mockLooks)
        });

        const result = await ContentAPI.getTrendingLooks();
        expect(global.fetch).toHaveBeenCalledWith('/api/trending-looks');
        expect(result).toEqual(mockLooks);
      });

      it('should return fallback data on error', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        const result = await ContentAPI.getTrendingLooks();
        expect(result).toEqual(mockLooks);
      });
    });
  });
});

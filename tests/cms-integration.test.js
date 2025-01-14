const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.CMS_URL || 'http://localhost:1337';
const API_TOKEN = process.env.CMS_API_TOKEN;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_TOKEN}`
  }
});

describe('CMS Integration Tests', () => {
  let categoryId;
  let productId;

  // Test category creation
  test('should create a new category', async () => {
    const categoryData = {
      data: {
        name: 'Lipsticks',
        description: 'All types of lipsticks',
        slug: 'lipsticks'
      }
    };

    const response = await axiosInstance.post('/api/categories', categoryData);
    expect(response.status).toBe(200);
    expect(response.data.data.attributes.name).toBe('Lipsticks');
    categoryId = response.data.data.id;
  });

  // Test product creation
  test('should create a new product', async () => {
    const productData = {
      data: {
        name: 'Matte Revolution Lipstick',
        description: 'Long-lasting matte lipstick',
        price: 29.99,
        brand: 'TestBrand',
        category: categoryId,
        ingredients: 'Vitamin E, Shea Butter, Natural Oils',
        shades: ['Ruby Red', 'Pink Nude', 'Coral'],
        rating: 4.5,
        inStock: true,
        tags: ['matte', 'long-lasting', 'cruelty-free']
      }
    };

    const response = await axiosInstance.post('/api/products', productData);
    expect(response.status).toBe(200);
    expect(response.data.data.attributes.name).toBe('Matte Revolution Lipstick');
    productId = response.data.data.id;
  });

  // Test product retrieval
  test('should retrieve product with category', async () => {
    const response = await axiosInstance.get(`/api/products/${productId}?populate=category`);
    expect(response.status).toBe(200);
    expect(response.data.data.attributes.name).toBe('Matte Revolution Lipstick');
    expect(response.data.data.attributes.category.data.id).toBe(categoryId);
  });

  // Test category products listing
  test('should list all products in category', async () => {
    const response = await axiosInstance.get(`/api/categories/${categoryId}?populate=products`);
    expect(response.status).toBe(200);
    expect(response.data.data.attributes.products.data.length).toBeGreaterThan(0);
  });

  // Test product update
  test('should update product price', async () => {
    const updateData = {
      data: {
        price: 34.99
      }
    };

    const response = await axiosInstance.put(`/api/products/${productId}`, updateData);
    expect(response.status).toBe(200);
    expect(response.data.data.attributes.price).toBe(34.99);
  });

  // Test search functionality
  test('should search products', async () => {
    const response = await axiosInstance.get('/api/products', {
      params: {
        filters: {
          name: {
            $contains: 'Matte'
          }
        }
      }
    });
    expect(response.status).toBe(200);
    expect(response.data.data.length).toBeGreaterThan(0);
  });
});

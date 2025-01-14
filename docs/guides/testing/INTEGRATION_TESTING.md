# Integration Testing Guide

## Overview

Integration testing verifies that different parts of the application work together correctly. This guide covers our approach to integration testing using Jest, Supertest, and Testing Library.

## Test Structure

### 1. Test Organization
```
tests/
  integration/
    api/
      auth.test.ts
      users.test.ts
    database/
      repositories.test.ts
    features/
      checkout.test.ts
      search.test.ts
```

### 2. Test Environment
```typescript
// setup.ts
import { setupTestDatabase } from './utils/db';
import { setupTestServer } from './utils/server';

beforeAll(async () => {
  await setupTestDatabase();
  await setupTestServer();
});

afterAll(async () => {
  await cleanupTestDatabase();
  await closeTestServer();
});
```

## API Integration Tests

### 1. HTTP Endpoint Tests
```typescript
import request from 'supertest';
import app from '../src/app';
import { createTestUser } from '../utils/test-helpers';

describe('Auth API', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await createTestUser();
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate valid user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user profile', async () => {
      const token = generateToken(testUser);
      
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(testUser.email);
    });
  });
});
```

### 2. WebSocket Tests
```typescript
import WebSocket from 'ws';
import { createTestServer } from '../utils/test-server';

describe('WebSocket API', () => {
  let server;
  let ws;

  beforeEach(async () => {
    server = await createTestServer();
    ws = new WebSocket(`ws://localhost:${server.port}`);
  });

  afterEach(() => {
    ws.close();
    server.close();
  });

  it('should handle real-time updates', (done) => {
    ws.on('open', () => {
      ws.send(JSON.stringify({
        type: 'subscribe',
        channel: 'updates'
      }));
    });

    ws.on('message', (data) => {
      const message = JSON.parse(data);
      expect(message).toHaveProperty('type', 'subscribed');
      done();
    });
  });
});
```

## Database Integration Tests

### 1. Repository Tests
```typescript
import { UserRepository } from '../src/repositories';
import { createTestDatabase } from '../utils/test-db';

describe('UserRepository', () => {
  let db;

  beforeEach(async () => {
    db = await createTestDatabase();
  });

  afterEach(async () => {
    await db.cleanup();
  });

  it('should create and retrieve user', async () => {
    const user = await UserRepository.create({
      name: 'Test User',
      email: 'test@example.com'
    });

    const retrieved = await UserRepository.findById(user.id);
    expect(retrieved).toEqual(user);
  });

  it('should handle concurrent operations', async () => {
    const [user1, user2] = await Promise.all([
      UserRepository.create({ name: 'User 1' }),
      UserRepository.create({ name: 'User 2' })
    ]);

    expect(user1.id).not.toBe(user2.id);
  });
});
```

### 2. Transaction Tests
```typescript
import { TransactionManager } from '../src/database';
import { OrderRepository, ProductRepository } from '../src/repositories';

describe('Order Transaction', () => {
  it('should handle order creation atomically', async () => {
    const transaction = await TransactionManager.start();

    try {
      const product = await ProductRepository.findById(1, { transaction });
      const order = await OrderRepository.create({
        productId: product.id,
        quantity: 1
      }, { transaction });

      await ProductRepository.updateStock(
        product.id,
        product.stock - 1,
        { transaction }
      );

      await transaction.commit();

      // Verify changes
      const updatedProduct = await ProductRepository.findById(1);
      expect(updatedProduct.stock).toBe(product.stock - 1);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  });
});
```

## Feature Integration Tests

### 1. Checkout Flow
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckoutFlow } from '../src/features/checkout';

describe('Checkout Flow', () => {
  it('should complete checkout process', async () => {
    // Setup test data
    const product = await createTestProduct();
    const user = await createTestUser();

    // Render checkout flow
    render(
      <TestWrapper user={user}>
        <CheckoutFlow product={product} />
      </TestWrapper>
    );

    // Add to cart
    await userEvent.click(screen.getByText('Add to Cart'));
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');

    // Fill shipping info
    await userEvent.type(
      screen.getByLabelText('Address'),
      '123 Test St'
    );
    await userEvent.type(
      screen.getByLabelText('City'),
      'Test City'
    );

    // Complete payment
    await userEvent.click(screen.getByText('Pay Now'));
    
    // Verify order completion
    expect(await screen.findByText('Order Confirmed')).toBeInTheDocument();
    
    // Verify database state
    const order = await OrderRepository.findLatestByUser(user.id);
    expect(order.status).toBe('completed');
  });
});
```

### 2. Search Feature
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchFeature } from '../src/features/search';
import { searchProducts } from '../src/services/search';

jest.mock('../src/services/search');

describe('Search Feature', () => {
  beforeEach(() => {
    (searchProducts as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Test Product' }
    ]);
  });

  it('should search and display results', async () => {
    render(<SearchFeature />);

    // Perform search
    await userEvent.type(
      screen.getByRole('searchbox'),
      'test product'
    );
    await userEvent.click(screen.getByText('Search'));

    // Verify API call
    expect(searchProducts).toHaveBeenCalledWith('test product');

    // Verify results display
    expect(await screen.findByText('Test Product')).toBeInTheDocument();
  });

  it('should handle search filters', async () => {
    render(<SearchFeature />);

    // Apply filters
    await userEvent.click(screen.getByText('Filters'));
    await userEvent.click(screen.getByText('Price: Low to High'));
    await userEvent.click(screen.getByText('Apply'));

    // Verify API call with filters
    expect(searchProducts).toHaveBeenCalledWith(
      expect.any(String),
      { sort: 'price_asc' }
    );
  });
});
```

## Test Data Management

### 1. Test Factories
```typescript
import { Factory } from 'fishery';
import faker from 'faker';

const userFactory = Factory.define<User>(() => ({
  id: faker.datatype.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  createdAt: faker.date.recent()
}));

const productFactory = Factory.define<Product>(() => ({
  id: faker.datatype.uuid(),
  name: faker.commerce.productName(),
  price: faker.commerce.price(),
  stock: faker.datatype.number({ min: 0, max: 100 })
}));

export const createTestData = async () => {
  const user = await userFactory.create();
  const products = await productFactory.createList(3);
  return { user, products };
};
```

### 2. Database Seeding
```typescript
import { Seeder } from '../src/database';

const seedTestData = async () => {
  const seeder = new Seeder();
  
  await seeder.run([
    {
      model: 'User',
      data: userFactory.buildList(5)
    },
    {
      model: 'Product',
      data: productFactory.buildList(10)
    }
  ]);
  
  return seeder.created;
};
```

## Mocking External Services

### 1. API Mocks
```typescript
import nock from 'nock';

describe('Payment Service', () => {
  beforeEach(() => {
    nock('https://api.stripe.com')
      .post('/v1/charges')
      .reply(200, {
        id: 'ch_test123',
        status: 'succeeded'
      });
  });

  it('should process payment', async () => {
    const payment = await PaymentService.charge({
      amount: 1000,
      currency: 'USD',
      source: 'tok_visa'
    });

    expect(payment.status).toBe('succeeded');
  });
});
```

### 2. Service Mocks
```typescript
jest.mock('../src/services/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(true)
}));

describe('Order Service', () => {
  it('should send order confirmation', async () => {
    const order = await OrderService.create({
      userId: 1,
      items: [{ productId: 1, quantity: 1 }]
    });

    expect(sendEmail).toHaveBeenCalledWith({
      to: expect.any(String),
      subject: 'Order Confirmation',
      template: 'order-confirmation',
      data: { orderId: order.id }
    });
  });
});
```

## Best Practices

1. **Test Independence**
   - Each test should be independent
   - Clean up test data
   - Reset mocks between tests

2. **Realistic Scenarios**
   - Test complete workflows
   - Include error cases
   - Test concurrent operations

3. **Performance**
   - Use test database
   - Mock external services
   - Parallelize when possible

4. **Maintainability**
   - Use test helpers
   - Share test data setup
   - Document complex scenarios

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Library Documentation](https://testing-library.com/)
- [Database Testing Guide](./DATABASE_TESTING.md)
- [API Testing Guide](./API_TESTING.md)

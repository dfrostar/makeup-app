# Testing Strategy

## Overview

Our testing strategy follows a comprehensive approach:

1. Unit Testing
2. Integration Testing
3. End-to-End Testing
4. Performance Testing
5. Security Testing
6. Accessibility Testing
7. SEO Testing

## Test Pyramid

```
    E2E Tests     ▲
   Integration    ■■
     Tests       ■■■■
  Unit Tests    ■■■■■■
```

## Test Types

### 1. Unit Tests

```typescript
// Component test example
describe('Button', () => {
  it('should render with correct text', () => {
    const { getByText } = render(
      <Button>Click me</Button>
    );
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const onClick = jest.fn();
    const { getByRole } = render(
      <Button onClick={onClick}>Click me</Button>
    );
    fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});

// Service test example
describe('UserService', () => {
  it('should fetch user data', async () => {
    const user = await UserService.getUser(1);
    expect(user).toMatchObject({
      id: 1,
      name: expect.any(String)
    });
  });
});
```

### 2. Integration Tests

```typescript
// API integration test
describe('Authentication API', () => {
  it('should authenticate user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});

// Database integration test
describe('User Repository', () => {
  it('should create and retrieve user', async () => {
    const user = await UserRepository.create({
      name: 'John Doe',
      email: 'john@example.com'
    });
    
    const retrieved = await UserRepository.findById(user.id);
    expect(retrieved).toEqual(user);
  });
});
```

### 3. E2E Tests

```typescript
// Playwright E2E test
test('user can login and view profile', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('[name=email]', 'user@example.com');
  await page.fill('[name=password]', 'password123');
  await page.click('button[type=submit]');
  
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

### 4. Performance Tests

```typescript
// Lighthouse performance test
describe('Performance', () => {
  it('should meet performance thresholds', async () => {
    const results = await lighthouse('https://example.com');
    
    expect(results.lcp).toBeLessThan(2500);
    expect(results.fid).toBeLessThan(100);
    expect(results.cls).toBeLessThan(0.1);
  });
});

// Load test
describe('API Load Test', () => {
  it('should handle concurrent requests', async () => {
    const results = await loadTest({
      url: '/api/endpoint',
      duration: '1m',
      vus: 100
    });
    
    expect(results.p95).toBeLessThan(200);
  });
});
```

### 5. Security Tests

```typescript
// Security headers test
describe('Security Headers', () => {
  it('should have required security headers', async () => {
    const response = await request(app).get('/');
    
    expect(response.headers).toMatchObject({
      'strict-transport-security': expect.any(String),
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY'
    });
  });
});

// Authentication test
describe('Authentication', () => {
  it('should prevent unauthorized access', async () => {
    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', 'invalid-token');
    
    expect(response.status).toBe(401);
  });
});
```

### 6. Accessibility Tests

```typescript
// Axe accessibility test
describe('Accessibility', () => {
  it('should meet WCAG guidelines', async () => {
    const results = await axe(document.body);
    expect(results.violations).toHaveLength(0);
  });
});

// Keyboard navigation test
describe('Keyboard Navigation', () => {
  it('should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => 
      document.activeElement?.tagName
    );
    expect(focused).not.toBe('BODY');
  });
});
```

### 7. SEO Tests

```typescript
// Meta tags test
describe('SEO', () => {
  it('should have required meta tags', async () => {
    const { document } = await JSDOM.fromURL('http://localhost:3000');
    
    expect(document.querySelector('title')).toBeTruthy();
    expect(document.querySelector('meta[name="description"]')).toBeTruthy();
    expect(document.querySelector('meta[name="robots"]')).toBeTruthy();
  });
});
```

## Test Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Playwright Configuration

```typescript
// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'Chrome',
      use: { browserName: 'chromium' }
    },
    {
      name: 'Firefox',
      use: { browserName: 'firefox' }
    }
  ]
};

export default config;
```

## CI/CD Integration

```yaml
# GitHub Actions workflow
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm run test:unit
        
      - name: Run integration tests
        run: npm run test:integration
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

## Test Data Management

### 1. Factories

```typescript
// User factory
const createUser = Factory.define<User>(() => ({
  id: Factory.each((i) => i),
  name: Factory.fake((f) => f.name.fullName()),
  email: Factory.fake((f) => f.internet.email()),
  createdAt: new Date()
}));

// Product factory
const createProduct = Factory.define<Product>(() => ({
  id: Factory.each((i) => i),
  name: Factory.fake((f) => f.commerce.productName()),
  price: Factory.fake((f) => f.commerce.price()),
  category: Factory.fake((f) => f.commerce.department())
}));
```

### 2. Fixtures

```typescript
// fixtures/users.json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}

// Load fixtures
const loadFixtures = async () => {
  const fixtures = await import('./fixtures/users.json');
  await UserRepository.createMany(fixtures.users);
};
```

## Test Utilities

### 1. Custom Matchers

```typescript
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () => `expected ${received} to be within range ${floor} - ${ceiling}`
    };
  }
});
```

### 2. Test Helpers

```typescript
// Authentication helper
const authenticateUser = async () => {
  const user = await createUser();
  const token = generateToken(user);
  return { user, token };
};

// API request helper
const apiRequest = async (method, url, data = null, token = null) => {
  return request(app)[method](url)
    .set('Authorization', token ? `Bearer ${token}` : '')
    .send(data);
};
```

## Best Practices

### 1. Test Organization

```typescript
describe('UserService', () => {
  // Setup
  beforeEach(() => {
    // Setup code
  });

  // Happy path tests
  describe('when valid input', () => {
    it('should create user', async () => {
      // Test code
    });
  });

  // Error cases
  describe('when invalid input', () => {
    it('should throw validation error', async () => {
      // Test code
    });
  });
});
```

### 2. Naming Conventions

```typescript
// Component tests
describe('Button', () => {
  it('should render with default props', () => {});
  it('should handle click events', () => {});
  it('should display loading state', () => {});
});

// Integration tests
describe('UserAPI', () => {
  it('should create new user', () => {});
  it('should return 400 for invalid data', () => {});
});
```

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Library](https://testing-library.com/docs/)
- [Cypress Documentation](https://docs.cypress.io)
- [Accessibility Testing](https://www.w3.org/WAI/test-evaluate/)

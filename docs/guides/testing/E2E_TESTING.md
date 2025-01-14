# End-to-End Testing Guide

## Overview

End-to-End (E2E) testing verifies that the entire application works correctly from a user's perspective. We use Playwright for E2E testing, which provides a powerful and reliable way to automate browser testing.

## Test Structure

### 1. Test Organization
```
tests/
  e2e/
    specs/
      auth.spec.ts
      checkout.spec.ts
      search.spec.ts
    fixtures/
      users.json
      products.json
    utils/
      test-helpers.ts
    playwright.config.ts
```

### 2. Configuration
```typescript
// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests/e2e/specs',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'Chrome',
      use: { browserName: 'chromium' }
    },
    {
      name: 'Firefox',
      use: { browserName: 'firefox' }
    },
    {
      name: 'Safari',
      use: { browserName: 'webkit' }
    }
  ]
};

export default config;
```

## Authentication Tests

### 1. Login Flow
```typescript
import { test, expect } from '@playwright/test';
import { createTestUser } from '../utils/test-helpers';

test.describe('Authentication', () => {
  let testUser;

  test.beforeEach(async () => {
    testUser = await createTestUser();
  });

  test('should login successfully', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill login form
    await page.fill('[data-testid="email"]', testUser.email);
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Verify successful login
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-name"]'))
      .toContainText(testUser.name);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[data-testid="email"]', testUser.email);
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');

    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('Invalid credentials');
    await expect(page).toHaveURL('/login');
  });
});
```

### 2. Registration Flow
```typescript
test.describe('Registration', () => {
  test('should register new user', async ({ page }) => {
    await page.goto('/register');

    // Fill registration form
    await page.fill('[data-testid="name"]', 'Test User');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.fill('[data-testid="confirm-password"]', 'password123');
    
    await page.click('[data-testid="register-button"]');

    // Verify registration success
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]'))
      .toContainText('Welcome, Test User');
  });

  test('should validate registration form', async ({ page }) => {
    await page.goto('/register');
    await page.click('[data-testid="register-button"]');

    // Check validation messages
    await expect(page.locator('#name-error'))
      .toContainText('Name is required');
    await expect(page.locator('#email-error'))
      .toContainText('Email is required');
  });
});
```

## Checkout Flow Tests

### 1. Complete Checkout
```typescript
test.describe('Checkout', () => {
  test('should complete purchase', async ({ page }) => {
    // Login
    await loginTestUser(page);

    // Add product to cart
    await page.goto('/products');
    await page.click('[data-testid="product-1"]');
    await page.click('[data-testid="add-to-cart"]');

    // Navigate to cart
    await page.click('[data-testid="cart-icon"]');
    await expect(page.locator('[data-testid="cart-items"]'))
      .toHaveCount(1);

    // Start checkout
    await page.click('[data-testid="checkout-button"]');

    // Fill shipping info
    await page.fill('[data-testid="address"]', '123 Test St');
    await page.fill('[data-testid="city"]', 'Test City');
    await page.fill('[data-testid="zip"]', '12345');
    await page.click('[data-testid="continue-shipping"]');

    // Fill payment info
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');
    await page.click('[data-testid="place-order"]');

    // Verify order confirmation
    await expect(page).toHaveURL(/\/order-confirmation/);
    await expect(page.locator('[data-testid="order-status"]'))
      .toContainText('Order Confirmed');
  });
});
```

### 2. Cart Management
```typescript
test.describe('Cart', () => {
  test('should manage cart items', async ({ page }) => {
    await loginTestUser(page);

    // Add multiple items
    await page.goto('/products');
    await page.click('[data-testid="product-1"]');
    await page.click('[data-testid="add-to-cart"]');
    await page.goto('/products');
    await page.click('[data-testid="product-2"]');
    await page.click('[data-testid="add-to-cart"]');

    // Verify cart
    await page.click('[data-testid="cart-icon"]');
    await expect(page.locator('[data-testid="cart-items"]'))
      .toHaveCount(2);

    // Update quantity
    await page.fill('[data-testid="quantity-1"]', '2');
    await expect(page.locator('[data-testid="subtotal"]'))
      .toContainText('$39.98');

    // Remove item
    await page.click('[data-testid="remove-item-2"]');
    await expect(page.locator('[data-testid="cart-items"]'))
      .toHaveCount(1);
  });
});
```

## Search and Filter Tests

### 1. Product Search
```typescript
test.describe('Search', () => {
  test('should search products', async ({ page }) => {
    await page.goto('/');

    // Perform search
    await page.fill('[data-testid="search-input"]', 'lipstick');
    await page.click('[data-testid="search-button"]');

    // Verify results
    await expect(page.locator('[data-testid="product-card"]'))
      .toHaveCount(5);
    await expect(page.locator('[data-testid="product-name"]'))
      .toContainText(['Matte Lipstick', 'Glossy Lipstick']);
  });

  test('should handle no results', async ({ page }) => {
    await page.goto('/');
    
    await page.fill('[data-testid="search-input"]', 'nonexistent');
    await page.click('[data-testid="search-button"]');

    await expect(page.locator('[data-testid="no-results"]'))
      .toBeVisible();
  });
});
```

### 2. Filters and Sorting
```typescript
test.describe('Filters', () => {
  test('should filter and sort products', async ({ page }) => {
    await page.goto('/products');

    // Apply category filter
    await page.click('[data-testid="filter-button"]');
    await page.click('[data-testid="category-lipstick"]');

    // Sort by price
    await page.selectOption('[data-testid="sort-select"]', 'price-asc');

    // Verify filtered and sorted results
    const prices = await page.$$eval(
      '[data-testid="product-price"]',
      elements => elements.map(el => 
        parseFloat(el.textContent.replace('$', ''))
      )
    );

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
```

## Visual Testing

### 1. Screenshot Testing
```typescript
test.describe('Visual Regression', () => {
  test('should match homepage snapshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('should match product page snapshot', async ({ page }) => {
    await page.goto('/products/1');
    await expect(page).toHaveScreenshot('product-page.png', {
      mask: ['[data-testid="dynamic-content"]']
    });
  });
});
```

### 2. Responsive Testing
```typescript
test.describe('Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]'))
      .toBeVisible();
  });

  test('should adapt layout to tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await expect(page.locator('[data-testid="product-grid"]'))
      .toHaveClass(/grid-cols-2/);
  });
});
```

## Performance Testing

### 1. Load Time Tests
```typescript
test.describe('Performance', () => {
  test('should load homepage within threshold', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    await page.goto('/');
    
    const metrics = await page.evaluate(() => ({
      lcp: performance.getEntriesByType('largest-contentful-paint')[0],
      fid: performance.getEntriesByType('first-input')[0],
      cls: performance.getEntriesByType('layout-shift')
        .reduce((sum, entry) => sum + entry.value, 0)
    }));

    expect(metrics.lcp.startTime).toBeLessThan(2500);
    expect(metrics.cls).toBeLessThan(0.1);
  });
});
```

## Test Helpers

### 1. Authentication Helper
```typescript
// test-helpers.ts
export const loginTestUser = async (page: Page) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="login-button"]');
  await expect(page).toHaveURL('/dashboard');
};

export const createTestData = async () => {
  // Setup test data in database
  const user = await createUser({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });

  const products = await createProducts([
    { name: 'Product 1', price: 19.99 },
    { name: 'Product 2', price: 29.99 }
  ]);

  return { user, products };
};
```

### 2. Custom Fixtures
```typescript
// fixtures.ts
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await loginTestUser(page);
    await use(page);
  },
  
  testData: async ({}, use) => {
    const data = await createTestData();
    await use(data);
    await cleanupTestData();
  }
});
```

## Best Practices

1. **Test Organization**
   - Group related tests
   - Use descriptive names
   - Follow user flows

2. **Stability**
   - Use reliable selectors
   - Handle loading states
   - Add retry logic

3. **Performance**
   - Parallelize tests
   - Reuse authentication
   - Clean up test data

4. **Maintenance**
   - Use page objects
   - Share common utilities
   - Document complex flows

## Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Visual Testing Guide](./VISUAL_TESTING.md)
- [Performance Testing Guide](./PERFORMANCE_TESTING.md)
- [CI/CD Integration Guide](./CI_CD.md)

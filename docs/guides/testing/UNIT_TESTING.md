# Unit Testing Guide

## Overview

Unit testing ensures individual components work correctly in isolation. This guide covers our unit testing approach using Jest and React Testing Library.

## Test Structure

### 1. Test File Organization
```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
      Button.styles.ts
  hooks/
    useAuth/
      useAuth.ts
      useAuth.test.ts
  utils/
    format/
      format.ts
      format.test.ts
```

### 2. Test Suite Structure
```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Common setup
  });

  afterEach(() => {
    // Cleanup
  });

  // Test cases grouped by functionality
  describe('initialization', () => {
    it('should render with default props', () => {});
    it('should handle custom props', () => {});
  });

  describe('interactions', () => {
    it('should handle click events', () => {});
    it('should update state', () => {});
  });

  describe('error cases', () => {
    it('should handle invalid input', () => {});
    it('should display error messages', () => {});
  });
});
```

## Component Testing

### 1. React Component Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    
    userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should display loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should apply custom styles', () => {
    render(<Button variant="primary">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-primary');
  });
});
```

### 2. Custom Hooks Tests
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import useCounter from './useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('should handle custom initial value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });
});
```

### 3. Context Tests
```typescript
import { render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

const TestComponent = () => {
  const { theme } = useTheme();
  return <div data-testid="theme">{theme}</div>;
};

describe('ThemeContext', () => {
  it('should provide theme to children', () => {
    render(
      <ThemeProvider initialTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('should update theme', () => {
    const { result } = renderHook(
      () => useTheme(),
      { wrapper: ThemeProvider }
    );
    
    act(() => {
      result.current.setTheme('light');
    });
    
    expect(result.current.theme).toBe('light');
  });
});
```

## Utility Function Testing

### 1. Pure Function Tests
```typescript
import { formatCurrency, formatDate } from './format';

describe('formatCurrency', () => {
  it('should format USD', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });

  it('should handle negative values', () => {
    expect(formatCurrency(-1234.56, 'USD')).toBe('-$1,234.56');
  });

  it('should round to cents', () => {
    expect(formatCurrency(1234.567, 'USD')).toBe('$1,234.57');
  });
});

describe('formatDate', () => {
  it('should format date string', () => {
    const date = new Date('2024-01-01');
    expect(formatDate(date)).toBe('Jan 1, 2024');
  });

  it('should handle invalid dates', () => {
    expect(() => formatDate('invalid')).toThrow();
  });
});
```

### 2. Async Function Tests
```typescript
import { fetchUser } from './api';

describe('fetchUser', () => {
  it('should fetch user data', async () => {
    const user = await fetchUser(1);
    expect(user).toEqual({
      id: 1,
      name: expect.any(String),
      email: expect.any(String)
    });
  });

  it('should handle network errors', async () => {
    // Mock failed fetch
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    
    await expect(fetchUser(1)).rejects.toThrow('Network error');
  });
});
```

## Mocking

### 1. Function Mocks
```typescript
import { sendAnalytics } from './analytics';

jest.mock('./analytics', () => ({
  sendAnalytics: jest.fn()
}));

describe('Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should track event', () => {
    trackEvent('click', { button: 'submit' });
    expect(sendAnalytics).toHaveBeenCalledWith(
      'click',
      expect.objectContaining({ button: 'submit' })
    );
  });
});
```

### 2. Module Mocks
```typescript
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn()
}));

import axios from 'axios';

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should make API request', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: { id: 1, name: 'Test' }
    });

    const response = await api.getUser(1);
    expect(response).toEqual({ id: 1, name: 'Test' });
  });
});
```

### 3. Timer Mocks
```typescript
describe('Debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should debounce function calls', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 1000);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(fn).not.toHaveBeenCalled();

    jest.runAllTimers();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
```

## Test Helpers

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

it('should be within range', () => {
  expect(1.5).toBeWithinRange(1, 2);
});
```

### 2. Test Utils
```typescript
const renderWithProviders = (
  ui: React.ReactElement,
  {
    initialState = {},
    store = configureStore({ reducer, initialState }),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </Provider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};
```

## Best Practices

1. **Test Organization**
   - Group related tests
   - Use descriptive names
   - Follow AAA pattern (Arrange, Act, Assert)

2. **Test Coverage**
   - Aim for high coverage
   - Focus on critical paths
   - Don't test implementation details

3. **Mocking**
   - Mock external dependencies
   - Use realistic test data
   - Clean up after tests

4. **Assertions**
   - Use specific assertions
   - Test edge cases
   - Verify error handling

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Patterns](../patterns/TESTING.md)
- [Code Coverage Guide](./COVERAGE.md)

# Unit Testing Guidelines

## Overview
This guide outlines the unit testing standards for the Beauty Directory Platform, focusing on React components, AI features, and performance testing.

## Testing Framework

### Core Technologies
```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }]
  }
};
```

## Component Testing

### React Testing Library Setup
```typescript
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { theme } from '@/styles/theme';
import { store } from '@/store';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </Provider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });
```

### Component Test Structure
```typescript
describe('Component: SearchBar', () => {
  const mockProps = {
    onSearch: jest.fn(),
    initialQuery: '',
    suggestions: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search input', () => {
    const { getByPlaceholderText } = render(
      <SearchBar {...mockProps} />
    );
    expect(getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('should handle search submission', async () => {
    const { getByRole } = render(<SearchBar {...mockProps} />);
    await userEvent.click(getByRole('button', { name: /search/i }));
    expect(mockProps.onSearch).toHaveBeenCalled();
  });
});
```

## AI Feature Testing

### Mock AI Models
```typescript
// __mocks__/ai-models.ts
export const mockFaceDetection = {
  detect: jest.fn().mockResolvedValue([{
    boundingBox: { x: 0, y: 0, width: 100, height: 100 },
    landmarks: [/* mock landmarks */],
    probability: 0.99
  }])
};

export const mockMakeupTransfer = {
  transfer: jest.fn().mockResolvedValue({
    result: new ImageData(100, 100),
    confidence: 0.95
  })
};
```

### Testing AI Components
```typescript
describe('Component: VirtualMirror', () => {
  beforeAll(() => {
    // Mock WebGL context
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      // WebGL mock implementation
    }));
  });

  it('should initialize AI models', async () => {
    const { result } = renderHook(() => useAIModels());
    await waitFor(() => {
      expect(result.current.initialized).toBe(true);
    });
  });

  it('should handle face detection', async () => {
    const { getByTestId } = render(<VirtualMirror />);
    const canvas = getByTestId('ar-canvas');
    
    // Trigger face detection
    await act(async () => {
      await canvas.dispatchEvent(new Event('videoframe'));
    });

    expect(mockFaceDetection.detect).toHaveBeenCalled();
  });
});
```

## Performance Testing

### Metrics Collection
```typescript
interface PerformanceMetrics {
  renderTime: number;
  interactionTime: number;
  memoryUsage: number;
  frameRate: number;
}

const measurePerformance = async (
  component: React.ComponentType,
  iterations: number
): Promise<PerformanceMetrics> => {
  const metrics: PerformanceMetrics[] = [];

  for (let i = 0; i < iterations; i++) {
    performance.mark('render-start');
    const { unmount } = render(<Component />);
    performance.mark('render-end');
    
    const measurement = performance.measure(
      'render-time',
      'render-start',
      'render-end'
    );

    metrics.push({
      renderTime: measurement.duration,
      // ... other metrics
    });

    unmount();
  }

  return calculateAverageMetrics(metrics);
};
```

### Memory Leak Testing
```typescript
describe('Memory Leaks', () => {
  it('should not leak memory', async () => {
    const initialMemory = performance.memory.usedJSHeapSize;
    
    // Render and unmount component multiple times
    for (let i = 0; i < 100; i++) {
      const { unmount } = render(<Component />);
      unmount();
    }

    const finalMemory = performance.memory.usedJSHeapSize;
    const leak = finalMemory - initialMemory;
    
    expect(leak).toBeLessThan(1000000); // 1MB threshold
  });
});
```

## Integration Testing

### API Mocking
```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/products', (req, res, ctx) => {
    return res(ctx.json([/* mock data */]));
  }),

  rest.post('/api/search', (req, res, ctx) => {
    return res(ctx.json({
      results: [/* mock results */]
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### E2E Component Testing
```typescript
describe('E2E: SearchFlow', () => {
  it('should complete search flow', async () => {
    const { getByRole, findByText } = render(<SearchFlow />);
    
    // Input search query
    await userEvent.type(
      getByRole('textbox'),
      'red lipstick'
    );

    // Submit search
    await userEvent.click(
      getByRole('button', { name: /search/i })
    );

    // Wait for results
    const results = await findByText(/results found/i);
    expect(results).toBeInTheDocument();
  });
});
```

## Visual Regression Testing

### Snapshot Testing
```typescript
describe('Visual Regression', () => {
  it('should match component snapshot', () => {
    const tree = renderer
      .create(<Component theme="light" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match dark theme snapshot', () => {
    const tree = renderer
      .create(<Component theme="dark" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
```

## Accessibility Testing

### A11y Testing
```typescript
describe('Accessibility', () => {
  it('should be accessible', async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should handle keyboard navigation', () => {
    const { getByRole } = render(<Component />);
    const element = getByRole('button');
    
    element.focus();
    expect(document.activeElement).toBe(element);
  });
});
```

## Test Coverage

### Coverage Configuration
```typescript
// jest.config.ts
module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
    '/dist/'
  ]
};
```

## Continuous Integration

### GitHub Actions Setup
```yaml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test
      - uses: codecov/codecov-action@v2
```

## Future Improvements

### Planned Enhancements
1. Property-based testing
2. Stress testing for AI features
3. Performance regression testing
4. Visual diff testing

### Experimental Features
- Fuzzing tests
- Chaos testing
- Contract testing
- Snapshot testing improvements

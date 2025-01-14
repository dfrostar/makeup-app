# Frontend Component Architecture

## Overview
The Beauty Directory Platform uses a modern React component architecture with TypeScript, featuring atomic design principles, feature-based organization, and performance optimization strategies.

## Component Organization

### Directory Structure
```
src/
├── components/
│   ├── admin/           # Admin interface components
│   ├── ar/             # AR feature components
│   ├── discovery/      # Search and discovery components
│   ├── ui/            # Shared UI components
│   └── features/      # Feature-specific components
├── hooks/             # Custom React hooks
├── store/            # State management
├── styles/           # Global styles and themes
└── utils/            # Utility functions
```

## Component Categories

### Core UI Components
```typescript
// ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

// ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helper?: string;
}
```

### Feature Components
```typescript
// ar/VirtualMirror.tsx
interface VirtualMirrorProps {
  onCapture: (image: Blob) => void;
  products: Product[];
  settings: ARSettings;
}

// discovery/SearchBar.tsx
interface SearchBarProps {
  onSearch: (query: SearchQuery) => void;
  features: SearchFeature[];
  suggestions: string[];
}
```

## State Management

### Store Structure
```typescript
interface RootState {
  user: UserState;
  ar: ARState;
  search: SearchState;
  ui: UIState;
}

// Example slice
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchResults: (state, action) => {
      state.results = action.payload;
    }
  }
});
```

### Component-Level State
```typescript
// Local state management
const useLocalState = <T>(initial: T) => {
  const [state, setState] = useState(initial);
  const persistedState = useMemo(() => state, [state]);
  return [persistedState, setState] as const;
};
```

## Performance Optimization

### Code Splitting
```typescript
// Lazy loading components
const VirtualMirror = lazy(() => import('./ar/VirtualMirror'));
const SearchResults = lazy(() => import('./discovery/SearchResults'));

// Route-based code splitting
const routes = {
  ar: {
    path: '/ar',
    component: lazy(() => import('./pages/AR'))
  }
};
```

### Rendering Optimization
```typescript
// Virtualized list example
const ProductList = memo(({ products }: ProductListProps) => {
  return (
    <VirtualList
      height={800}
      itemCount={products.length}
      itemSize={100}
      width={600}
    >
      {({ index, style }) => (
        <ProductCard
          product={products[index]}
          style={style}
        />
      )}
    </VirtualList>
  );
});
```

## Styling System

### Theme Configuration
```typescript
const theme = {
  colors: {
    primary: {
      50: '#f8f9fa',
      100: '#f1f3f5',
      // ...
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    // ...
  }
} as const;
```

### Styled Components
```typescript
const StyledButton = styled.button<ButtonProps>`
  ${({ variant, theme }) => css`
    background: ${theme.colors[variant].base};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border-radius: ${theme.borderRadius.md};
  `}
`;
```

## Testing Strategy

### Component Testing
```typescript
describe('VirtualMirror', () => {
  it('should initialize AR context', () => {
    render(<VirtualMirror />);
    expect(screen.getByTestId('ar-canvas')).toBeInTheDocument();
  });

  it('should handle product selection', async () => {
    const onSelect = jest.fn();
    render(<VirtualMirror onSelect={onSelect} />);
    await userEvent.click(screen.getByText('Apply'));
    expect(onSelect).toHaveBeenCalled();
  });
});
```

### Performance Testing
```typescript
// Performance monitoring
const withPerformanceTracking = <P extends object>(
  WrappedComponent: ComponentType<P>,
  metricName: string
) => {
  return function WithPerformanceTracking(props: P) {
    useEffect(() => {
      performance.mark(`${metricName}-start`);
      return () => {
        performance.mark(`${metricName}-end`);
        performance.measure(
          metricName,
          `${metricName}-start`,
          `${metricName}-end`
        );
      };
    }, []);

    return <WrappedComponent {...props} />;
  };
};
```

## Accessibility

### ARIA Integration
```typescript
const AccessibleComponent = ({ label, children }: Props) => {
  const id = useId();
  return (
    <div
      role="region"
      aria-labelledby={id}
    >
      <h2 id={id}>{label}</h2>
      {children}
    </div>
  );
};
```

## Error Boundaries

### Component Error Handling
```typescript
class FeatureErrorBoundary extends React.Component<
  PropsWithChildren<{
    fallback: ReactNode;
  }>
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

## Integration Points

### API Integration
```typescript
const useAPI = <T>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint);
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading };
};
```

## Future Improvements

### Planned Enhancements
1. Web Components integration
2. Micro-frontend architecture
3. Server Components adoption
4. Advanced state management

### Experimental Features
- React Server Components
- Streaming SSR
- Islands Architecture
- Partial Hydration

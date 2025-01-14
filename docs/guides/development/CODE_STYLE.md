# Code Style Guide

## General Principles

### 1. Clean Code
- Write self-documenting code
- Follow SOLID principles
- Keep functions small and focused
- Use meaningful names
- Maintain single responsibility

### 2. Consistency
- Follow established patterns
- Use consistent naming
- Maintain consistent file structure
- Apply consistent formatting

### 3. Documentation
- Document complex logic
- Add JSDoc comments
- Keep documentation up-to-date
- Include examples

## Naming Conventions

### 1. Files and Directories
```typescript
// Components
MyComponent.tsx
MyComponent.test.tsx
MyComponent.styles.ts

// Utilities
formatDate.ts
formatDate.test.ts

// Pages
[id].tsx
index.tsx
```

### 2. Variables and Functions
```typescript
// Variables
const userName = 'John';
const isActive = true;
const MAX_ATTEMPTS = 3;

// Functions
function calculateTotal() {}
const handleSubmit = () => {}
const onUserClick = () => {}

// Classes
class UserService {}
class AuthenticationManager {}
```

### 3. Components
```typescript
// Component names
const UserProfile = () => {}
const ProductCard = () => {}

// Props interfaces
interface UserProfileProps {
  userName: string;
  isAdmin: boolean;
}
```

## TypeScript Guidelines

### 1. Types and Interfaces
```typescript
// Prefer interfaces for objects
interface User {
  id: string;
  name: string;
  email: string;
}

// Use type for unions/intersections
type Status = 'active' | 'inactive';
type UserWithRole = User & { role: string };

// Generic types
interface Response<T> {
  data: T;
  status: number;
}
```

### 2. Type Safety
```typescript
// Use strict types
const users: User[] = [];

// Avoid any
function processData<T>(data: T): T {
  return data;
}

// Use unknown for API responses
async function fetchData(): Promise<unknown> {
  const response = await fetch('/api/data');
  return response.json();
}
```

## React Guidelines

### 1. Component Structure
```typescript
// Functional components
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // Hooks at the top
  const [state, setState] = useState();
  
  // Event handlers
  const handleClick = () => {};
  
  // Helper functions
  const formatData = () => {};
  
  // Render methods
  const renderItem = () => {};
  
  // Return JSX
  return (
    <div>
      {renderItem()}
    </div>
  );
};
```

### 2. Props
```typescript
// Props interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// Default props
const defaultProps = {
  variant: 'primary' as const,
  disabled: false,
};

// Component with props
const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = defaultProps.variant,
  disabled = defaultProps.disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn-${variant}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
```

## CSS/Styling Guidelines

### 1. Tailwind CSS
```typescript
// Use utility classes
const Card = () => (
  <div className="p-4 rounded-lg shadow-md">
    <h2 className="text-xl font-bold mb-2">Title</h2>
    <p className="text-gray-600">Content</p>
  </div>
);

// Custom classes
const customStyles = {
  wrapper: 'flex items-center justify-between',
  title: 'text-2xl font-bold text-primary',
  button: 'px-4 py-2 bg-primary text-white rounded',
};
```

### 2. CSS Modules
```scss
// styles.module.scss
.container {
  display: flex;
  align-items: center;
  
  .title {
    font-size: 1.5rem;
    color: var(--primary);
  }
}

// Component
import styles from './styles.module.scss';

const Component = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>Title</h1>
  </div>
);
```

## Testing Guidelines

### 1. Unit Tests
```typescript
// Component test
describe('Button', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <Button label="Click me" onClick={jest.fn()} />
    );
    expect(getByText('Click me')).toBeInTheDocument();
  });
  
  it('should handle click events', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <Button label="Click me" onClick={onClick} />
    );
    fireEvent.click(getByText('Click me'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### 2. Integration Tests
```typescript
// API integration test
describe('UserAPI', () => {
  it('should fetch user data', async () => {
    const response = await fetchUserData(1);
    expect(response).toMatchObject({
      id: 1,
      name: expect.any(String),
    });
  });
});
```

## Error Handling

### 1. Error Boundaries
```typescript
class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### 2. API Errors
```typescript
// Error types
interface APIError {
  code: string;
  message: string;
  details?: unknown;
}

// Error handling
try {
  const response = await api.get('/data');
} catch (error) {
  if (isAPIError(error)) {
    handleAPIError(error);
  } else {
    handleUnexpectedError(error);
  }
}
```

## Performance Guidelines

### 1. React Optimization
```typescript
// Use memo for expensive calculations
const memoizedValue = useMemo(() => {
  return expensiveCalculation(prop);
}, [prop]);

// Use callback for event handlers
const handleClick = useCallback(() => {
  doSomething(prop);
}, [prop]);

// Use React.memo for component optimization
const MemoizedComponent = React.memo(Component);
```

### 2. Code Splitting
```typescript
// Lazy loading components
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Use Suspense
const App = () => (
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
);
```

## Git Commit Guidelines

### 1. Commit Messages
```bash
# Format
<type>(<scope>): <subject>

# Types
feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code restructuring
test: adding tests
chore: maintenance
```

### 2. Branch Names
```bash
# Format
<type>/<description>

# Examples
feature/user-authentication
bugfix/login-error
hotfix/security-patch
```

## Additional Resources

- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [React Style Guide](https://reactjs.org/docs/code-splitting.html)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

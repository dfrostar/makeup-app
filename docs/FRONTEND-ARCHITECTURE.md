# Frontend Architecture

## Overview
Modern, component-based architecture using Next.js 14, TypeScript, and Tailwind CSS for the Makeup Discovery Platform.

## Component Structure

### 1. Core Components

```typescript
// src/components/core/Layout.tsx
interface LayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
    showFooter?: boolean;
}

// src/components/core/Navigation.tsx
interface NavigationProps {
    user?: User;
    currentPath: string;
}

// src/components/core/AuthGuard.tsx
interface AuthGuardProps {
    children: React.ReactNode;
    requiredRole?: UserRole;
}
```

### 2. Feature Components

#### Discovery System
```typescript
// src/components/discovery/LookGrid.tsx
interface LookGridProps {
    looks: Look[];
    layout: 'pinterest' | 'grid' | 'masonry';
    onLookClick: (look: Look) => void;
}

// src/components/discovery/FilterPanel.tsx
interface FilterPanelProps {
    filters: Filter[];
    selectedFilters: string[];
    onFilterChange: (filters: string[]) => void;
}

// src/components/discovery/SearchBar.tsx
interface SearchBarProps {
    onSearch: (query: string) => void;
    suggestions?: string[];
    recentSearches?: string[];
}
```

#### Virtual Try-On
```typescript
// src/components/ar/VirtualMirror.tsx
interface VirtualMirrorProps {
    products: Product[];
    onCapture: (image: string) => void;
}

// src/components/ar/ProductOverlay.tsx
interface ProductOverlayProps {
    product: Product;
    position: Position;
    opacity: number;
}
```

#### Professional Features
```typescript
// src/components/professional/Portfolio.tsx
interface PortfolioProps {
    professional: Professional;
    looks: Look[];
    editable?: boolean;
}

// src/components/professional/Booking.tsx
interface BookingProps {
    professional: Professional;
    availableSlots: TimeSlot[];
    onBookingRequest: (slot: TimeSlot) => void;
}
```

### 3. Shared Components

```typescript
// src/components/shared/Button.tsx
interface ButtonProps {
    variant: 'primary' | 'secondary' | 'ghost';
    size: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

// src/components/shared/Modal.tsx
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    size?: 'sm' | 'md' | 'lg';
}

// src/components/shared/Card.tsx
interface CardProps {
    variant?: 'default' | 'hover' | 'selected';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}
```

## Modern Architecture Features

### 1. Performance Optimizations
- **Server Components**: Leveraging Next.js 14 Server Components for improved performance
- **Streaming SSR**: Implementing streaming server-side rendering for faster page loads
- **React Suspense**: Using Suspense boundaries for optimal loading states
- **Dynamic Imports**: Implementing code splitting with dynamic imports
- **Image Optimization**: Using Next.js Image component with automatic optimization

### 2. State Management
- **Server State**: Using TanStack Query (React Query) for server state management
- **Client State**: Implementing Zustand for lightweight client-state management
- **Form Management**: Using React Hook Form with Zod validation
- **Persistent Storage**: Leveraging localStorage with type-safe wrappers

### 3. Modern UI Implementation
- **Tailwind CSS**: Using JIT compiler for zero-runtime CSS
- **CSS-in-JS**: Using vanilla-extract for type-safe CSS
- **Component Library**: Leveraging shadcn/ui with Radix UI primitives
- **Motion**: Using Framer Motion for fluid animations
- **Color Modes**: Supporting dark/light modes with CSS variables

### 4. Developer Experience
- **TypeScript**: Strict mode with path aliases
- **ESLint**: Custom rule set for React best practices
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for code quality
- **Testing**: Vitest with React Testing Library

### 5. Modern Features
```typescript
// src/hooks/useIntersectionObserver.ts
export const useIntersectionObserver = ({
    target,
    onIntersect,
    threshold = 0.1,
    rootMargin = '0px',
    enabled = true,
}: IntersectionObserverProps) => {
    useEffect(() => {
        if (!enabled || !target.current) return;
        
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((entry) => entry.isIntersecting && onIntersect()),
            { threshold, rootMargin }
        );
        
        observer.observe(target.current);
        return () => observer.disconnect();
    }, [target, enabled, onIntersect, threshold, rootMargin]);
};

// src/hooks/useMediaQuery.ts
export const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);
    
    useEffect(() => {
        const media = window.matchMedia(query);
        setMatches(media.matches);
        
        const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);
    
    return matches;
};

// src/lib/analytics.ts
export const analytics = {
    pageView: (url: string) => {
        if (process.env.NODE_ENV === 'production') {
            // Implementation
        }
    },
    event: (name: string, properties?: Record<string, unknown>) => {
        if (process.env.NODE_ENV === 'production') {
            // Implementation
        }
    }
};
```

## State Management

### 1. Context Providers

```typescript
// src/contexts/AuthContext.tsx
interface AuthContextType {
    user: User | null;
    login: (credentials: Credentials) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

// src/contexts/ThemeContext.tsx
interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

// src/contexts/DiscoveryContext.tsx
interface DiscoveryContextType {
    filters: Filter[];
    searchQuery: string;
    updateFilters: (filters: Filter[]) => void;
    updateSearch: (query: string) => void;
}
```

### 2. Custom Hooks

```typescript
// src/hooks/useAuth.ts
const useAuth = () => {
    const { user, login, logout } = useContext(AuthContext);
    return { user, login, logout };
};

// src/hooks/useDiscovery.ts
const useDiscovery = () => {
    const [looks, setLooks] = useState<Look[]>([]);
    const [loading, setLoading] = useState(false);
    
    const fetchLooks = async (filters: Filter[]) => {
        setLoading(true);
        // Implementation
        setLoading(false);
    };
    
    return { looks, loading, fetchLooks };
};
```

## Routing Structure

```typescript
// src/app/layout.tsx
interface RootLayoutProps {
    children: React.ReactNode;
}

// Page Routes
interface Routes {
    home: '/';
    discovery: '/discovery';
    look: '/look/[id]';
    professional: '/professional/[id]';
    profile: '/profile';
    settings: '/settings';
}
```

## API Integration

```typescript
// src/services/api.ts
interface APIClient {
    looks: {
        search: (query: string) => Promise<Look[]>;
        getById: (id: string) => Promise<Look>;
        create: (look: Look) => Promise<Look>;
    };
    
    professionals: {
        search: (filters: Filter[]) => Promise<Professional[]>;
        getById: (id: string) => Promise<Professional>;
        update: (id: string, data: Partial<Professional>) => Promise<Professional>;
    };
    
    auth: {
        login: (credentials: Credentials) => Promise<User>;
        register: (data: RegistrationData) => Promise<User>;
        resetPassword: (email: string) => Promise<void>;
    };
}
```

## Styling System

```typescript
// tailwind.config.ts
module.exports = {
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fdf2f8',
                    100: '#fce7f3',
                    // ... other shades
                },
                secondary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    // ... other shades
                }
            },
            spacing: {
                // Custom spacing scale
            },
            borderRadius: {
                // Custom border radius scale
            }
        }
    }
};
```

## Performance Optimization

### 1. Image Optimization
```typescript
// src/components/shared/OptimizedImage.tsx
interface OptimizedImageProps {
    src: string;
    alt: string;
    sizes?: string;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
}
```

### 2. Code Splitting
```typescript
// src/components/features/index.ts
export const VirtualMirror = dynamic(() => import('./VirtualMirror'), {
    loading: () => <LoadingSpinner />,
    ssr: false
});
```

## Testing Strategy

### 1. Unit Tests
```typescript
// src/components/Button.test.tsx
describe('Button Component', () => {
    it('renders correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });
    
    it('handles click events', () => {
        const onClick = jest.fn();
        render(<Button onClick={onClick}>Click me</Button>);
        fireEvent.click(screen.getByText('Click me'));
        expect(onClick).toHaveBeenCalled();
    });
});
```

### 2. Integration Tests
```typescript
// src/features/Discovery.test.tsx
describe('Discovery Feature', () => {
    it('loads and displays looks', async () => {
        render(<Discovery />);
        await waitFor(() => {
            expect(screen.getByTestId('looks-grid')).toBeInTheDocument();
        });
    });
});
```

## Error Handling

```typescript
// src/components/shared/ErrorBoundary.tsx
interface ErrorBoundaryProps {
    fallback: React.ReactNode;
    children: React.ReactNode;
}

// src/components/shared/ErrorMessage.tsx
interface ErrorMessageProps {
    error: Error;
    retry?: () => void;
}
```

## Accessibility

```typescript
// src/components/shared/AccessibleButton.tsx
interface AccessibleButtonProps extends ButtonProps {
    ariaLabel?: string;
    ariaDescribedBy?: string;
    role?: string;
}

// src/hooks/useA11y.ts
const useA11y = () => {
    const [announcements, setAnnouncements] = useState<string[]>([]);
    const announce = (message: string) => {
        setAnnouncements([...announcements, message]);
    };
    return { announcements, announce };
};
```

## Analytics Integration

```typescript
// src/services/analytics.ts
interface AnalyticsService {
    trackPageView: (page: string) => void;
    trackEvent: (name: string, properties?: Record<string, any>) => void;
    trackError: (error: Error) => void;
}
```

## Security Measures

```typescript
// src/utils/security.ts
interface SecurityUtils {
    sanitizeInput: (input: string) => string;
    validateToken: (token: string) => boolean;
    encryptData: (data: any) => string;
}
```

## Deployment Configuration

```typescript
// next.config.js
module.exports = {
    images: {
        domains: ['cdn.makeupdiscovery.com'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    },
    i18n: {
        locales: ['en', 'es', 'fr'],
        defaultLocale: 'en',
    },
    experimental: {
        serverActions: true,
    },
};

# Component Library

## Core Components

### 1. Design System
```typescript
// components/design-system/Theme.ts
export const theme = {
  colors: {
    primary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      // ... other shades
    },
    secondary: {
      // ... color shades
    }
  },
  typography: {
    fonts: {
      sans: 'Inter, system-ui, sans-serif',
      serif: 'Playfair Display, serif'
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      // ... other sizes
    }
  },
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',
    // ... other spacing values
  }
};
```

### 2. Layout Components
```typescript
// components/layout/Container.tsx
export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'default',
  className
}) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    default: 'max-w-5xl',
    lg: 'max-w-7xl'
  };

  return (
    <div className={clsx(
      'mx-auto px-4 sm:px-6 lg:px-8',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
};
```

### 3. Form Components
```typescript
// components/forms/Input.tsx
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, ...props }, ref) => {
    const id = useId();
    
    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            'block w-full rounded-md border-gray-300 shadow-sm',
            'focus:border-primary-500 focus:ring-primary-500',
            error && 'border-red-300'
          )}
          {...props}
        />
        {(error || helper) && (
          <p className={clsx(
            'text-sm',
            error ? 'text-red-600' : 'text-gray-500'
          )}>
            {error || helper}
          </p>
        )}
      </div>
    );
  }
);
```

### 4. Navigation Components
```typescript
// components/navigation/Navbar.tsx
export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { cart } = useCart();
  
  return (
    <nav className="bg-white shadow">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Logo />
          <MainMenu />
          <div className="flex items-center space-x-4">
            <SearchButton />
            <CartButton count={cart.items.length} />
            <UserMenu user={user} />
          </div>
        </div>
      </Container>
    </nav>
  );
};
```

### 5. Card Components
```typescript
// components/cards/ProductCard.tsx
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart
}) => {
  const { image, name, price, rating } = product;
  
  return (
    <div className="group relative">
      <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg">
        <OptimizedImage
          src={image}
          alt={name}
          className="object-cover transition group-hover:scale-105"
        />
        <QuickView product={product} />
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-medium">{name}</h3>
        <div className="flex items-center justify-between">
          <Price amount={price} />
          <Rating value={rating} />
        </div>
        <AddToCartButton onClick={() => onAddToCart(product)} />
      </div>
    </div>
  );
};
```

### 6. Modal Components
```typescript
// components/modals/Modal.tsx
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <div className="relative w-full max-w-md rounded-lg bg-white p-6">
          <Dialog.Title className="text-lg font-medium">
            {title}
          </Dialog.Title>
          <div className="mt-4">{children}</div>
          <CloseButton onClick={onClose} />
        </div>
      </div>
    </Dialog>
  );
};
```

### 7. Loading States
```typescript
// components/feedback/Loading.tsx
export const Loading: React.FC<LoadingProps> = ({
  size = 'default',
  variant = 'spinner'
}) => {
  if (variant === 'spinner') {
    return (
      <div
        className={clsx(
          'animate-spin rounded-full border-t-2 border-primary-500',
          {
            'h-4 w-4': size === 'sm',
            'h-6 w-6': size === 'default',
            'h-8 w-8': size === 'lg'
          }
        )}
      />
    );
  }

  if (variant === 'skeleton') {
    return (
      <div
        className={clsx(
          'animate-pulse rounded bg-gray-200',
          {
            'h-4': size === 'sm',
            'h-6': size === 'default',
            'h-8': size === 'lg'
          }
        )}
      />
    );
  }
};
```

### 8. Feedback Components
```typescript
// components/feedback/Toast.tsx
export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000
}) => {
  return (
    <div
      role="alert"
      className={clsx(
        'fixed bottom-4 right-4 rounded-lg p-4 shadow-lg',
        {
          'bg-blue-50 text-blue-700': type === 'info',
          'bg-green-50 text-green-700': type === 'success',
          'bg-red-50 text-red-700': type === 'error'
        }
      )}
    >
      <div className="flex items-center space-x-2">
        <StatusIcon type={type} />
        <p>{message}</p>
      </div>
    </div>
  );
};
```

### 9. Data Display
```typescript
// components/data/Table.tsx
export const Table: React.FC<TableProps> = ({
  columns,
  data,
  onSort,
  onFilter
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    { columns, data },
    useSortBy,
    useFilters
  );

  return (
    <div className="overflow-x-auto">
      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-200"
      >
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-6 py-3 text-left text-sm font-medium"
                >
                  {column.render('Header')}
                  <SortIndicator column={column} />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td
                    {...cell.getCellProps()}
                    className="px-6 py-4 text-sm"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
```

### 10. Interactive Components
```typescript
// components/interactive/Carousel.tsx
export const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = true,
  interval = 5000
}) => {
  const [current, setCurrent] = useState(0);
  const length = items.length;

  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setCurrent(current => (current + 1) % length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, length]);

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${current * 100}%)`
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <CarouselControls
        current={current}
        length={length}
        onChange={setCurrent}
      />
    </div>
  );
};
```

## Component Guidelines

### 1. Composition
- Use composition over inheritance
- Keep components focused and single-purpose
- Implement proper prop drilling prevention

### 2. Performance
- Implement proper memoization
- Use lazy loading where appropriate
- Optimize re-renders

### 3. Accessibility
- Follow ARIA best practices
- Ensure keyboard navigation
- Maintain proper focus management

### 4. Testing
- Write unit tests for all components
- Include integration tests
- Test accessibility requirements

## Additional Resources

- [Component Storybook](../../storybook)
- [Accessibility Guide](../../guides/frontend/ACCESSIBILITY.md)
- [Performance Optimization](../../guides/frontend/PERFORMANCE.md)
- [Testing Guide](../../guides/testing/FRONTEND_TESTING.md)

# Hybrid Frontend Architecture

## Overview

Our frontend combines two distinct user experiences:
1. **Discovery Interface** (Pinterest-style)
2. **Directory Interface** (Professional listings)

## 1. Discovery Interface

### Layout
```typescript
// components/discovery/DiscoveryGrid.tsx
export const DiscoveryGrid: React.FC = () => {
  const { posts } = useMasonryLayout();
  
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
      {posts.map(post => (
        <DiscoveryCard
          key={post.id}
          post={post}
          className="mb-4 break-inside-avoid"
        />
      ))}
    </div>
  );
};
```

### Features
- Masonry layout for visual content
- Infinite scroll
- Quick view overlays
- Save/bookmark functionality
- Social sharing
- Visual search

### Content Types
- Makeup looks
- Tutorial snippets
- Product showcases
- Before/After transformations
- Professional portfolios

## 2. Directory Interface

### Layout
```typescript
// components/directory/DirectoryLayout.tsx
export const DirectoryLayout: React.FC = () => {
  const { filters } = useDirectoryFilters();
  const { results } = useDirectorySearch();
  
  return (
    <div className="grid grid-cols-12 gap-6">
      <aside className="col-span-3">
        <FilterPanel filters={filters} />
      </aside>
      <main className="col-span-9">
        <SearchResults results={results} />
      </main>
    </div>
  );
};
```

### Features
- Advanced search filters
- Location-based search
- Professional profiles
- Booking system
- Reviews and ratings
- Verification badges

### Content Types
- Professional listings
- Beauty schools
- Salons and studios
- Product retailers
- Training courses

## Integration Points

### 1. Navigation
```typescript
// components/navigation/HybridNavigation.tsx
export const HybridNavigation: React.FC = () => {
  const { view, setView } = useView();
  
  return (
    <nav className="border-b">
      <Container>
        <div className="flex space-x-4">
          <ViewToggle
            view={view}
            onChange={setView}
            options={[
              {
                id: 'discovery',
                label: 'Discover',
                icon: <SparklesIcon />
              },
              {
                id: 'directory',
                label: 'Professionals',
                icon: <UserGroupIcon />
              }
            ]}
          />
          <SearchBar mode={view} />
          <UserMenu />
        </div>
      </Container>
    </nav>
  );
};
```

### 2. Shared Components
```typescript
// components/shared/ProfileCard.tsx
export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  variant = 'discovery'
}) => {
  const { name, image, rating, specialty } = profile;
  
  return (
    <div className={clsx(
      'rounded-lg shadow',
      variant === 'discovery' ? 'aspect-square' : 'aspect-video'
    )}>
      <div className="relative h-full">
        <OptimizedImage
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60">
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white">{name}</h3>
            <p className="text-white/80">{specialty}</p>
            <Rating value={rating} theme="light" />
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 3. State Management
```typescript
// store/hybridStore.ts
interface HybridState {
  view: 'discovery' | 'directory';
  filters: Filters;
  search: {
    query: string;
    results: SearchResult[];
  };
  user: {
    saved: SavedItem[];
    recent: RecentView[];
  };
}

export const useHybridStore = create<HybridState>((set) => ({
  view: 'discovery',
  filters: initialFilters,
  search: {
    query: '',
    results: []
  },
  user: {
    saved: [],
    recent: []
  },
  setView: (view) => set({ view }),
  updateFilters: (filters) => set({ filters }),
  // ... other actions
}));
```

## User Experience Flow

1. **Initial Landing**
   - Default to Discovery view
   - Show trending/popular content
   - Quick access to professional search

2. **Discovery to Directory**
   - Seamless transition when viewing professional profiles
   - Maintain context between views
   - Shared search functionality

3. **Directory to Discovery**
   - View professional's portfolio in Discovery layout
   - Related looks and tutorials
   - Booking integration

## Performance Considerations

### 1. View Switching
```typescript
// components/core/ViewManager.tsx
export const ViewManager: React.FC = () => {
  const view = useView();
  
  return (
    <Suspense
      fallback={<ViewSkeleton />}
    >
      {view === 'discovery' ? (
        <DiscoveryView />
      ) : (
        <DirectoryView />
      )}
    </Suspense>
  );
};
```

### 2. Data Loading
- Lazy load images
- Infinite scroll with virtualization
- Prefetch on hover
- Cache view state

### 3. Transitions
- Smooth animations between views
- Maintain scroll position
- Preserve form state
- Loading states

## Mobile Considerations

### 1. Responsive Design
```typescript
// hooks/useResponsiveLayout.ts
export const useResponsiveLayout = () => {
  const { width } = useWindowSize();
  
  return {
    isCompact: width < 768,
    columns: width < 640 ? 1 : width < 1024 ? 2 : 3,
    showFilters: width >= 1024
  };
};
```

### 2. Touch Interactions
- Swipe between views
- Touch-friendly filters
- Mobile-optimized booking
- Native sharing

## Future Enhancements

1. **Enhanced Discovery**
   - AI-powered content curation
   - Visual similarity search
   - User-generated collections
   - Live streaming integration

2. **Directory Improvements**
   - Real-time availability
   - Instant booking
   - Video consultations
   - Digital payments

3. **Integration Features**
   - Unified search experience
   - Cross-view recommendations
   - Shared user preferences
   - Analytics tracking

## Additional Resources

- [Component Library](../components/OVERVIEW.md)
- [State Management](./STATE_MANAGEMENT.md)
- [Performance Guide](../guides/PERFORMANCE.md)
- [Mobile Strategy](../guides/MOBILE.md)

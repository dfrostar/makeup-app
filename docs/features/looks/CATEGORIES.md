# Makeup Looks Categories

## Database Schema

```typescript
// types/looks.ts
interface Look {
  id: string;
  name: string;
  category: LookCategory;
  style: LookStyle;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  products: Product[];
  steps: TutorialStep[];
  images: {
    main: string;
    before?: string;
    after: string;
    steps: string[];
  };
  artist: Professional;
  tags: string[];
  likes: number;
  saves: number;
  comments: Comment[];
}

interface LookCategory {
  id: string;
  name: string;
  description: string;
  styles: LookStyle[];
}

interface LookStyle {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  recommendedProducts: ProductCategory[];
}

interface TutorialStep {
  order: number;
  description: string;
  image?: string;
  video?: string;
  products: Product[];
  tips: string[];
}
```

## Look Categories

### 1. Natural and Glowing Looks

#### No-Makeup Makeup
```typescript
{
  name: "No-Makeup Makeup",
  characteristics: [
    "Natural-looking complexion",
    "Subtle enhancement",
    "Minimal product visibility"
  ],
  recommendedProducts: [
    "Tinted Moisturizer",
    "Concealer",
    "Clear Brow Gel",
    "Cream Blush",
    "Mascara"
  ],
  description: "Enhances natural features while maintaining a bare-skin appearance"
}
```

#### Dewy Makeup
```typescript
{
  name: "Dewy Makeup",
  characteristics: [
    "Luminous finish",
    "Hydrated appearance",
    "Strategic highlighting"
  ],
  recommendedProducts: [
    "Illuminating Primer",
    "Dewy Foundation",
    "Liquid Highlighter",
    "Facial Mist",
    "Glossy Lip Product"
  ],
  description: "Creates a fresh, glowing complexion with emphasis on luminosity"
}
```

#### Ultra-Fresh Skin
```typescript
{
  name: "Ultra-Fresh Skin",
  characteristics: [
    "Hydrated base",
    "Skin-like finish",
    "Minimal coverage"
  ],
  recommendedProducts: [
    "Skin Tint",
    "Face Oil",
    "Cream Bronzer",
    "Hydrating Setting Spray"
  ],
  description: "Focuses on skin health and natural radiance"
}
```

### 2. Bold and Dramatic Styles

#### Glam Makeup
```typescript
{
  name: "Glam Makeup",
  characteristics: [
    "Full coverage",
    "Dramatic eyes",
    "Defined features"
  ],
  recommendedProducts: [
    "Full Coverage Foundation",
    "Shimmer Eyeshadow",
    "False Lashes",
    "Contour Kit",
    "Setting Powder"
  ],
  description: "Sophisticated and dramatic look suitable for special occasions"
}
```

#### Gothic Makeup
```typescript
{
  name: "Gothic Makeup",
  characteristics: [
    "Dark tones",
    "Intense eyes",
    "Bold lips"
  ],
  recommendedProducts: [
    "Black Eyeshadow",
    "Dark Lipstick",
    "Pale Foundation",
    "Heavy Contour"
  ],
  description: "Dark and dramatic aesthetic with intense features"
}
```

#### Graphic Eyeliner
```typescript
{
  name: "Graphic Eyeliner",
  characteristics: [
    "Bold lines",
    "Creative patterns",
    "Artistic expression"
  ],
  recommendedProducts: [
    "Liquid Eyeliner",
    "Colored Liner",
    "Eye Primer",
    "Setting Spray"
  ],
  description: "Creative and artistic eyeliner designs"
}
```

### 3. Colorful and Playful Trends

#### Colored Mascara
```typescript
{
  name: "Colored Mascara",
  characteristics: [
    "Vibrant lashes",
    "Pop of color",
    "Playful expression"
  ],
  recommendedProducts: [
    "Colored Mascara",
    "White Lash Primer",
    "Clear Brow Gel"
  ],
  description: "Fun and expressive look using non-traditional mascara colors"
}
```

#### Monochromatic Makeup
```typescript
{
  name: "Monochromatic Makeup",
  characteristics: [
    "Color coordination",
    "Harmonious look",
    "Unified palette"
  ],
  recommendedProducts: [
    "Matching Eyeshadow",
    "Coordinating Blush",
    "Similar-toned Lipstick"
  ],
  description: "Coordinated look using shades within the same color family"
}
```

### 4. Retro-Inspired Looks

#### Vintage Glam
```typescript
{
  name: "Vintage Glam",
  characteristics: [
    "Classic techniques",
    "Era-specific features",
    "Timeless appeal"
  ],
  recommendedProducts: [
    "Red Lipstick",
    "Liquid Eyeliner",
    "Setting Powder",
    "Brow Pencil"
  ],
  description: "Classic makeup looks inspired by different decades"
}
```

## Masonry Layout Implementation

### 1. Look Card Component
```typescript
// components/looks/LookCard.tsx
export const LookCard: React.FC<LookCardProps> = ({
  look,
  size = 'medium'
}) => {
  const { isHovered, ref } = useHover();
  
  return (
    <div
      ref={ref}
      className={clsx(
        'rounded-lg overflow-hidden',
        size === 'large' && 'col-span-2 row-span-2'
      )}
    >
      <div className="relative">
        <OptimizedImage
          src={look.images.main}
          alt={look.name}
          className="object-cover"
        />
        {isHovered && (
          <LookOverlay
            artist={look.artist}
            products={look.products}
            difficulty={look.difficulty}
          />
        )}
      </div>
      <LookInfo
        name={look.name}
        category={look.category}
        stats={{
          likes: look.likes,
          saves: look.saves
        }}
      />
    </div>
  );
};
```

### 2. Masonry Grid
```typescript
// components/looks/LookGrid.tsx
export const LookGrid: React.FC = () => {
  const { looks } = useLooks();
  const columns = useBreakpointValue({ base: 2, md: 3, lg: 4 });
  
  return (
    <Masonry
      columns={columns}
      spacing={4}
      items={looks}
      render={(look) => (
        <LookCard
          key={look.id}
          look={look}
          size={getCardSize(look)}
        />
      )}
    />
  );
};

const getCardSize = (look: Look): 'medium' | 'large' => {
  // Determine size based on engagement metrics
  return look.likes > 1000 ? 'large' : 'medium';
};
```

### 3. Look Filtering
```typescript
// components/looks/LookFilters.tsx
export const LookFilters: React.FC = () => {
  const { filters, setFilter } = useLookFilters();
  
  return (
    <div className="space-y-4">
      <CategoryFilter
        selected={filters.category}
        onChange={(cat) => setFilter('category', cat)}
      />
      <DifficultyFilter
        selected={filters.difficulty}
        onChange={(diff) => setFilter('difficulty', diff)}
      />
      <TimeFilter
        selected={filters.duration}
        onChange={(time) => setFilter('duration', time)}
      />
    </div>
  );
};
```

### 4. Look Search
```typescript
// features/looks/lookSearch.ts
export const searchLooks = async (params: LookSearchParams) => {
  const { query, filters, sort } = params;
  
  return elasticClient.search({
    index: 'looks',
    body: {
      query: {
        bool: {
          must: [
            { match: { name: query } },
            { terms: { category: filters.categories } }
          ],
          filter: [
            { term: { difficulty: filters.difficulty } },
            { range: { duration: filters.duration } }
          ]
        }
      },
      sort: buildSortQuery(sort)
    }
  });
};
```

## Look Interaction Features

### 1. Save and Like
```typescript
// features/looks/interactions.ts
export const useLookInteractions = (lookId: string) => {
  const { mutate: like } = useMutation({
    mutationFn: () => api.post(`/looks/${lookId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries(['look', lookId]);
    }
  });

  const { mutate: save } = useMutation({
    mutationFn: () => api.post(`/looks/${lookId}/save`),
    onSuccess: () => {
      queryClient.invalidateQueries(['saved-looks']);
    }
  });

  return { like, save };
};
```

### 2. Tutorial View
```typescript
// components/looks/TutorialView.tsx
export const TutorialView: React.FC<TutorialViewProps> = ({
  look
}) => {
  const { currentStep, next, prev } = useTutorialSteps(look.steps);
  
  return (
    <div className="space-y-6">
      <StepProgress
        current={currentStep}
        total={look.steps.length}
      />
      <StepContent
        step={look.steps[currentStep]}
        products={look.products}
      />
      <StepNavigation
        onNext={next}
        onPrev={prev}
        isFirst={currentStep === 0}
        isLast={currentStep === look.steps.length - 1}
      />
    </div>
  );
};
```

## Additional Resources

- [Look API Documentation](../api/looks/README.md)
- [Masonry Grid Components](../components/masonry/README.md)
- [Tutorial System](../features/tutorials/README.md)
- [Search Implementation](../features/search/README.md)

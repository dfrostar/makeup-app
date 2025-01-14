# Product Categories

## Database Schema

```typescript
// types/products.ts
interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  subCategory: SubCategory;
  description: string;
  ingredients: string[];
  shades?: Shade[];
  price: {
    amount: number;
    currency: string;
  };
  attributes: ProductAttribute[];
  rating: number;
  reviews: Review[];
  images: {
    main: string;
    gallery: string[];
  };
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  description: string;
  attributes: ProductAttribute[];
}

interface ProductAttribute {
  name: string;
  value: string;
  type: 'finish' | 'coverage' | 'skin_type' | 'concern' | 'benefit';
}

interface Shade {
  id: string;
  name: string;
  hexColor: string;
  undertone: 'warm' | 'cool' | 'neutral';
  intensity: 'light' | 'medium' | 'deep';
}
```

## Category Hierarchy

### 1. Base Products

#### Primer
```typescript
{
  name: "Face Primer",
  attributes: [
    { name: "finish", values: ["matte", "dewy", "natural"] },
    { name: "concern", values: ["pores", "texture", "oil-control", "hydration"] },
    { name: "skin_type", values: ["oily", "dry", "combination", "sensitive"] }
  ],
  description: "Creates smooth canvas for makeup application, extends wear time"
}
```

#### Foundation
```typescript
{
  name: "Foundation",
  attributes: [
    { name: "coverage", values: ["sheer", "medium", "full"] },
    { name: "finish", values: ["matte", "dewy", "natural", "radiant"] },
    { name: "formulation", values: ["liquid", "cream", "powder", "stick"] },
    { name: "skin_type", values: ["oily", "dry", "combination", "sensitive"] }
  ],
  description: "Base makeup that evens out skin tone and provides coverage"
}
```

#### BB/CC Cream
```typescript
{
  name: "BB/CC Cream",
  attributes: [
    { name: "coverage", values: ["light", "medium"] },
    { name: "benefits", values: ["SPF", "hydration", "anti-aging", "brightening"] },
    { name: "skin_type", values: ["all", "oily", "dry", "combination"] }
  ],
  description: "Light coverage with skincare benefits"
}
```

#### Concealer
```typescript
{
  name: "Concealer",
  attributes: [
    { name: "coverage", values: ["medium", "full"] },
    { name: "concern", values: ["dark circles", "blemishes", "redness"] },
    { name: "formulation", values: ["liquid", "cream", "stick"] }
  ],
  description: "Targeted coverage for specific areas"
}
```

### 2. Setting Products

#### Setting Powder
```typescript
{
  name: "Setting Powder",
  attributes: [
    { name: "type", values: ["loose", "pressed"] },
    { name: "finish", values: ["matte", "natural", "luminous"] },
    { name: "coverage", values: ["sheer", "light"] }
  ],
  description: "Sets makeup and controls shine"
}
```

#### Setting Spray
```typescript
{
  name: "Setting Spray",
  attributes: [
    { name: "finish", values: ["matte", "dewy", "natural"] },
    { name: "benefit", values: ["long-wearing", "hydrating", "oil-control"] }
  ],
  description: "Locks makeup in place and provides finish"
}
```

### 3. Contouring and Highlighting

#### Bronzer
```typescript
{
  name: "Bronzer",
  attributes: [
    { name: "finish", values: ["matte", "shimmer"] },
    { name: "formulation", values: ["powder", "cream", "liquid"] },
    { name: "undertone", values: ["warm", "neutral", "cool"] }
  ],
  description: "Adds warmth and dimension to the face"
}
```

#### Contour
```typescript
{
  name: "Contour",
  attributes: [
    { name: "formulation", values: ["powder", "cream", "stick"] },
    { name: "undertone", values: ["cool", "neutral"] },
    { name: "intensity", values: ["light", "medium", "deep"] }
  ],
  description: "Creates shadow and definition"
}
```

#### Highlighter
```typescript
{
  name: "Highlighter",
  attributes: [
    { name: "finish", values: ["metallic", "pearl", "glitter", "natural"] },
    { name: "formulation", values: ["powder", "cream", "liquid", "stick"] },
    { name: "tone", values: ["gold", "silver", "rose gold", "bronze"] }
  ],
  description: "Adds glow and light-reflection"
}
```

### 4. Eye Makeup

#### Eye Primer
```typescript
{
  name: "Eye Primer",
  attributes: [
    { name: "finish", values: ["matte", "tacky"] },
    { name: "benefit", values: ["longevity", "color-intensifying", "crease-prevention"] }
  ],
  description: "Preps eyelids for eyeshadow application"
}
```

#### Eyeshadow
```typescript
{
  name: "Eyeshadow",
  attributes: [
    { name: "finish", values: ["matte", "shimmer", "metallic", "glitter"] },
    { name: "formulation", values: ["powder", "cream", "liquid"] },
    { name: "type", values: ["single", "palette", "stick"] }
  ],
  description: "Adds color and dimension to eyes"
}
```

#### Eyeliner
```typescript
{
  name: "Eyeliner",
  attributes: [
    { name: "formulation", values: ["pencil", "liquid", "gel", "powder"] },
    { name: "finish", values: ["matte", "shimmer"] },
    { name: "waterproof", values: ["yes", "no"] }
  ],
  description: "Defines and shapes eyes"
}
```

#### Mascara
```typescript
{
  name: "Mascara",
  attributes: [
    { name: "effect", values: ["lengthening", "volumizing", "curling", "defining"] },
    { name: "waterproof", values: ["yes", "no"] },
    { name: "brush_type", values: ["traditional", "curved", "comb", "ball"] }
  ],
  description: "Enhances lashes"
}
```

### 5. Lip Makeup

#### Lipstick
```typescript
{
  name: "Lipstick",
  attributes: [
    { name: "finish", values: ["matte", "cream", "satin", "metallic", "gloss"] },
    { name: "formulation", values: ["traditional", "liquid", "pencil"] },
    { name: "longevity", values: ["regular", "long-wearing", "transfer-proof"] }
  ],
  description: "Adds color to lips"
}
```

#### Lip Gloss
```typescript
{
  name: "Lip Gloss",
  attributes: [
    { name: "finish", values: ["clear", "shimmer", "metallic", "cream"] },
    { name: "effect", values: ["plumping", "hydrating", "tinting"] }
  ],
  description: "Adds shine and dimension to lips"
}
```

## Implementation

### 1. Category Navigation
```typescript
// components/products/CategoryNav.tsx
export const CategoryNav: React.FC = () => {
  const { categories } = useCategories();
  
  return (
    <nav className="space-y-4">
      {categories.map(category => (
        <CategoryItem
          key={category.id}
          category={category}
          subCategories={category.subCategories}
        />
      ))}
    </nav>
  );
};
```

### 2. Product Filters
```typescript
// components/products/ProductFilters.tsx
export const ProductFilters: React.FC = () => {
  const { category } = useCategory();
  const { filters, setFilter } = useFilters();
  
  return (
    <div className="space-y-6">
      {category.attributes.map(attr => (
        <FilterGroup
          key={attr.name}
          name={attr.name}
          options={attr.values}
          selected={filters[attr.name]}
          onChange={value => setFilter(attr.name, value)}
        />
      ))}
    </div>
  );
};
```

### 3. Product Card
```typescript
// components/products/ProductCard.tsx
export const ProductCard: React.FC<ProductCardProps> = ({
  product
}) => {
  return (
    <div className="group relative">
      <div className="aspect-w-4 aspect-h-5">
        <OptimizedImage
          src={product.images.main}
          alt={product.name}
          className="object-cover"
        />
        <QuickView product={product} />
      </div>
      <div className="mt-4 space-y-2">
        <Brand name={product.brand} />
        <h3 className="text-sm font-medium">{product.name}</h3>
        <div className="flex items-center justify-between">
          <Price amount={product.price.amount} />
          <Rating value={product.rating} />
        </div>
        {product.shades && (
          <ShadeSelector shades={product.shades} />
        )}
      </div>
    </div>
  );
};
```

## Search Implementation

### 1. Product Search
```typescript
// features/search/productSearch.ts
export const productSearch = async (params: SearchParams) => {
  const { query, filters, category } = params;
  
  return elasticClient.search({
    index: 'products',
    body: {
      query: {
        bool: {
          must: [
            { match: { name: query } },
            { term: { category: category } }
          ],
          filter: buildFilters(filters)
        }
      },
      aggs: buildAggregations(category)
    }
  });
};
```

### 2. Filters
```typescript
// features/search/filterBuilder.ts
export const buildFilters = (filters: Filters) => {
  return Object.entries(filters).map(([key, value]) => ({
    term: { [`attributes.${key}`]: value }
  }));
};
```

## Additional Resources

- [Product API Documentation](../api/products/README.md)
- [Search Implementation](../features/search/README.md)
- [Filter Components](../components/filters/README.md)
- [Product Management](../admin/products/README.md)

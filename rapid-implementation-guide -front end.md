# Rapid Implementation Guide: Directory Website

## 1. Frontend Setup (Week 1-2)

### Day 1-2: Project Initialization
```bash
# Initialize Next.js project with TypeScript
npx create-next-app@latest directory-site --typescript --tailwind
cd directory-site

# Install core dependencies
npm install @prisma/client @tanstack/react-query axios formik yup
npm install -D @types/node @types/react @typescript-eslint/parser
```

### Day 3-4: Core Components
```typescript
// app/components/SearchBar.tsx
import { useState } from 'react';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <input 
        type="text"
        className="w-full px-4 py-2 rounded-lg border"
        placeholder="Search makeup artists, salons..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

// app/components/ListingCard.tsx
interface ListingCardProps {
  business: {
    id: string;
    name: string;
    description: string;
    rating: number;
    image: string;
  };
}

export const ListingCard = ({ business }: ListingCardProps) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <img src={business.image} alt={business.name} className="w-full h-48 object-cover rounded" />
      <h3 className="text-lg font-semibold mt-2">{business.name}</h3>
      <p className="text-gray-600">{business.description}</p>
      <div className="flex items-center mt-2">
        <StarRating rating={business.rating} />
      </div>
    </div>
  );
};
```

### Day 5-7: Page Setup
```typescript
// app/page.tsx
import { SearchBar, ListingCard, Filters } from './components';

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Listing cards will be rendered here */}
      </div>
    </main>
  );
}
```

## 2. Backend Setup (Week 2-3)

### Day 1-2: Database Setup
```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Business {
  id          String   @id @default(cuid())
  name        String
  description String
  category    String
  location    Json     // Stores latitude and longitude
  address     String
  phone       String?
  email       String
  website     String?
  rating      Float    @default(0)
  reviews     Review[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Review {
  id         String   @id @default(cuid())
  rating     Int
  comment    String?
  businessId String
  business   Business @relation(fields: [businessId], references: [id])
  createdAt  DateTime @default(now())
}
```

### Day 3-5: API Routes
```typescript
// app/api/businesses/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('query');

  const businesses = await prisma.business.findMany({
    where: {
      AND: [
        category ? { category } : {},
        query ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        } : {},
      ],
    },
    include: {
      reviews: true,
    },
  });

  return NextResponse.json(businesses);
}
```

## 3. Search Implementation (Week 3-4)

### Day 1-3: Elasticsearch Setup
```typescript
// lib/elasticsearch.ts
import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
});

export async function indexBusiness(business) {
  await client.index({
    index: 'businesses',
    id: business.id,
    body: {
      name: business.name,
      description: business.description,
      category: business.category,
      location: business.location,
    },
  });
}

export async function searchBusinesses(query, filters) {
  const { body } = await client.search({
    index: 'businesses',
    body: {
      query: {
        bool: {
          must: [
            query ? {
              multi_match: {
                query,
                fields: ['name^2', 'description'],
              },
            } : { match_all: {} },
          ],
          filter: [
            filters.category ? {
              term: { category: filters.category },
            } : null,
          ].filter(Boolean),
        },
      },
    },
  });

  return body.hits.hits.map(hit => ({
    id: hit._id,
    ...hit._source,
  }));
}
```

## 4. Business Management Portal (Week 4-5)

### Day 1-3: Dashboard Setup
```typescript
// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { BusinessForm } from './components/BusinessForm';

export default function Dashboard() {
  const [business, setBusiness] = useState(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Business Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <BusinessForm 
            initialData={business}
            onSubmit={async (data) => {
              // Handle business update
            }}
          />
        </div>
        <div>
          <StatisticsPanel businessId={business?.id} />
        </div>
      </div>
    </div>
  );
}
```

## 5. Review System (Week 5-6)

### Day 1-3: Review Components
```typescript
// components/ReviewForm.tsx
import { useState } from 'react';
import { StarRating } from './StarRating';

export const ReviewForm = ({ businessId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StarRating
        rating={rating}
        onChange={setRating}
        editable
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Share your experience..."
      />
      <button 
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Submit Review
      </button>
    </form>
  );
};
```

## Quick Launch Checklist

### Pre-Launch (Week 6)
1. Database Migrations
```bash
npx prisma generate
npx prisma migrate deploy
```

2. Environment Setup
```env
DATABASE_URL="postgresql://..."
ELASTICSEARCH_URL="https://..."
NEXTAUTH_SECRET="your-secret"
NEXT_PUBLIC_GOOGLE_MAPS_KEY="your-key"
```

3. Deployment
```bash
# Vercel deployment
vercel deploy --prod
```

### Post-Launch Optimization
1. Performance Monitoring
```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

2. SEO Enhancement
```typescript
// app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Makeup Directory | Find Local Beauty Professionals',
  description: 'Discover and connect with makeup artists, beauty salons...',
  openGraph: {
    title: 'Makeup Directory',
    description: 'Find the best beauty professionals near you',
    images: ['/og-image.jpg'],
  },
};
```

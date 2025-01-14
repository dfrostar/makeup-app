# API Integration Specifications

## Overview
Comprehensive API documentation for the Makeup Discovery Platform, including endpoints, data models, and integration patterns.

## Core API Architecture

### Base Configuration
```typescript
interface APIConfig {
    version: 'v1';
    baseUrl: 'https://api.makeupdiscovery.com';
    authentication: {
        type: 'JWT' | 'OAuth2';
        endpoints: {
            token: '/auth/token';
            refresh: '/auth/refresh';
            revoke: '/auth/revoke';
        };
    };
}
```

### Authentication
```typescript
interface AuthenticationAPI {
    endpoints: {
        login: '/auth/login';
        register: '/auth/register';
        verify: '/auth/verify';
        resetPassword: '/auth/reset-password';
    };
    methods: 'POST';
    security: {
        rateLimit: number;
        jwtExpiration: number;
        refreshTokenExpiration: number;
    };
}
```

## Content Management API

### Look Discovery
```typescript
interface LookAPI {
    endpoints: {
        search: '/looks/search';
        trending: '/looks/trending';
        recommended: '/looks/recommended';
        similar: '/looks/similar';
    };
    parameters: {
        filters: LookFilters;
        pagination: PaginationParams;
        sorting: SortingOptions;
    };
    response: {
        looks: Look[];
        metadata: ResponseMetadata;
    };
}

interface Look {
    id: string;
    title: string;
    description: string;
    images: {
        thumbnail: string;
        full: string;
        ar: string;
    };
    products: Product[];
    tutorial: Tutorial;
    professionals: Professional[];
    metrics: {
        views: number;
        saves: number;
        shares: number;
    };
}
```

### Product Integration
```typescript
interface ProductAPI {
    endpoints: {
        details: '/products/:id';
        search: '/products/search';
        compare: '/products/compare';
        recommend: '/products/recommend';
    };
    methods: {
        GET: ['details', 'search', 'compare', 'recommend'];
        POST: ['review', 'track'];
    };
}

interface Product {
    id: string;
    name: string;
    brand: string;
    category: string;
    description: string;
    price: {
        amount: number;
        currency: string;
        discounts: Discount[];
    };
    attributes: {
        color: string;
        finish: string;
        size: string;
        ingredients: string[];
    };
    availability: {
        inStock: boolean;
        quantity: number;
        retailers: Retailer[];
    };
}
```

## Professional Services API

### Professional Profiles
```typescript
interface ProfessionalAPI {
    endpoints: {
        profile: '/professionals/:id';
        search: '/professionals/search';
        verify: '/professionals/verify';
        portfolio: '/professionals/:id/portfolio';
    };
    methods: {
        GET: ['profile', 'search', 'portfolio'];
        POST: ['verify', 'update'];
        PUT: ['profile', 'portfolio'];
    };
}

interface Professional {
    id: string;
    name: string;
    title: string;
    specialties: string[];
    location: {
        address: string;
        coordinates: {
            lat: number;
            lng: number;
        };
        serviceArea: string[];
    };
    verification: {
        status: 'verified' | 'pending' | 'unverified';
        documents: Document[];
        background: BackgroundCheck;
    };
    portfolio: {
        looks: Look[];
        before_after: BeforeAfter[];
        testimonials: Testimonial[];
    };
}
```

## AI Services API

### Content Analysis
```typescript
interface AIServicesAPI {
    endpoints: {
        analyze: '/ai/analyze';
        recommend: '/ai/recommend';
        trend: '/ai/trend';
        personalize: '/ai/personalize';
    };
    methods: {
        POST: ['analyze', 'recommend', 'personalize'];
        GET: ['trend'];
    };
}

interface AIAnalysis {
    content: {
        type: 'image' | 'video' | 'text';
        quality: number;
        safety: number;
        relevance: number;
    };
    detection: {
        faces: Face[];
        products: Product[];
        techniques: Technique[];
    };
    recommendations: {
        products: Product[];
        looks: Look[];
        professionals: Professional[];
    };
}
```

## AR Integration API

### Virtual Try-On
```typescript
interface ARServicesAPI {
    endpoints: {
        tryOn: '/ar/try-on';
        calibrate: '/ar/calibrate';
        save: '/ar/save';
        share: '/ar/share';
    };
    methods: {
        POST: ['tryOn', 'calibrate', 'save', 'share'];
        GET: ['presets', 'saved'];
    };
}

interface ARTryOn {
    face: {
        landmarks: FaceLandmarks;
        measurements: FaceMeasurements;
        tracking: TrackingData;
    };
    makeup: {
        products: Product[];
        placement: PlacementData;
        blending: BlendingOptions;
    };
    rendering: {
        quality: 'high' | 'medium' | 'low';
        lighting: LightingConditions;
        effects: Effect[];
    };
}
```

## Social Integration API

### Platform Connections
```typescript
interface SocialAPI {
    endpoints: {
        connect: '/social/connect/:platform';
        share: '/social/share';
        import: '/social/import';
        track: '/social/track';
    };
    platforms: {
        instagram: InstagramConfig;
        tiktok: TikTokConfig;
        youtube: YouTubeConfig;
        pinterest: PinterestConfig;
    };
}

interface SocialContent {
    platform: string;
    content: {
        type: 'post' | 'video' | 'story' | 'pin';
        media: Media[];
        text: string;
        hashtags: string[];
        mentions: string[];
    };
    metrics: {
        views: number;
        likes: number;
        shares: number;
        comments: number;
    };
}
```

## Analytics API

### Tracking & Metrics
```typescript
interface AnalyticsAPI {
    endpoints: {
        track: '/analytics/track';
        report: '/analytics/report';
        dashboard: '/analytics/dashboard';
        export: '/analytics/export';
    };
    events: {
        pageView: PageViewEvent;
        interaction: InteractionEvent;
        conversion: ConversionEvent;
        custom: CustomEvent;
    };
}

interface Analytics {
    user: {
        sessions: Session[];
        interactions: Interaction[];
        preferences: Preference[];
        journey: JourneyPoint[];
    };
    content: {
        views: View[];
        engagement: Engagement[];
        conversion: Conversion[];
    };
    performance: {
        timing: Timing[];
        errors: Error[];
        availability: Availability[];
    };
}
```

## Webhook System

### Event Notifications
```typescript
interface WebhookAPI {
    endpoints: {
        register: '/webhooks/register';
        configure: '/webhooks/configure';
        test: '/webhooks/test';
        logs: '/webhooks/logs';
    };
    events: {
        content: ContentEvent[];
        user: UserEvent[];
        system: SystemEvent[];
    };
}

interface Webhook {
    id: string;
    url: string;
    events: string[];
    security: {
        secret: string;
        signature: string;
    };
    config: {
        retries: number;
        timeout: number;
        batch: boolean;
    };
}
```

## Error Handling

### Standard Error Response
```typescript
interface APIError {
    code: number;
    message: string;
    details: {
        field?: string;
        reason?: string;
        suggestion?: string;
    };
    timestamp: string;
    requestId: string;
}
```

## Rate Limiting

### Limits Configuration
```typescript
interface RateLimits {
    public: {
        requests: number;
        period: string;
    };
    authenticated: {
        requests: number;
        period: string;
    };
    professional: {
        requests: number;
        period: string;
    };
}
```

## Security

### Security Requirements
```typescript
interface SecurityConfig {
    authentication: {
        required: boolean;
        methods: string[];
    };
    rateLimit: RateLimits;
    encryption: {
        required: boolean;
        method: string;
    };
}
```

## Data Models

### Common Interfaces
```typescript
interface PaginationParams {
    page: number;
    limit: number;
    cursor?: string;
}

interface ResponseMetadata {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

interface SortingOptions {
    field: string;
    order: 'asc' | 'desc';
}
```

## Integration Examples

### Example: Look Search
```typescript
// Request
const searchRequest = {
    query: 'natural wedding makeup',
    filters: {
        occasion: 'wedding',
        style: 'natural',
        skinType: 'combination',
        priceRange: 'premium'
    },
    pagination: {
        page: 1,
        limit: 20
    },
    sort: {
        field: 'relevance',
        order: 'desc'
    }
};

// Response
const searchResponse = {
    looks: [{
        id: 'look-123',
        title: 'Natural Bridal Glow',
        // ... look details
    }],
    metadata: {
        total: 156,
        page: 1,
        limit: 20,
        hasMore: true
    }
};
```

# Search API Documentation

## Overview
The Beauty Directory Platform's Search API provides advanced search capabilities including text, voice, visual, and hybrid search methods. Built on a vector database with real-time AI processing.

## API Endpoints

### Visual Search
```typescript
POST /api/v2/search/visual
Content-Type: multipart/form-data

{
  "image": File,
  "searchType": "product" | "look" | "style",
  "filters": SearchFilters,
  "limit": number,
  "vector_config": VectorSearchConfig
}
```

#### Vector Search Configuration
```typescript
interface VectorSearchConfig {
  model: 'clip-vit-b32' | 'efficientnet-v2' | 'custom';
  threshold: number;
  rerank: boolean;
  hybridSearch?: {
    textWeight: number;
    visualWeight: number;
  };
}
```

### Voice Search
```typescript
POST /api/v2/search/voice
Content-Type: multipart/form-data

{
  "audio": File,
  "language": string,
  "context": SearchContext,
  "filters": SearchFilters
}
```

#### Voice Processing Pipeline
1. Speech-to-Text (Whisper API)
2. Intent Classification (GPT-4)
3. Query Formation
4. Multi-modal Search Execution

### Hybrid Search
```typescript
POST /api/v2/search/hybrid
Content-Type: application/json

{
  "text": string,
  "imageUrls": string[],
  "weights": {
    "text": number,
    "visual": number,
    "semantic": number
  },
  "filters": SearchFilters
}
```

## Search Features

### Vector Search Implementation
```typescript
interface VectorSearchParams {
  vectors: number[][];
  metric: 'cosine' | 'euclidean' | 'dot';
  index: 'hnsw' | 'ivf' | 'flat';
  nprobe: number;
}
```

### Real-time Processing
- Async processing with WebSockets
- Progressive result loading
- Real-time result refinement

### AI Models
```typescript
interface SearchModels {
  imageEncoder: 'CLIP' | 'EfficientNet';
  textEncoder: 'BERT' | 'GPT';
  crossEncoder: 'LaBSE' | 'Custom';
}
```

## Performance Optimization

### Caching Strategy
```typescript
interface CacheConfig {
  vectorCache: {
    type: 'redis' | 'memory';
    ttl: number;
    maxSize: number;
  };
  resultCache: {
    type: 'cdn' | 'edge';
    strategy: 'stale-while-revalidate';
  };
}
```

### Rate Limiting
```typescript
const rateLimits = {
  visual: '60/hour',
  voice: '100/hour',
  hybrid: '200/hour',
  burst: {
    window: '1m',
    max: 30
  }
};
```

## Security

### Authentication
```typescript
interface AuthConfig {
  type: 'jwt' | 'oauth2';
  scopes: string[];
  rateLimit: RateLimitConfig;
}
```

### Data Protection
- Image/audio data encryption
- Temporary storage (max 1 hour)
- PII removal from vectors

## Response Format

### Success Response
```typescript
interface SearchResponse {
  results: SearchResult[];
  metadata: {
    processingTime: number;
    confidence: number;
    strategy: string;
  };
  pagination: {
    next: string;
    total: number;
  };
}
```

### Error Response
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId: string;
}
```

## Integration Examples

### Visual Search Implementation
```typescript
const visualSearch = async (image: File) => {
  const form = new FormData();
  form.append('image', image);
  form.append('config', JSON.stringify({
    model: 'clip-vit-b32',
    threshold: 0.8,
    rerank: true
  }));

  const response = await fetch('/api/v2/search/visual', {
    method: 'POST',
    body: form,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.json();
};
```

### Voice Search Implementation
```typescript
const voiceSearch = async (audioBlob: Blob) => {
  const form = new FormData();
  form.append('audio', audioBlob);
  form.append('context', JSON.stringify({
    userPreferences: true,
    location: true
  }));

  const response = await fetch('/api/v2/search/voice', {
    method: 'POST',
    body: form
  });

  return response.json();
};
```

## Monitoring & Analytics

### Metrics Collection
```typescript
interface SearchMetrics {
  latency: number;
  resultCount: number;
  userInteractions: string[];
  conversion: boolean;
}
```

### Performance Monitoring
- Real-time latency tracking
- Error rate monitoring
- Cache hit ratios
- Vector quality metrics

## Error Handling

### Common Error Codes
```typescript
enum SearchErrorCodes {
  INVALID_IMAGE = 'INVALID_IMAGE',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_AUDIO = 'INVALID_AUDIO'
}
```

### Recovery Strategies
1. Automatic retries for transient failures
2. Fallback to text search
3. Progressive enhancement

## Future Improvements

### Planned Features
1. Real-time visual search
2. Multi-modal embeddings
3. Personalized ranking
4. Semantic search improvements

### Experimental Features
- AR-integrated search
- Emotion-based filtering
- Style transfer search
- Trend prediction

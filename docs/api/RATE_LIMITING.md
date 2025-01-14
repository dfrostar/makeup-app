# Rate Limiting Guide

## Overview

Rate limiting protects our API from abuse and ensures fair usage. We implement rate limiting at multiple levels:

1. IP-based limiting
2. User-based limiting
3. API key-based limiting
4. Endpoint-specific limiting

## Rate Limit Configuration

### 1. Default Limits
```typescript
interface RateLimitConfig {
  windowMs: number;     // Time window in milliseconds
  max: number;         // Maximum requests per window
  message: string;     // Error message
  statusCode: number;  // Response status code
  headers: boolean;    // Include rate limit headers
}

const defaultLimits: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // 100 requests per window
  message: 'Too many requests, please try again later',
  statusCode: 429,
  headers: true
};
```

### 2. Endpoint-Specific Limits
```typescript
const endpointLimits = {
  '/api/auth/*': {
    windowMs: 60 * 60 * 1000,  // 1 hour
    max: 5                     // 5 login attempts per hour
  },
  '/api/upload/*': {
    windowMs: 60 * 1000,       // 1 minute
    max: 10                    // 10 uploads per minute
  }
};
```

## Implementation

### 1. Express Rate Limiter
```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// Redis store for rate limiting
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

// Create limiter
const createLimiter = (config: RateLimitConfig) => {
  return rateLimit({
    store: new RedisStore({
      client: redisClient,
      prefix: 'rate-limit:'
    }),
    ...config,
    handler: (req, res) => {
      res.status(config.statusCode).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: config.message,
          retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        }
      });
    }
  });
};

// Apply limiters
app.use(createLimiter(defaultLimits));

// Apply endpoint-specific limiters
Object.entries(endpointLimits).forEach(([path, config]) => {
  app.use(path, createLimiter({ ...defaultLimits, ...config }));
});
```

### 2. User-Based Limiting
```typescript
const userRateLimiter = (config: RateLimitConfig) => {
  const limiter = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id || req.ip;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get user's requests within window
    const userRequests = limiter.get(userId) || [];
    const requestsInWindow = userRequests.filter(
      time => time > windowStart
    );

    if (requestsInWindow.length >= config.max) {
      return res.status(config.statusCode).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: config.message,
          retryAfter: Math.ceil(
            (Math.min(...requestsInWindow) + config.windowMs - now) / 1000
          )
        }
      });
    }

    // Add current request
    requestsInWindow.push(now);
    limiter.set(userId, requestsInWindow);

    next();
  };
};
```

### 3. API Key Limiting
```typescript
interface APIKeyLimits {
  [key: string]: {
    total: number;      // Total requests allowed
    remaining: number;  // Remaining requests
    reset: number;      // Reset timestamp
  };
}

const apiKeyLimiter = (config: RateLimitConfig) => {
  const limits: APIKeyLimits = {};

  return async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) return next();

    const now = Date.now();
    let limit = limits[apiKey];

    // Initialize or reset limits
    if (!limit || now >= limit.reset) {
      limit = {
        total: config.max,
        remaining: config.max,
        reset: now + config.windowMs
      };
      limits[apiKey] = limit;
    }

    // Check remaining requests
    if (limit.remaining <= 0) {
      return res.status(config.statusCode).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: config.message,
          retryAfter: Math.ceil((limit.reset - now) / 1000)
        }
      });
    }

    // Update remaining requests
    limit.remaining--;

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', limit.total);
    res.setHeader('X-RateLimit-Remaining', limit.remaining);
    res.setHeader('X-RateLimit-Reset', limit.reset);

    next();
  };
};
```

## Rate Limit Headers

```typescript
interface RateLimitHeaders {
  'X-RateLimit-Limit': number;     // Maximum requests allowed
  'X-RateLimit-Remaining': number; // Remaining requests
  'X-RateLimit-Reset': number;     // Reset timestamp
  'Retry-After'?: number;          // Seconds until retry (when limited)
}

const setRateLimitHeaders = (
  res: Response,
  limits: RateLimitInfo
) => {
  res.setHeader('X-RateLimit-Limit', limits.total);
  res.setHeader('X-RateLimit-Remaining', limits.remaining);
  res.setHeader('X-RateLimit-Reset', limits.reset);
  
  if (limits.remaining === 0) {
    res.setHeader(
      'Retry-After',
      Math.ceil((limits.reset - Date.now()) / 1000)
    );
  }
};
```

## Monitoring and Alerts

### 1. Rate Limit Monitoring
```typescript
const monitorRateLimits = async (
  userId: string,
  endpoint: string,
  remaining: number
) => {
  // Log rate limit usage
  await logger.info('rate_limit', {
    userId,
    endpoint,
    remaining,
    timestamp: new Date()
  });

  // Alert on high usage
  if (remaining < 10) {
    await alertService.warn('rate_limit_warning', {
      userId,
      endpoint,
      remaining
    });
  }
};
```

### 2. Usage Analytics
```typescript
const trackRateLimitUsage = async (
  userId: string,
  endpoint: string
) => {
  await analytics.increment('api_requests', {
    userId,
    endpoint,
    timestamp: new Date()
  });
};
```

## Client-Side Handling

### 1. Retry Strategy
```typescript
class APIClient {
  async request(config: RequestConfig) {
    try {
      return await axios(config);
    } catch (error) {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        await this.delay(retryAfter * 1000);
        return this.request(config);
      }
      throw error;
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 2. Rate Limit Tracking
```typescript
class RateLimitTracker {
  private limits: Map<string, RateLimitInfo> = new Map();

  update(endpoint: string, headers: RateLimitHeaders) {
    this.limits.set(endpoint, {
      total: parseInt(headers['x-ratelimit-limit']),
      remaining: parseInt(headers['x-ratelimit-remaining']),
      reset: parseInt(headers['x-ratelimit-reset'])
    });
  }

  canRequest(endpoint: string): boolean {
    const limit = this.limits.get(endpoint);
    return !limit || limit.remaining > 0;
  }

  getWaitTime(endpoint: string): number {
    const limit = this.limits.get(endpoint);
    if (!limit || limit.remaining > 0) return 0;
    return Math.max(0, limit.reset - Date.now());
  }
}
```

## Best Practices

1. **Gradual Rate Limiting**
   - Start with generous limits
   - Monitor usage patterns
   - Adjust based on data

2. **Clear Communication**
   - Include rate limit headers
   - Provide clear error messages
   - Document limits

3. **Fair Usage**
   - Consider different user tiers
   - Implement burst handling
   - Allow limit overrides

4. **Security**
   - Use secure key storage
   - Implement IP filtering
   - Monitor for abuse

## Additional Resources

- [Rate Limiting Patterns](../patterns/RATE_LIMITING.md)
- [Redis Configuration](../guides/REDIS.md)
- [Monitoring Guide](../guides/MONITORING.md)
- [Security Best Practices](../security/BEST_PRACTICES.md)

# Authentication Guide

## Overview

MakeupHub uses a multi-layered authentication system:
1. JWT (JSON Web Tokens) for API authentication
2. OAuth2 for third-party integration
3. API Keys for service-to-service communication

## JWT Authentication

### Token Structure
```javascript
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-id",
    "name": "John Doe",
    "role": "user",
    "iat": 1516239022,
    "exp": 1516242622
  },
  "signature": "..."
}
```

### Authentication Flow

1. **Login Request**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

2. **Response with Tokens**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

3. **Using the Token**
```http
GET /api/resource
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Token Refresh

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

## OAuth2 Authentication

### Supported Providers
- Google
- Facebook
- Apple
- Twitter

### OAuth2 Flow

1. **Initiate OAuth**
```http
GET /auth/oauth/google
```

2. **Callback Handling**
```http
GET /auth/oauth/callback?code=...
```

3. **Token Exchange**
```http
POST /auth/oauth/token
Content-Type: application/json

{
  "code": "authorization-code",
  "provider": "google"
}
```

### Implementation Example

```typescript
// Frontend
const initiateOAuth = () => {
  window.location.href = 'https://api.makeupHub.com/auth/oauth/google';
};

// Backend
app.get('/auth/oauth/callback', async (req, res) => {
  const { code } = req.query;
  const tokens = await exchangeCodeForTokens(code);
  res.json(tokens);
});
```

## API Key Authentication

### Key Generation
```http
POST /api/keys
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Service Key",
  "permissions": ["read", "write"],
  "expiresIn": "30d"
}
```

### Using API Keys
```http
GET /api/resource
X-API-Key: your-api-key
```

## Security Best Practices

### 1. Token Storage
```javascript
// Frontend - Store in HttpOnly cookie
document.cookie = `token=${token}; HttpOnly; Secure`;

// Backend - Set secure cookie
res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});
```

### 2. CSRF Protection
```typescript
// Generate token
app.get('/csrf-token', (req, res) => {
  res.json({ token: req.csrfToken() });
});

// Use token
fetch('/api/resource', {
  headers: {
    'X-CSRF-Token': csrfToken
  }
});
```

### 3. Rate Limiting
```typescript
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};
```

## Error Handling

### Common Error Responses

1. **Invalid Credentials**
```json
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

2. **Token Expired**
```json
{
  "error": {
    "code": "AUTH_TOKEN_EXPIRED",
    "message": "JWT token has expired"
  }
}
```

3. **Invalid Token**
```json
{
  "error": {
    "code": "AUTH_TOKEN_INVALID",
    "message": "Invalid JWT token"
  }
}
```

### Error Handling Example
```typescript
try {
  const response = await authenticate(credentials);
} catch (error) {
  switch (error.code) {
    case 'AUTH_INVALID_CREDENTIALS':
      // Handle invalid credentials
      break;
    case 'AUTH_TOKEN_EXPIRED':
      // Refresh token
      break;
    default:
      // Handle other errors
  }
}
```

## Role-Based Access Control

### Role Definitions
```typescript
enum UserRole {
  USER = 'user',
  PROFESSIONAL = 'professional',
  ADMIN = 'admin'
}

interface Permission {
  action: 'read' | 'write' | 'delete';
  resource: string;
}
```

### Role Middleware
```typescript
const requireRole = (role: UserRole) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({
        error: {
          code: 'AUTH_FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }
    next();
  };
};
```

## Session Management

### Session Configuration
```typescript
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};
```

### Session Storage
```typescript
// Redis session store
const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

app.use(session({
  store: new RedisStore({ client: redisClient }),
  ...sessionConfig
}));
```

## Two-Factor Authentication

### Enable 2FA
```http
POST /auth/2fa/enable
Authorization: Bearer <token>

Response:
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCode": "data:image/png;base64,..."
}
```

### Verify 2FA
```http
POST /auth/2fa/verify
Content-Type: application/json

{
  "code": "123456"
}
```

## Testing

### Unit Tests
```typescript
describe('Authentication', () => {
  test('should authenticate valid credentials', async () => {
    const response = await auth.login({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(response.accessToken).toBeDefined();
  });
});
```

### Integration Tests
```typescript
describe('OAuth Flow', () => {
  test('should handle Google OAuth callback', async () => {
    const response = await request(app)
      .get('/auth/oauth/callback')
      .query({ code: 'test-code' });
    expect(response.status).toBe(200);
  });
});
```

## Additional Resources

- [JWT.io](https://jwt.io/)
- [OAuth2 Specification](https://oauth.net/2/)
- [Security Best Practices](https://owasp.org/www-project-top-ten/)
- [2FA Implementation Guide](./2FA.md)
- [Session Management Guide](./SESSIONS.md)

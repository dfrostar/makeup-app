# API Documentation

## Overview

The MakeupHub API is a RESTful service that provides access to the platform's features and data. It follows REST principles and uses JSON for request and response payloads.

## Base URL

```
Production: https://api.makeupHub.com/v1
Staging: https://api.staging.makeupHub.com/v1
Development: http://localhost:3001/v1
```

## Authentication

### JWT Authentication
```http
Authorization: Bearer <token>
```

### OAuth2 Flow
1. Redirect to `/auth/oauth`
2. User authorizes
3. Redirect to callback URL
4. Exchange code for token

## Rate Limiting

- 1000 requests per hour per API key
- Rate limit headers included in response
- Status 429 when exceeded

## Common Headers

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>
X-API-Key: <api-key>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {
      // Additional error details
    }
  }
}
```

## Endpoints

### Authentication

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Users

#### Get User Profile
```http
GET /users/me
Authorization: Bearer <token>
```

#### Update User Profile
```http
PATCH /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "preferences": {
    "skinType": "oily",
    "skinTone": "medium"
  }
}
```

### Products

#### List Products
```http
GET /products
Query Parameters:
- page (default: 1)
- limit (default: 10)
- category
- brand
- priceRange
- rating
```

#### Get Product
```http
GET /products/:id
```

#### Create Product Review
```http
POST /products/:id/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Great product!"
}
```

### Professionals

#### List Professionals
```http
GET /professionals
Query Parameters:
- page (default: 1)
- limit (default: 10)
- location
- specialty
- rating
```

#### Get Professional Profile
```http
GET /professionals/:id
```

#### Create Booking
```http
POST /professionals/:id/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "service": "makeup-session",
  "date": "2024-12-25T10:00:00Z",
  "duration": 60
}
```

### Recommendations

#### Get Personalized Recommendations
```http
GET /recommendations/personalized
Authorization: Bearer <token>
Query Parameters:
- limit (default: 10)
- category
```

#### Get Similar Products
```http
GET /recommendations/similar/:productId
Query Parameters:
- limit (default: 10)
```

### AR/Virtual Try-on

#### Get AR Data
```http
GET /ar/products/:id
```

#### Save AR Look
```http
POST /ar/looks
Authorization: Bearer <token>
Content-Type: application/json

{
  "products": ["product-id-1", "product-id-2"],
  "image": "base64-image-data"
}
```

## Error Codes

### Authentication Errors
- `AUTH_INVALID_CREDENTIALS`: Invalid email or password
- `AUTH_TOKEN_EXPIRED`: JWT token has expired
- `AUTH_TOKEN_INVALID`: Invalid JWT token
- `AUTH_UNAUTHORIZED`: User not authorized

### Resource Errors
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `RESOURCE_ALREADY_EXISTS`: Resource already exists
- `RESOURCE_INVALID`: Invalid resource data

### Validation Errors
- `VALIDATION_ERROR`: Request validation failed
- `VALIDATION_REQUIRED`: Required field missing
- `VALIDATION_FORMAT`: Invalid field format

### Server Errors
- `SERVER_ERROR`: Internal server error
- `SERVICE_UNAVAILABLE`: Service temporarily unavailable
- `DATABASE_ERROR`: Database operation failed

## Pagination

### Request
```http
GET /endpoint?page=2&limit=10
```

### Response
```json
{
  "data": [...],
  "meta": {
    "page": 2,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Filtering

### Query Parameters
```http
GET /products?category=lipstick&brand=mac&minPrice=10&maxPrice=50
```

### Advanced Filtering
```http
GET /products?filter[category]=lipstick&filter[brand][in]=mac,nyx
```

## Sorting

### Single Field
```http
GET /products?sort=price
GET /products?sort=-price (descending)
```

### Multiple Fields
```http
GET /products?sort=brand,-price
```

## API Versioning

### URL Versioning
```http
/v1/endpoint
/v2/endpoint
```

### Header Versioning
```http
Accept: application/vnd.makeupHub.v1+json
```

## WebSocket API

### Connection
```javascript
const ws = new WebSocket('wss://api.makeupHub.com/ws');
```

### Events
```javascript
// Authentication
ws.send(JSON.stringify({
  type: 'auth',
  token: 'jwt-token'
}));

// Subscribe to updates
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'bookings'
}));
```

## SDK Examples

### JavaScript/TypeScript
```typescript
import { MakeupHubAPI } from '@makeupHub/sdk';

const api = new MakeupHubAPI({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Get products
const products = await api.products.list({
  category: 'lipstick',
  page: 1,
  limit: 10
});
```

### Python
```python
from makeupHub import MakeupHubAPI

api = MakeupHubAPI(
    api_key='your-api-key',
    environment='production'
)

# Get products
products = api.products.list(
    category='lipstick',
    page=1,
    limit=10
)
```

## Additional Resources

- [API Change Log](./CHANGELOG.md)
- [Authentication Guide](./AUTHENTICATION.md)
- [Error Handling Guide](./ERROR_HANDLING.md)
- [Rate Limiting Guide](./RATE_LIMITING.md)
- [WebSocket Guide](./WEBSOCKET.md)
- [SDK Documentation](./SDK.md)

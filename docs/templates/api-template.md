# API Endpoint Name

## Overview
Brief description of the API endpoint and its purpose.

## Endpoint Details
- **URL**: `/api/v1/endpoint`
- **Method**: `GET`
- **Authentication**: Required/Optional

## Request
### Headers
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `param1` | string | Yes | Description of param1 |
| `param2` | number | No | Description of param2 |

### Body
```json
{
  "field1": "string",
  "field2": 123
}
```

## Response
### Success Response
**Code**: `200 OK`

```json
{
  "status": "success",
  "data": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

### Error Responses
**Code**: `400 Bad Request`
```json
{
  "status": "error",
  "message": "Invalid parameters",
  "errors": [
    {
      "field": "param1",
      "message": "param1 is required"
    }
  ]
}
```

## Rate Limiting
- Rate limit: X requests per minute
- Rate limit header: `X-RateLimit-Limit`
- Remaining requests header: `X-RateLimit-Remaining`

## Examples
### cURL
```bash
curl -X GET \
  'https://api.example.com/v1/endpoint' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json'
```

### TypeScript
```typescript
async function fetchEndpoint() {
  const response = await fetch('https://api.example.com/v1/endpoint', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}
```

## Security Considerations
- Authentication requirements
- Authorization levels
- Data sensitivity

## Performance Considerations
- Caching strategy
- Response time expectations
- Pagination details

## Versioning
- Current version
- Deprecation schedule
- Migration guide

## Related Endpoints
- Link to related endpoints
- Common use cases
- Integration patterns

## Changelog
| Version | Date | Changes |
|---------|------|---------|
| v1.0.0 | YYYY-MM-DD | Initial release |

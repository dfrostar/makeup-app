# API Error Handling

## Error Response Format

All API errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error details
    }
  }
}
```

## Error Categories

### 1. Authentication Errors (400-401)
```typescript
enum AuthErrors {
  INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
  UNAUTHORIZED = 'AUTH_UNAUTHORIZED'
}

interface AuthErrorResponse {
  code: AuthErrors;
  message: string;
  details?: {
    expiredAt?: Date;
    requiredRoles?: string[];
  };
}
```

### 2. Authorization Errors (403)
```typescript
enum AuthzErrors {
  FORBIDDEN = 'AUTHZ_FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'AUTHZ_INSUFFICIENT_PERMISSIONS',
  RESOURCE_ACCESS_DENIED = 'AUTHZ_RESOURCE_ACCESS_DENIED'
}
```

### 3. Validation Errors (400)
```typescript
enum ValidationErrors {
  INVALID_INPUT = 'VALIDATION_INVALID_INPUT',
  REQUIRED_FIELD = 'VALIDATION_REQUIRED_FIELD',
  INVALID_FORMAT = 'VALIDATION_INVALID_FORMAT'
}

interface ValidationErrorResponse {
  code: ValidationErrors;
  message: string;
  details: {
    field: string;
    error: string;
    received?: any;
    expected?: any;
  }[];
}
```

### 4. Resource Errors (404)
```typescript
enum ResourceErrors {
  NOT_FOUND = 'RESOURCE_NOT_FOUND',
  ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  DELETED = 'RESOURCE_DELETED'
}
```

### 5. Server Errors (500)
```typescript
enum ServerErrors {
  INTERNAL_ERROR = 'SERVER_INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVER_SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'SERVER_DATABASE_ERROR'
}
```

## Error Handling Implementation

### 1. Global Error Handler
```typescript
const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error({
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method
  });

  // Handle known errors
  if (error instanceof APIError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    success: false,
    error: {
      code: ServerErrors.INTERNAL_ERROR,
      message: 'An unexpected error occurred'
    }
  });
};
```

### 2. Custom Error Classes
```typescript
class APIError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message);
  }
}

class ValidationError extends APIError {
  constructor(details: ValidationErrorResponse['details']) {
    super(
      ValidationErrors.INVALID_INPUT,
      'Validation failed',
      400,
      details
    );
  }
}

class AuthenticationError extends APIError {
  constructor(code: AuthErrors, message: string) {
    super(code, message, 401);
  }
}
```

### 3. Error Handling Middleware
```typescript
const handleValidationError = (
  schema: Joi.Schema
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        error: detail.message
      }));
      
      throw new ValidationError(details);
    }
    
    next();
  };
};
```

## Error Handling Examples

### 1. Authentication Error
```typescript
// Route handler
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.authenticate(email, password);
    
    if (!user) {
      throw new AuthenticationError(
        AuthErrors.INVALID_CREDENTIALS,
        'Invalid email or password'
      );
    }
    
    // Generate token and return response
  } catch (error) {
    next(error);
  }
};
```

### 2. Resource Not Found
```typescript
// Service layer
class UserService {
  static async getUser(id: string) {
    const user = await UserModel.findById(id);
    
    if (!user) {
      throw new APIError(
        ResourceErrors.NOT_FOUND,
        'User not found',
        404,
        { id }
      );
    }
    
    return user;
  }
}
```

### 3. Validation Error
```typescript
// Route handler
const createProduct = async (req: Request, res: Response) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    category: Joi.string().required()
  });
  
  try {
    await handleValidationError(schema)(req, res, () => {});
    const product = await ProductService.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};
```

## Error Logging and Monitoring

### 1. Error Logging
```typescript
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error'
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

const logError = (error: Error, req: Request) => {
  logger.error({
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      stack: error.stack,
      code: error instanceof APIError ? error.code : undefined
    },
    request: {
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body,
      ip: req.ip
    }
  });
};
```

### 2. Error Monitoring
```typescript
const monitorError = async (error: Error, req: Request) => {
  // Send to error monitoring service (e.g., Sentry)
  await Sentry.captureException(error, {
    extra: {
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    }
  });
  
  // Alert if critical error
  if (isCriticalError(error)) {
    await alertTeam(error);
  }
};
```

## Client-Side Error Handling

### 1. API Client
```typescript
class APIClient {
  async request(config: RequestConfig) {
    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data?.error;
        
        switch (apiError?.code) {
          case AuthErrors.TOKEN_EXPIRED:
            await this.refreshToken();
            return this.request(config);
          
          case AuthErrors.UNAUTHORIZED:
            this.redirectToLogin();
            break;
          
          default:
            throw new APIError(
              apiError?.code || ServerErrors.INTERNAL_ERROR,
              apiError?.message || 'An error occurred',
              error.response?.status || 500,
              apiError?.details
            );
        }
      }
      
      throw error;
    }
  }
}
```

### 2. Error Boundary
```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log error
    logger.error({
      error: error.message,
      stack: errorInfo.componentStack
    });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

## Best Practices

1. **Consistent Error Format**
   - Use standardized error codes
   - Provide clear error messages
   - Include relevant details

2. **Security Considerations**
   - Don't expose sensitive information
   - Sanitize error messages
   - Log securely

3. **Error Recovery**
   - Implement retry mechanisms
   - Handle token refresh
   - Provide fallback UI

4. **Monitoring and Alerts**
   - Log all errors
   - Monitor error rates
   - Alert on critical errors

## Additional Resources

- [Error Handling Patterns](../patterns/ERROR_HANDLING.md)
- [Logging Guidelines](../guides/LOGGING.md)
- [Monitoring Setup](../guides/MONITORING.md)
- [Security Best Practices](../security/BEST_PRACTICES.md)

# Contributing to Makeup Discovery Platform

## Development Standards

### Code Style & Quality
- TypeScript is required for all new frontend code
- PHP 8.3+ for backend code
- ESLint and Prettier for JavaScript/TypeScript
- PHPCSFixer for PHP code formatting
- Minimum 80% test coverage for new code

### Git Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Format
```
type(scope): description

[optional body]
[optional footer]
```
Types: feat, fix, docs, style, refactor, test, chore

### Branch Naming
- feature/* - New features
- bugfix/* - Bug fixes
- docs/* - Documentation updates
- refactor/* - Code refactoring
- test/* - Test additions or modifications

## Testing Requirements

### Frontend Testing
- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Cypress
- Visual regression tests with Percy

### Backend Testing
- Unit tests with PHPUnit
- API tests with Postman/Newman
- Integration tests for database operations
- Performance tests with k6

### Documentation Testing
- Link validation
- Code example validation
- Markdown linting
- Structure validation

## Documentation Standards

### API Documentation
- OpenAPI/Swagger for REST endpoints
- GraphQL schema documentation
- Example requests and responses
- Rate limiting information
- Authentication requirements

### Code Documentation
- JSDoc for JavaScript/TypeScript
- PHPDoc for PHP
- Inline comments for complex logic
- README for each major component
- Architecture Decision Records (ADRs) for major decisions

## Performance Standards

### Frontend
- Lighthouse score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Bundle size < 250KB (initial load)

### Backend
- API response time < 200ms (95th percentile)
- Database query time < 100ms
- Memory usage < 256MB per instance

## Security Requirements

### Code Security
- No secrets in code
- Input validation
- Output encoding
- CSRF protection
- XSS prevention

### Data Security
- Encryption at rest
- Secure communication (HTTPS)
- Regular security audits
- Dependency vulnerability scanning

## Review Process

### Pull Request Requirements
1. Meets code coverage requirements
2. Passes all automated tests
3. Documentation updated
4. No security vulnerabilities
5. Performance requirements met

### Review Checklist
- [ ] Code follows style guide
- [ ] Tests are comprehensive
- [ ] Documentation is complete
- [ ] Security considerations addressed
- [ ] Performance impact assessed

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install  # Frontend
   composer install  # Backend
   ```
3. Set up environment:
   ```bash
   cp .env.example .env
   ```
4. Start development servers:
   ```bash
   npm run dev  # Frontend
   php -S localhost:8000 -t public  # Backend
   ```

## Need Help?

- Check existing issues
- Join our Discord community
- Read the documentation
- Contact the maintainers

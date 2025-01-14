# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation
```bash
git clone [repository-url]
cd makeup
npm install
cp .env.example .env
```

### Environment Setup
Required variables:
- `REPLICATE_API_TOKEN`: Image generation
- `NEXT_PUBLIC_API_URL`: Backend endpoint
- `DATABASE_URL`: Database connection

## Project Structure

```
makeup/
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── common/           # Shared components
│   ├── products/         # Product components
│   └── features/         # Feature components
├── lib/                  # Utilities and helpers
├── public/               # Static assets
├── scripts/              # Build and utility scripts
└── docs/                # Documentation
```

## Development Workflow

### Running Locally
```bash
npm run dev              # Start development server
npm run test            # Run tests
npm run lint            # Check code style
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Husky for pre-commit hooks

### Component Development
- Use TypeScript interfaces
- Follow atomic design principles
- Implement proper prop validation
- Include unit tests

### Testing Strategy
- Jest for unit testing
- React Testing Library
- Cypress for E2E tests
- Storybook for components

## Build & Deployment

### Production Build
```bash
npm run build           # Create production build
npm start              # Start production server
```

### Deployment Checklist
- Environment variables
- Build optimization
- Image optimization
- Performance testing

## Tools & Scripts

### Image Generation
```bash
npm run images:generate  # Generate product images
npm run images:optimize # Optimize for web
```

### Database Management
```bash
npm run db:migrate      # Run migrations
npm run db:seed        # Seed test data
```

## Performance Optimization

### Image Optimization
- Next.js Image component
- WebP format
- Lazy loading
- Proper sizing

### Code Optimization
- Code splitting
- Tree shaking
- Bundle analysis
- Cache strategies

### Monitoring
- Lighthouse scores
- Core Web Vitals
- Error tracking
- Performance metrics

## Troubleshooting

### Common Issues
1. Image generation errors
2. Development server issues
3. Build failures
4. Type conflicts

### Debug Tools
- Chrome DevTools
- React DevTools
- Network analysis
- Performance profiling

## Additional Resources

### Documentation
- Component API docs
- Integration guides
- API documentation
- Style guide

### Support
- GitHub issues
- Team chat
- Documentation updates
- Code reviews

For feature specifications and roadmap, see:
- `FEATURES.md`: Platform features
- `/docs/api`: API documentation
- `/docs/guides`: Feature guides

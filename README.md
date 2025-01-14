# Makeup Discovery Platform

A modern, AI-powered platform connecting users with makeup looks, techniques, products, and professionals. Our platform serves as a curated visual discovery system, helping users find and achieve their desired makeup styles through tutorials, product recommendations, and professional services.

## Key Features

### Visual Discovery
- Pinterest-style interface for makeup looks and techniques
- AI-curated content from Instagram, YouTube, TikTok, and Pinterest
- Smart filtering by physical characteristics, style preferences, and more
- Virtual try-on capabilities with AR technology
- Real-time face mapping and makeup simulation
- Interactive AR tutorial overlays

### Smart Recommendations
- AI-powered personalized suggestions
- Product recommendations with price comparisons
- Professional makeup artist matching
- Trending looks and techniques
- Cultural preference awareness
- Regional style recommendations

### Look Management
- Seasonal look discovery
- Cultural color palettes
- Look comparison tools
- Look scheduling with notifications
- Interactive tutorials
- Trend categories and filtering

### User Experience
- Customizable collections and boards
- Progress tracking and achievements
- Email/SMS notifications for saved looks and deals
- Interactive tutorials and AR guides

### Professional Integration
- Verified professional profiles
- Portfolio showcases
- Service area listings
- Future booking capabilities

## Quick Start

1. Double-click `start-servers.bat` to launch both backend and frontend servers
   - Backend will run on: http://localhost:8000
   - Frontend will run on: http://localhost:3000

## Manual Setup

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher
- Python 3.11 or higher
- PostgreSQL 16 or higher
- WebGL-enabled browser for AR features
- Camera access for virtual try-on features

### Backend Setup
1. Configure database:
   ```bash
   php tests/setup_test_env.php
   php tests/insert_test_data.php
   ```

2. Start PHP server:
   ```bash
   php -S localhost:8000 -t public
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Directory Structure

```
Makeup/
├── frontend/              # Next.js Frontend
│   ├── app/              # Pages and layouts
│   ├── components/       # React components
│   ├── lib/             # Core TypeScript modules
│   │   ├── animations.ts # Animation utilities
│   │   ├── api.ts       # API and data fetching
│   │   ├── features.ts  # Feature implementations
│   │   └── main.ts      # Main application entry
│   └── models/          # TypeScript interfaces and models
├── backend-python/       # Python Backend
├── docs/                # Documentation
│   ├── CONTRIBUTING.md  # Contribution guidelines
│   └── IMPLEMENTATION_GUIDE.md # Implementation details
├── config/              # Configuration files
├── tests/               # Test files
└── database/           # Database scripts
```

## API Endpoints

- `GET /api/professionals` - List all professionals
- `GET /api/professionals/{id}` - Get professional details
- `GET /api/services` - List all services
- `GET /api/reviews` - List all reviews
- `POST /api/bookings` - Create a new booking

## Current Status (January 2024)

### Completed Features
- Basic visual discovery system with AI-powered content aggregation
- User collections and boards functionality
- Smart filtering and categorization system
- Initial AR face mapping implementation
- Professional profile structure
- Basic content recommendation engine

### In Progress
- Enhanced AR virtual try-on capabilities
- Professional verification system
- Booking system integration
- Advanced AI-powered trend prediction
- Social commerce features
- Sustainability badges and certifications

For detailed implementation status and upcoming features, see [UNIFIED-ROADMAP.md](./UNIFIED-ROADMAP.md)

## Development Roadmap

See our detailed implementation plan in [UNIFIED-ROADMAP.md](./UNIFIED-ROADMAP.md)

## Environment Configuration

### Backend
- Development: Uses `config/env.php`
- Production: Uses environment variables:
  - `DB_HOST`
  - `DB_PORT`
  - `DB_NAME`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_SCHEMA`
  - `FRONTEND_URL`
  - `APP_ENV`

### Frontend
- `.env.local` contains development configuration
- Environment variables:
  - `NEXT_PUBLIC_API_URL`
  - `NEXT_PUBLIC_SITE_NAME`
  - `NEXT_PUBLIC_ENVIRONMENT`

## AI Features Documentation

The Beauty Directory Platform includes sophisticated AI features for content management, search, and recommendations. Here's where to start:

1. [Getting Started with AI](docs/guides/AI-GETTING-STARTED.md)
   - Quick start guide
   - Basic usage examples
   - React integration
   - Best practices

2. [AI Agents](docs/features/AI-AGENTS.md)
   - Agent architecture
   - Content quality analysis
   - Search ranking
   - Performance monitoring

3. [AI Services](docs/AI-SERVICES.md)
   - Service interfaces
   - Key features
   - Usage examples
   - Performance metrics

4. [AI Implementation](docs/AI-IMPLEMENTATION.md)
   - Technical details
   - Core services
   - Integration patterns
   - Advanced usage

## Development

- Backend uses PHP 8.4 with PostgreSQL
- Frontend uses Next.js 14 with TypeScript and Tailwind CSS
- API follows RESTful principles
- CORS is configured for local development

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher
- Python 3.11 or higher
- PostgreSQL 16 or higher

### Frontend Development
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

### Documentation
- View documentation: `npm run docs:dev`
- Build documentation: `npm run docs:build`
- Test documentation: `npm run docs:test`
- Deploy documentation: `npm run docs:deploy`

## Production Deployment

1. Set environment variables
2. Build frontend:
   ```bash
   cd frontend
   npm run build
   ```
3. Configure web server (Apache/Nginx) for PHP
4. Configure SSL certificates
5. Set up database backups

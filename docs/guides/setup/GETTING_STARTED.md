# Getting Started with MakeupHub

## Prerequisites

### Required Software
- Node.js (v18.0.0 or higher)
- npm (v8.0.0 or higher)
- Git
- Visual Studio Code (recommended)

### System Requirements
- 4GB RAM minimum
- 10GB free disk space
- Modern web browser (Chrome/Firefox/Safari)

## Quick Start

1. **Clone the Repository**
```bash
git clone https://github.com/your-org/makeupHub.git
cd makeupHub
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set Up Environment Variables**
```bash
cp .env.example .env
# Edit .env with your local configuration
```

4. **Start Development Server**
```bash
npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Documentation: http://localhost:3000/docs

## Project Structure

```
makeupHub/
├── src/                # Source code
│   ├── components/    # React components
│   ├── pages/         # Next.js pages
│   ├── services/      # Business logic
│   ├── styles/        # CSS/SCSS files
│   └── utils/         # Utility functions
├── public/            # Static files
├── tests/             # Test files
├── docs/             # Documentation
└── scripts/          # Build scripts
```

## Development Workflow

1. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make Changes**
- Write code
- Add tests
- Update documentation

3. **Run Tests**
```bash
npm run test
npm run lint
```

4. **Submit Changes**
```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

5. **Create Pull Request**
- Go to GitHub
- Create PR from your branch
- Fill out PR template
- Request review

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code

## Common Tasks

### Adding a New Component
1. Create component file in `src/components`
2. Create test file in `tests/components`
3. Add exports to `index.ts`
4. Update documentation if needed

### Adding a New Page
1. Create page in `src/pages`
2. Add route to Next.js configuration
3. Add tests in `tests/pages`
4. Update sitemap

### Adding New API Endpoint
1. Create endpoint in `src/pages/api`
2. Add validation
3. Add tests
4. Update API documentation

## Troubleshooting

### Common Issues

1. **Node Version Mismatch**
```bash
nvm use # Use correct Node version
```

2. **Port Already in Use**
```bash
lsof -i :3000 # Find process
kill -9 <PID> # Kill process
```

3. **Build Errors**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Getting Help

1. Check documentation
2. Search existing issues
3. Ask in team chat
4. Create new issue

## Next Steps

1. Read [Architecture Overview](../../architecture/OVERVIEW.md)
2. Review [Code Style Guide](../development/CODE_STYLE.md)
3. Set up [Development Environment](./DEVELOPMENT.md)
4. Learn [Git Workflow](../development/GIT_WORKFLOW.md)

## Additional Resources

- [Full Documentation](../../TABLE_OF_CONTENTS.md)
- [API Documentation](../../api/README.md)
- [Testing Guide](../testing/STRATEGY.md)
- [Deployment Guide](../deployment/DEPLOYMENT.md)

## Support

- GitHub Issues: [Link to Issues]
- Team Chat: [Link to Chat]
- Email: support@makeupHub.com

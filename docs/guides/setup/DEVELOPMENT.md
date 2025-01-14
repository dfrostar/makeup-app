# Development Environment Setup

## Development Tools

### Required Tools
1. **Code Editor**
   - Visual Studio Code
   - Required Extensions:
     - ESLint
     - Prettier
     - TypeScript
     - Jest
     - GitLens

2. **Version Control**
   - Git
   - GitHub Desktop (optional)

3. **Development Environment**
   - Node.js (v18+)
   - npm (v8+)
   - Docker
   - Docker Compose

4. **Browser Tools**
   - Chrome DevTools
   - React Developer Tools
   - Redux DevTools
   - Lighthouse

## Environment Setup

### 1. Visual Studio Code Setup

```json
// settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.updateImportsOnFileMove.enabled": "always",
  "javascript.updateImportsOnFileMove.enabled": "always"
}
```

### 2. Git Configuration

```bash
# Set up Git credentials
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set up SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"
```

### 3. Node.js Setup

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js
nvm install 18
nvm use 18
```

### 4. Docker Setup

```bash
# Install Docker and Docker Compose
# Follow platform-specific instructions

# Verify installation
docker --version
docker-compose --version
```

## Local Development

### 1. Database Setup

```bash
# Start local database
docker-compose up -d db

# Run migrations
npm run migrate

# Seed database
npm run seed
```

### 2. Environment Variables

```bash
# Development environment
NODE_ENV=development
API_URL=http://localhost:3001
DATABASE_URL=postgresql://user:password@localhost:5432/makeupHub
REDIS_URL=redis://localhost:6379
```

### 3. Development Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start with debugging
npm run dev:debug
```

## Testing Environment

### 1. Test Database

```bash
# Start test database
docker-compose -f docker-compose.test.yml up -d

# Run test migrations
NODE_ENV=test npm run migrate
```

### 2. Test Environment Variables

```bash
# Test environment
NODE_ENV=test
TEST_DATABASE_URL=postgresql://test:test@localhost:5433/makeupHub_test
TEST_REDIS_URL=redis://localhost:6380
```

### 3. Running Tests

```bash
# Run all tests
npm test

# Run specific tests
npm test -- path/to/test

# Run with coverage
npm run test:coverage
```

## Debug Configuration

### 1. VS Code Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/src/server.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    },
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Client",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

### 2. Browser Debugging

1. Open Chrome DevTools (F12)
2. Enable source maps
3. Add breakpoints
4. Use React DevTools

## Code Quality Tools

### 1. ESLint Configuration

```json
// .eslintrc
{
  "extends": [
    "next",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn"
  }
}
```

### 2. Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80
}
```

### 3. Git Hooks

```bash
# Install husky
npm install husky --save-dev

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run test"
```

## Performance Monitoring

### 1. Lighthouse CLI

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000
```

### 2. Performance Testing

```bash
# Run performance tests
npm run test:performance

# Generate performance report
npm run report:performance
```

## Common Development Tasks

### 1. Creating New Component

```bash
# Generate component
npm run generate component ComponentName

# Run component tests
npm test src/components/ComponentName
```

### 2. Database Operations

```bash
# Create migration
npm run migrate:create MigrationName

# Run pending migrations
npm run migrate:up

# Rollback migration
npm run migrate:down
```

### 3. API Development

```bash
# Generate API documentation
npm run docs:generate

# Test API endpoint
curl http://localhost:3001/api/endpoint
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
```bash
# Find process using port
lsof -i :3000
# Kill process
kill -9 PID
```

2. **Node Module Issues**
```bash
# Clear node modules
rm -rf node_modules
rm package-lock.json
# Reinstall
npm install
```

3. **Database Connection Issues**
```bash
# Check database status
docker ps
# Restart database
docker-compose restart db
```

## Additional Resources

- [VS Code Documentation](https://code.visualstudio.com/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [Docker Documentation](https://docs.docker.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [React Documentation](https://reactjs.org/docs)

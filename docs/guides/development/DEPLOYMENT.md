# Deployment Guide

## Overview

This guide covers our deployment process, including environment setup, build configuration, and deployment strategies.

## Environments

### 1. Environment Configuration
```typescript
// config/environment.ts
interface Environment {
  name: string;
  apiUrl: string;
  database: {
    host: string;
    port: number;
    name: string;
  };
  redis: {
    host: string;
    port: number;
  };
}

const environments: Record<string, Environment> = {
  development: {
    name: 'development',
    apiUrl: 'http://localhost:3000',
    database: {
      host: 'localhost',
      port: 5432,
      name: 'makeup_dev'
    },
    redis: {
      host: 'localhost',
      port: 6379
    }
  },
  staging: {
    name: 'staging',
    apiUrl: 'https://staging-api.makeupHub.com',
    database: {
      host: 'staging-db.makeupHub.com',
      port: 5432,
      name: 'makeup_staging'
    },
    redis: {
      host: 'staging-redis.makeupHub.com',
      port: 6379
    }
  },
  production: {
    name: 'production',
    apiUrl: 'https://api.makeupHub.com',
    database: {
      host: 'prod-db.makeupHub.com',
      port: 5432,
      name: 'makeup_prod'
    },
    redis: {
      host: 'prod-redis.makeupHub.com',
      port: 6379
    }
  }
};
```

### 2. Environment Variables
```bash
# .env.example
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=makeup_dev
DB_USER=postgres
DB_PASSWORD=secret

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-west-2
S3_BUCKET=makeup-uploads

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h

# External Services
STRIPE_API_KEY=your_stripe_key
SENDGRID_API_KEY=your_sendgrid_key
```

## Build Configuration

### 1. Frontend Build
```javascript
// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_URL: JSON.stringify(process.env.API_URL)
      }
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
```

### 2. Backend Build
```javascript
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

## Deployment Process

### 1. CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: docker build -t makeup-app .
      - name: Push to ECR
        run: |
          aws ecr get-login-password --region ${{ secrets.AWS_REGION }} | \
          docker login --username AWS --password-stdin ${{ secrets.ECR_REGISTRY }}
          docker tag makeup-app:latest ${{ secrets.ECR_REGISTRY }}/makeup-app:latest
          docker push ${{ secrets.ECR_REGISTRY }}/makeup-app:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster makeup-cluster \
            --service makeup-service \
            --force-new-deployment
```

### 2. Docker Configuration
```dockerfile
# Dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

## Infrastructure Setup

### 1. AWS Infrastructure
```typescript
// infrastructure/aws.ts
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

// VPC
const vpc = new aws.ec2.Vpc('makeup-vpc', {
  cidrBlock: '10.0.0.0/16',
  enableDnsHostnames: true,
  enableDnsSupport: true
});

// ECS Cluster
const cluster = new aws.ecs.Cluster('makeup-cluster', {
  name: 'makeup-cluster'
});

// Application Load Balancer
const alb = new aws.lb.LoadBalancer('makeup-alb', {
  internal: false,
  loadBalancerType: 'application',
  securityGroups: [albSg.id],
  subnets: publicSubnets.map(subnet => subnet.id)
});

// ECS Service
const service = new aws.ecs.Service('makeup-service', {
  cluster: cluster.id,
  desiredCount: 2,
  launchType: 'FARGATE',
  taskDefinition: taskDefinition.arn,
  networkConfiguration: {
    subnets: privateSubnets.map(subnet => subnet.id),
    securityGroups: [serviceSg.id]
  },
  loadBalancers: [{
    targetGroupArn: targetGroup.arn,
    containerName: 'makeup-app',
    containerPort: 3000
  }]
});
```

### 2. Database Migration
```typescript
// migrations/20240101000000_initial.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', table => {
    table.uuid('id').primary();
    table.string('email').unique().notNullable();
    table.string('name').notNullable();
    table.string('password_hash').notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('products', table => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.decimal('price').notNullable();
    table.integer('stock').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('products');
  await knex.schema.dropTable('users');
}
```

## Monitoring and Logging

### 1. Application Monitoring
```typescript
// monitoring/setup.ts
import { NewRelic } from 'newrelic';
import { Sentry } from '@sentry/node';

export const setupMonitoring = () => {
  // New Relic setup
  NewRelic.configure({
    appName: process.env.NEW_RELIC_APP_NAME,
    licenseKey: process.env.NEW_RELIC_LICENSE_KEY
  });

  // Sentry setup
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0
  });
};

// Error tracking
export const trackError = (error: Error) => {
  Sentry.captureException(error);
  NewRelic.noticeError(error);
};
```

### 2. Logging Configuration
```typescript
// logging/setup.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error'
    })
  ]
});

if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.CloudWatch({
    logGroupName: '/makeup-app/logs',
    logStreamName: `${process.env.NODE_ENV}-${new Date().toISOString()}`
  }));
}
```

## Deployment Checklist

1. **Pre-deployment**
   - Run all tests
   - Check dependencies
   - Update documentation
   - Review security

2. **Deployment**
   - Backup database
   - Run migrations
   - Deploy code
   - Verify deployment

3. **Post-deployment**
   - Monitor metrics
   - Check logs
   - Test functionality
   - Update status

## Best Practices

1. **Version Control**
   - Use semantic versioning
   - Tag releases
   - Keep changelog

2. **Security**
   - Rotate credentials
   - Audit dependencies
   - Monitor access

3. **Performance**
   - Optimize assets
   - Cache responses
   - Monitor metrics

4. **Reliability**
   - Use health checks
   - Implement retries
   - Set up alerts

## Additional Resources

- [AWS Best Practices](../aws/BEST_PRACTICES.md)
- [Docker Guide](../docker/GUIDE.md)
- [Monitoring Guide](../monitoring/GUIDE.md)
- [Security Checklist](../security/CHECKLIST.md)

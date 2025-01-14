module.exports = {
  // TypeDoc configuration for TypeScript documentation
  typedoc: {
    entryPoints: ['../src'],
    out: 'api-docs',
    exclude: ['**/*.test.ts', '**/*.spec.ts'],
    theme: 'default',
    readme: 'none',
    plugin: ['typedoc-plugin-markdown'],
  },

  // Swagger/OpenAPI configuration
  swagger: {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Beauty Directory Platform API',
        version: '1.0.0',
        description: 'API documentation for the Beauty Directory Platform',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
    },
    apis: ['../src/routes/*.ts'],
  },

  // Markdown lint configuration
  markdownlint: {
    default: true,
    'line-length': false,
    'no-inline-html': false,
  },

  // Storybook configuration for component documentation
  storybook: {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
    addons: [
      '@storybook/addon-links',
      '@storybook/addon-essentials',
      '@storybook/addon-a11y',
    ],
  },

  // Documentation build configuration
  build: {
    // Source directories for documentation
    src: {
      api: '../src/api',
      components: '../src/components',
      features: '../src/features',
    },
    // Output directories
    out: {
      api: './api',
      components: './components',
      features: './features',
    },
    // Template directories
    templates: {
      api: './templates/api-template.md',
      feature: './templates/feature-template.md',
      architecture: './templates/architecture-template.md',
    },
  },

  // Documentation validation rules
  validation: {
    // Required sections in documentation
    requiredSections: [
      'Overview',
      'Technical Implementation',
      'Usage',
      'Testing',
      'Security Considerations',
    ],
    // Link validation configuration
    links: {
      ignorePatterns: [
        {
          pattern: '^http://localhost',
        },
      ],
    },
    // Code example validation
    codeExamples: {
      typescript: true,
      javascript: true,
    },
  },

  // Documentation generation hooks
  hooks: {
    // Pre-build hooks
    preBuild: [
      'npm run lint:md',
      'npm run test:links',
      'npm run validate:examples',
    ],
    // Post-build hooks
    postBuild: [
      'npm run optimize:images',
      'npm run generate:search-index',
      'npm run validate:html',
    ],
  },

  // Search configuration
  search: {
    // Algolia DocSearch configuration
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_API_KEY',
      indexName: 'beauty-directory',
    },
    // Local search configuration
    local: {
      indexPath: './search-index',
      includeSelectors: [
        '.content h1',
        '.content h2',
        '.content h3',
        '.content p',
      ],
    },
  },

  // Version control configuration
  versioning: {
    enabled: true,
    versions: ['1.0.0', '1.1.0', '2.0.0'],
    defaultVersion: '2.0.0',
    versionedPaths: ['/api', '/components', '/features'],
  },

  // Analytics configuration
  analytics: {
    enabled: true,
    googleAnalytics: {
      trackingId: 'UA-XXXXXXXXX-X',
    },
  },
};

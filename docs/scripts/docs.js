const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const config = require('../config/documentation.config.js');

class DocumentationBuilder {
  constructor() {
    this.config = config;
  }

  async build() {
    try {
      console.log('Starting documentation build...');
      
      // Run pre-build hooks
      await this.runHooks('preBuild');

      // Generate API documentation
      await this.generateApiDocs();

      // Generate component documentation
      await this.generateComponentDocs();

      // Generate feature documentation
      await this.generateFeatureDocs();

      // Validate documentation
      await this.validateDocs();

      // Generate search index
      await this.generateSearchIndex();

      // Run post-build hooks
      await this.runHooks('postBuild');

      console.log('Documentation build completed successfully!');
    } catch (error) {
      console.error('Documentation build failed:', error);
      process.exit(1);
    }
  }

  async runHooks(type) {
    console.log(`Running ${type} hooks...`);
    for (const hook of this.config.hooks[type]) {
      try {
        execSync(hook, { stdio: 'inherit' });
      } catch (error) {
        console.error(`Hook failed: ${hook}`, error);
        throw error;
      }
    }
  }

  async generateApiDocs() {
    console.log('Generating API documentation...');
    const { src, out, templates } = this.config.build;
    
    // Generate OpenAPI documentation
    execSync('npx swagger-jsdoc -d ./config/documentation.config.js -o ./api/swagger.json');
    
    // Generate TypeScript documentation
    execSync('npx typedoc --options ./config/documentation.config.js');
  }

  async generateComponentDocs() {
    console.log('Generating component documentation...');
    // Build Storybook
    execSync('npm run build-storybook');
  }

  async generateFeatureDocs() {
    console.log('Generating feature documentation...');
    const { src, out, templates } = this.config.build;
    
    // Read feature template
    const featureTemplate = fs.readFileSync(templates.feature, 'utf8');
    
    // Generate documentation for each feature
    const features = fs.readdirSync(src.features);
    for (const feature of features) {
      const featurePath = path.join(src.features, feature);
      const outPath = path.join(out.features, `${feature}.md`);
      
      // Generate feature documentation
      const featureDoc = this.generateFeatureDoc(featurePath, featureTemplate);
      fs.writeFileSync(outPath, featureDoc);
    }
  }

  generateFeatureDoc(featurePath, template) {
    // Implement feature documentation generation logic
    // This would analyze the feature code and generate documentation
    return template.replace(
      '${featureName}',
      path.basename(featurePath)
    );
  }

  async validateDocs() {
    console.log('Validating documentation...');
    
    // Validate required sections
    this.validateRequiredSections();
    
    // Validate links
    execSync('npm run test:links');
    
    // Validate code examples
    execSync('npm run validate:examples');
  }

  validateRequiredSections() {
    const { requiredSections } = this.config.validation;
    // Implement validation logic for required sections
  }

  async generateSearchIndex() {
    console.log('Generating search index...');
    if (this.config.search.algolia.appId) {
      // Generate Algolia index
      execSync('npm run generate:algolia-index');
    } else {
      // Generate local search index
      this.generateLocalSearchIndex();
    }
  }

  generateLocalSearchIndex() {
    const { indexPath, includeSelectors } = this.config.search.local;
    // Implement local search index generation
  }
}

// Run documentation build
const builder = new DocumentationBuilder();
builder.build().catch(console.error);

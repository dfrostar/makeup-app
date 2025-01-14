const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

class DocumentationMigration {
  constructor() {
    this.oldDocsPath = path.join(__dirname, '../');
    this.newDocsPath = path.join(__dirname, '../new-structure');
    this.templatePath = path.join(__dirname, '../templates');
  }

  async migrate() {
    try {
      console.log('Starting documentation migration...');

      // Create new structure directories
      this.createDirectoryStructure();

      // Migrate existing documentation
      await this.migrateExistingDocs();

      // Update internal links
      await this.updateInternalLinks();

      // Generate new index files
      await this.generateIndexFiles();

      console.log('Documentation migration completed successfully!');
    } catch (error) {
      console.error('Documentation migration failed:', error);
      throw error;
    }
  }

  createDirectoryStructure() {
    const directories = [
      'getting-started',
      'architecture/frontend',
      'architecture/backend',
      'architecture/ai',
      'features/ar',
      'features/search',
      'features/social',
      'guides/development',
      'guides/deployment',
      'guides/maintenance',
      'api/endpoints',
      'api/integration',
      'testing',
      'seo',
      'security',
      'references'
    ];

    for (const dir of directories) {
      const fullPath = path.join(this.newDocsPath, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }
  }

  async migrateExistingDocs() {
    const files = this.findMarkdownFiles(this.oldDocsPath);
    const migrationMap = this.createMigrationMap();

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const { data, content: markdown } = matter(content);
      
      // Determine new location based on content
      const newLocation = this.determineNewLocation(file, data, migrationMap);
      if (!newLocation) continue; // Skip if no mapping found

      // Transform content to new format
      const newContent = await this.transformContent(markdown, data);

      // Write to new location
      const newPath = path.join(this.newDocsPath, newLocation);
      fs.writeFileSync(newPath, newContent);

      console.log(`Migrated: ${file} -> ${newPath}`);
    }
  }

  createMigrationMap() {
    return {
      'FRONTEND-ARCHITECTURE.md': 'architecture/frontend/overview.md',
      'AI-IMPLEMENTATION.md': 'architecture/ai/implementation.md',
      'API-INTEGRATION-SPECS.md': 'api/integration/specs.md',
      'SEO-GUIDELINES.md': 'seo/guidelines.md',
      // Add more mappings as needed
    };
  }

  determineNewLocation(file, frontmatter, migrationMap) {
    const filename = path.basename(file);
    
    // Check direct mapping
    if (migrationMap[filename]) {
      return migrationMap[filename];
    }

    // Determine location based on content
    if (frontmatter.category) {
      switch (frontmatter.category.toLowerCase()) {
        case 'api':
          return `api/endpoints/${filename}`;
        case 'feature':
          return `features/${filename}`;
        case 'guide':
          return `guides/development/${filename}`;
        // Add more categories as needed
      }
    }

    // Fallback: keep in root if no mapping found
    return filename;
  }

  async transformContent(content, frontmatter) {
    // Load appropriate template
    let template = '';
    if (frontmatter.type === 'api') {
      template = fs.readFileSync(path.join(this.templatePath, 'api-template.md'), 'utf8');
    } else if (frontmatter.type === 'feature') {
      template = fs.readFileSync(path.join(this.templatePath, 'feature-template.md'), 'utf8');
    } else {
      template = fs.readFileSync(path.join(this.templatePath, 'architecture-template.md'), 'utf8');
    }

    // Transform content to match template
    let newContent = template;
    
    // Replace template placeholders with actual content
    newContent = newContent.replace('${title}', frontmatter.title || '');
    newContent = newContent.replace('${description}', frontmatter.description || '');
    newContent = newContent.replace('${content}', content);

    return newContent;
  }

  async updateInternalLinks() {
    const files = this.findMarkdownFiles(this.newDocsPath);
    
    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      
      // Update internal links based on new structure
      content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, link) => {
        if (link.startsWith('http')) return match; // Skip external links
        
        const newLink = this.updateLink(link);
        return `[${text}](${newLink})`;
      });

      fs.writeFileSync(file, content);
    }
  }

  updateLink(link) {
    // Update link based on new structure
    const migrationMap = this.createMigrationMap();
    const filename = path.basename(link);
    
    if (migrationMap[filename]) {
      return migrationMap[filename];
    }
    
    return link;
  }

  async generateIndexFiles() {
    const directories = [
      '',
      'getting-started',
      'architecture',
      'features',
      'guides',
      'api',
      'testing',
      'seo',
      'security',
      'references'
    ];

    for (const dir of directories) {
      const fullPath = path.join(this.newDocsPath, dir);
      if (!fs.existsSync(fullPath)) continue;

      const files = fs.readdirSync(fullPath)
        .filter(file => file.endsWith('.md') && file !== 'index.md');

      let indexContent = `# ${dir || 'Documentation'}\n\n`;
      
      for (const file of files) {
        const content = fs.readFileSync(path.join(fullPath, file), 'utf8');
        const { data } = matter(content);
        
        indexContent += `- [${data.title || file.replace('.md', '')}](./${file})\n`;
      }

      fs.writeFileSync(path.join(fullPath, 'index.md'), indexContent);
    }
  }

  findMarkdownFiles(directory) {
    const files = [];
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        files.push(...this.findMarkdownFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }

    return files;
  }
}

// Run migration if called directly
if (require.main === module) {
  const migration = new DocumentationMigration();
  migration.migrate().catch(console.error);
}

module.exports = DocumentationMigration;

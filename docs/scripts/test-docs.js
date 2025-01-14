const fs = require('fs');
const path = require('path');
const markdownlint = require('markdownlint');
const linkCheck = require('markdown-link-check');
const { promisify } = require('util');
const glob = require('glob');
const matter = require('gray-matter');

class DocumentationTesting {
  constructor() {
    this.docsPath = path.join(__dirname, '../');
    this.results = {
      linting: [],
      links: [],
      structure: [],
      examples: []
    };
  }

  async runTests() {
    try {
      console.log('Starting documentation tests...');

      // Run all tests
      await Promise.all([
        this.lintMarkdown(),
        this.checkLinks(),
        this.validateStructure(),
        this.validateExamples()
      ]);

      // Generate test report
      await this.generateReport();

      // Check if tests passed
      const passed = this.checkTestResults();

      if (passed) {
        console.log('All documentation tests passed!');
      } else {
        throw new Error('Documentation tests failed. See report for details.');
      }
    } catch (error) {
      console.error('Documentation testing failed:', error);
      throw error;
    }
  }

  async lintMarkdown() {
    console.log('Linting markdown files...');

    const options = {
      files: [path.join(this.docsPath, '**/*.md')],
      config: {
        default: true,
        'line-length': false,
        'no-inline-html': false
      }
    };

    const result = await promisify(markdownlint)(options);
    
    for (const file in result) {
      if (result[file].length > 0) {
        this.results.linting.push({
          file,
          errors: result[file]
        });
      }
    }
  }

  async checkLinks() {
    console.log('Checking links...');

    const files = await promisify(glob)(path.join(this.docsPath, '**/*.md'));
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const links = await this.extractLinks(content);

      for (const link of links) {
        try {
          await promisify(linkCheck)(link);
        } catch (error) {
          this.results.links.push({
            file,
            link,
            error: error.message
          });
        }
      }
    }
  }

  async validateStructure() {
    console.log('Validating documentation structure...');

    const requiredSections = [
      'getting-started',
      'architecture',
      'features',
      'guides',
      'api'
    ];

    for (const section of requiredSections) {
      const sectionPath = path.join(this.docsPath, section);
      if (!fs.existsSync(sectionPath)) {
        this.results.structure.push({
          type: 'missing-section',
          section
        });
      }
    }

    // Check each markdown file for required frontmatter
    const files = await promisify(glob)(path.join(this.docsPath, '**/*.md'));
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const { data } = matter(content);

      if (!data.title) {
        this.results.structure.push({
          type: 'missing-frontmatter',
          file,
          field: 'title'
        });
      }
    }
  }

  async validateExamples() {
    console.log('Validating code examples...');

    const files = await promisify(glob)(path.join(this.docsPath, '**/*.md'));
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const codeBlocks = this.extractCodeBlocks(content);

      for (const block of codeBlocks) {
        try {
          await this.validateCodeBlock(block);
        } catch (error) {
          this.results.examples.push({
            file,
            language: block.language,
            error: error.message
          });
        }
      }
    }
  }

  extractCodeBlocks(content) {
    const blocks = [];
    const regex = /```(\w+)\n([\s\S]*?)```/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      blocks.push({
        language: match[1],
        code: match[2]
      });
    }

    return blocks;
  }

  async validateCodeBlock(block) {
    switch (block.language) {
      case 'typescript':
      case 'javascript':
        // Validate JS/TS code
        await this.validateJavaScript(block.code);
        break;
      case 'json':
        // Validate JSON
        JSON.parse(block.code);
        break;
      // Add more language validators as needed
    }
  }

  async validateJavaScript(code) {
    // Simple syntax validation
    // In a real implementation, you might want to use a proper parser
    try {
      new Function(code);
    } catch (error) {
      throw new Error(`Invalid JavaScript/TypeScript: ${error.message}`);
    }
  }

  async generateReport() {
    console.log('Generating test report...');

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        linting: this.results.linting.length,
        links: this.results.links.length,
        structure: this.results.structure.length,
        examples: this.results.examples.length
      },
      details: this.results
    };

    const reportPath = path.join(this.docsPath, 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate HTML report
    const htmlReport = this.generateHtmlReport(report);
    fs.writeFileSync(
      path.join(this.docsPath, 'test-report.html'),
      htmlReport
    );
  }

  generateHtmlReport(report) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Documentation Test Report</title>
          <style>
            body { font-family: system-ui; max-width: 800px; margin: 0 auto; padding: 20px; }
            .error { color: red; }
            .success { color: green; }
          </style>
        </head>
        <body>
          <h1>Documentation Test Report</h1>
          <p>Generated: ${report.timestamp}</p>
          
          <h2>Summary</h2>
          <ul>
            <li class="${report.summary.linting > 0 ? 'error' : 'success'}">
              Linting Issues: ${report.summary.linting}
            </li>
            <li class="${report.summary.links > 0 ? 'error' : 'success'}">
              Broken Links: ${report.summary.links}
            </li>
            <li class="${report.summary.structure > 0 ? 'error' : 'success'}">
              Structure Issues: ${report.summary.structure}
            </li>
            <li class="${report.summary.examples > 0 ? 'error' : 'success'}">
              Code Example Issues: ${report.summary.examples}
            </li>
          </ul>

          <h2>Details</h2>
          <pre>${JSON.stringify(report.details, null, 2)}</pre>
        </body>
      </html>
    `;
  }

  checkTestResults() {
    // Check if any tests failed
    return (
      this.results.linting.length === 0 &&
      this.results.links.length === 0 &&
      this.results.structure.length === 0 &&
      this.results.examples.length === 0
    );
  }
}

// Run tests if called directly
if (require.main === module) {
  const testing = new DocumentationTesting();
  testing.runTests().catch(console.error);
}

module.exports = DocumentationTesting;

const fs = require('fs');
const path = require('path');
const semver = require('semver');

class DocumentationVersioning {
  constructor() {
    this.versionsDir = path.join(__dirname, '../versions');
    this.currentVersion = require('../../package.json').version;
    this.versionsConfig = path.join(__dirname, '../versions.json');
  }

  async createVersion() {
    try {
      console.log(`Creating documentation version ${this.currentVersion}...`);

      // Ensure versions directory exists
      if (!fs.existsSync(this.versionsDir)) {
        fs.mkdirSync(this.versionsDir, { recursive: true });
      }

      // Load versions config
      let versions = [];
      if (fs.existsSync(this.versionsConfig)) {
        versions = JSON.parse(fs.readFileSync(this.versionsConfig, 'utf8'));
      }

      // Check if version already exists
      if (versions.includes(this.currentVersion)) {
        console.log(`Version ${this.currentVersion} already exists`);
        return;
      }

      // Copy current docs to versioned directory
      const versionDir = path.join(this.versionsDir, `v${this.currentVersion}`);
      this.copyDirectory(path.join(__dirname, '../dist'), versionDir);

      // Update versions list
      versions.push(this.currentVersion);
      versions.sort((a, b) => semver.compare(b, a)); // Sort in descending order
      fs.writeFileSync(this.versionsConfig, JSON.stringify(versions, null, 2));

      // Update version switcher
      await this.updateVersionSwitcher(versions);

      console.log(`Successfully created version ${this.currentVersion}`);
    } catch (error) {
      console.error('Failed to create version:', error);
      throw error;
    }
  }

  copyDirectory(source, destination) {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const files = fs.readdirSync(source);
    for (const file of files) {
      const sourcePath = path.join(source, file);
      const destPath = path.join(destination, file);

      if (fs.statSync(sourcePath).isDirectory()) {
        this.copyDirectory(sourcePath, destPath);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  }

  async updateVersionSwitcher(versions) {
    const template = `
      <div class="version-switcher">
        <select onchange="window.location.href=this.value">
          ${versions.map(version => `
            <option value="/versions/v${version}" ${version === this.currentVersion ? 'selected' : ''}>
              v${version}
            </option>
          `).join('')}
        </select>
      </div>
    `;

    // Update version switcher in all HTML files
    const htmlFiles = this.findHtmlFiles(path.join(__dirname, '../dist'));
    for (const file of htmlFiles) {
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(
        /<div class="version-switcher">.*?<\/div>/s,
        template
      );
      fs.writeFileSync(file, content);
    }
  }

  findHtmlFiles(directory) {
    const files = [];
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        files.push(...this.findHtmlFiles(fullPath));
      } else if (entry.isFile() && path.extname(entry.name) === '.html') {
        files.push(fullPath);
      }
    }

    return files;
  }

  async cleanOldVersions(keepCount = 5) {
    try {
      console.log('Cleaning old documentation versions...');

      // Load versions config
      if (!fs.existsSync(this.versionsConfig)) {
        return;
      }

      const versions = JSON.parse(fs.readFileSync(this.versionsConfig, 'utf8'));
      if (versions.length <= keepCount) {
        return;
      }

      // Remove old versions
      const versionsToRemove = versions.slice(keepCount);
      for (const version of versionsToRemove) {
        const versionDir = path.join(this.versionsDir, `v${version}`);
        if (fs.existsSync(versionDir)) {
          fs.rmSync(versionDir, { recursive: true });
          console.log(`Removed version ${version}`);
        }
      }

      // Update versions config
      const keepVersions = versions.slice(0, keepCount);
      fs.writeFileSync(this.versionsConfig, JSON.stringify(keepVersions, null, 2));

      console.log('Successfully cleaned old versions');
    } catch (error) {
      console.error('Failed to clean old versions:', error);
      throw error;
    }
  }
}

// Run versioning if called directly
if (require.main === module) {
  const versioning = new DocumentationVersioning();
  versioning.createVersion()
    .then(() => versioning.cleanOldVersions())
    .catch(console.error);
}

module.exports = DocumentationVersioning;

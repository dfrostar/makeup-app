const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

// Paths to watch for content changes
const watchPaths = [
  path.join(__dirname, '../cms/src/api/*/content-types/*/schema.json'),
  path.join(__dirname, '../frontend/src/content')
];

// Initialize watcher
const watcher = chokidar.watch(watchPaths, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

// Generate sitemap function
const generateSitemap = () => {
  console.log('Content changed, regenerating sitemap...');
  exec('node generate-sitemap.js', { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error generating sitemap: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`Sitemap generation stderr: ${stderr}`);
      return;
    }
    console.log(`Sitemap generated successfully: ${stdout}`);
  });
};

// Add event listeners
watcher
  .on('add', path => {
    console.log(`File ${path} has been added`);
    generateSitemap();
  })
  .on('change', path => {
    console.log(`File ${path} has been changed`);
    generateSitemap();
  })
  .on('unlink', path => {
    console.log(`File ${path} has been removed`);
    generateSitemap();
  });

console.log('Watching for content changes...');

const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const LOOKS = [
  {
    name: 'natural-glam',
    url: 'https://images.unsplash.com/photo-1588178457102-91a5b6907d4c'
  },
  {
    name: 'bold-evening',
    url: 'https://images.unsplash.com/photo-1588177307332-3dab7ab23f5c'
  },
  {
    name: 'festival',
    url: 'https://images.unsplash.com/photo-1588177305295-71ddd7e5459c'
  },
  {
    name: 'glass-skin',
    url: 'https://images.unsplash.com/photo-1588177403451-2d5b5b8d6ea9'
  },
  {
    name: 'y2k',
    url: 'https://images.unsplash.com/photo-1588177403452-2d5b5b8d6ea8'
  }
];

const ARTISTS = [
  {
    name: 'sarah',
    url: 'https://images.unsplash.com/photo-1588177403453-2d5b5b8d6ea7'
  },
  {
    name: 'maria',
    url: 'https://images.unsplash.com/photo-1588177403454-2d5b5b8d6ea6'
  },
  {
    name: 'alex',
    url: 'https://images.unsplash.com/photo-1588177403455-2d5b5b8d6ea5'
  },
  {
    name: 'jenny',
    url: 'https://images.unsplash.com/photo-1588177403456-2d5b5b8d6ea4'
  },
  {
    name: 'zoe',
    url: 'https://images.unsplash.com/photo-1588177403457-2d5b5b8d6ea3'
  }
];

async function downloadAndOptimize(url, outputPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          await sharp(buffer)
            .resize(800, 1000, { fit: 'cover' })
            .webp({ quality: 80 })
            .toFile(outputPath);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  // Create directories if they don't exist
  const dirs = ['looks', 'artists'].map(dir => 
    path.join(__dirname, '..', 'public', 'images', dir)
  );
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Download and optimize look images
  console.log('Downloading and optimizing look images...');
  for (const look of LOOKS) {
    const outputPath = path.join(dirs[0], `${look.name}.webp`);
    await downloadAndOptimize(look.url, outputPath);
    console.log(`✓ ${look.name}`);
  }

  // Download and optimize artist images
  console.log('\nDownloading and optimizing artist images...');
  for (const artist of ARTISTS) {
    const outputPath = path.join(dirs[1], `${artist.name}.webp`);
    await downloadAndOptimize(artist.url, outputPath);
    console.log(`✓ ${artist.name}`);
  }

  console.log('\nAll images downloaded and optimized!');
}

main().catch(console.error);

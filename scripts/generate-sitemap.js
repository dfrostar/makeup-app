const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const fs = require('fs');
const path = require('path');

async function generateSitemap() {
    // Create a stream to write to
    const stream = new SitemapStream({ hostname: 'https://makeupdir.com' });

    // Array of your routes
    const routes = [
        { url: '/', changefreq: 'daily', priority: 1.0 },
        { url: '/products', changefreq: 'daily', priority: 0.9 },
        { url: '/categories', changefreq: 'weekly', priority: 0.8 },
        { url: '/looks', changefreq: 'daily', priority: 0.8 },
        { url: '/tutorials', changefreq: 'weekly', priority: 0.7 },
        { url: '/virtual-tryon', changefreq: 'monthly', priority: 0.7 },
        { url: '/community', changefreq: 'daily', priority: 0.6 },
        { url: '/about', changefreq: 'monthly', priority: 0.5 },
        { url: '/contact', changefreq: 'monthly', priority: 0.5 },
        { url: '/privacy', changefreq: 'monthly', priority: 0.4 },
        { url: '/terms', changefreq: 'monthly', priority: 0.4 }
    ];

    // Add dynamic routes from CMS
    try {
        const response = await fetch('http://localhost:1337/api/products');
        const products = await response.json();
        
        products.data.forEach(product => {
            routes.push({
                url: `/products/${product.attributes.slug}`,
                changefreq: 'weekly',
                priority: 0.8,
                lastmod: product.attributes.updatedAt
            });
        });
    } catch (error) {
        console.warn('Warning: Could not fetch products from CMS', error);
    }

    // Create a readable stream from our routes
    const links = Readable.from(routes).pipe(stream);

    // Generate sitemap XML
    const sitemap = await streamToPromise(links);

    // Write the sitemap to disk
    fs.writeFileSync(
        path.join(__dirname, '../frontend/public/sitemap.xml'),
        sitemap.toString()
    );

    console.log('Sitemap generated successfully!');
}

// Generate sitemap
generateSitemap().catch(console.error);

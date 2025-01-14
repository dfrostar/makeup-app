import { test, expect } from '@playwright/test';
import { generateSEOConfig } from '../utils/seo';

test.describe('SEO Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should have proper meta tags', async ({ page }) => {
        // Check basic meta tags
        await expect(page).toHaveTitle(/MakeupHub/);
        const description = await page.getAttribute('meta[name="description"]', 'content');
        expect(description).toBeTruthy();
        expect(description?.length).toBeLessThan(160);

        // Check viewport
        const viewport = await page.getAttribute('meta[name="viewport"]', 'content');
        expect(viewport).toBe('width=device-width, initial-scale=1');

        // Check robots
        const robots = await page.getAttribute('meta[name="robots"]', 'content');
        expect(robots).toBe('index, follow');
    });

    test('should have proper Open Graph tags', async ({ page }) => {
        const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
        const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
        const ogType = await page.getAttribute('meta[property="og:type"]', 'content');
        const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');

        expect(ogTitle).toBeTruthy();
        expect(ogDescription).toBeTruthy();
        expect(ogType).toBe('website');
        expect(ogImage).toBeTruthy();
    });

    test('should have proper Twitter Card tags', async ({ page }) => {
        const twitterCard = await page.getAttribute('meta[name="twitter:card"]', 'content');
        const twitterTitle = await page.getAttribute('meta[name="twitter:title"]', 'content');
        const twitterDescription = await page.getAttribute('meta[name="twitter:description"]', 'content');
        const twitterImage = await page.getAttribute('meta[name="twitter:image"]', 'content');

        expect(twitterCard).toBe('summary_large_image');
        expect(twitterTitle).toBeTruthy();
        expect(twitterDescription).toBeTruthy();
        expect(twitterImage).toBeTruthy();
    });

    test('should have proper structured data', async ({ page }) => {
        const structuredData = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script[type="application/ld+json"]');
            return Array.from(scripts).map(script => JSON.parse(script.textContent || ''));
        });

        expect(structuredData.length).toBeGreaterThan(0);
        expect(structuredData[0]['@context']).toBe('https://schema.org');
    });

    test('should have proper heading hierarchy', async ({ page }) => {
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBe(1);

        const headings = await page.evaluate(() => {
            const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            return Array.from(headingElements).map(h => h.tagName);
        });

        let currentLevel = 1;
        for (const heading of headings) {
            const level = parseInt(heading[1]);
            expect(level).toBeLessThanOrEqual(currentLevel + 1);
            currentLevel = level;
        }
    });

    test('should have proper image optimization', async ({ page }) => {
        const images = await page.evaluate(() => {
            return Array.from(document.images).map(img => ({
                src: img.src,
                alt: img.alt,
                loading: img.loading,
                width: img.width,
                height: img.height,
            }));
        });

        for (const img of images) {
            expect(img.alt).toBeTruthy();
            expect(img.loading).toBe('lazy');
            expect(img.width).toBeGreaterThan(0);
            expect(img.height).toBeGreaterThan(0);
        }
    });

    test('should have proper canonical URL', async ({ page }) => {
        const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
        expect(canonical).toBeTruthy();
        expect(canonical).toMatch(/^https?:\/\//);
    });

    test('should have proper breadcrumbs', async ({ page }) => {
        const breadcrumbData = await page.evaluate(() => {
            const script = document.querySelector('script[type="application/ld+json"]');
            if (!script?.textContent) return null;
            const data = JSON.parse(script.textContent);
            return data['@type'] === 'BreadcrumbList' ? data : null;
        });

        if (breadcrumbData) {
            expect(breadcrumbData.itemListElement).toBeTruthy();
            expect(breadcrumbData.itemListElement.length).toBeGreaterThan(0);
        }
    });
});

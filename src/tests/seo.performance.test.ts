import { test, expect } from '@playwright/test';
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import { writeFileSync } from 'fs';
import path from 'path';

test.describe('SEO Performance Tests', () => {
    let chrome: any;
    let results: any;

    test.beforeAll(async () => {
        chrome = await chromeLauncher.launch({
            chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
        });

        const options = {
            logLevel: 'info',
            output: 'json',
            port: chrome.port,
            onlyCategories: ['seo', 'performance', 'accessibility']
        };

        results = await lighthouse('http://localhost:3000', options);
    }, 30000);

    test.afterAll(async () => {
        if (chrome) {
            await chrome.kill();
        }
    });

    test('should have good SEO score', async () => {
        const seoScore = results.lhr.categories.seo.score * 100;
        expect(seoScore).toBeGreaterThanOrEqual(90);
    });

    test('should have good performance score', async () => {
        const performanceScore = results.lhr.categories.performance.score * 100;
        expect(performanceScore).toBeGreaterThanOrEqual(80);
    });

    test('should have good accessibility score', async () => {
        const accessibilityScore = results.lhr.categories.accessibility.score * 100;
        expect(accessibilityScore).toBeGreaterThanOrEqual(90);
    });

    test('should save lighthouse report', async () => {
        const reportPath = path.join(process.cwd(), 'lighthouse-report.json');
        writeFileSync(reportPath, JSON.stringify(results.lhr, null, 2));
    });
});

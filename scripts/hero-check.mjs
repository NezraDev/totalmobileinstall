import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root = '.impeccable/review';
fs.mkdirSync(root, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const hero = page.locator('.photo-hero');
const active = () => hero.locator('.slide.active img').getAttribute('src');
const first = await active();
const firstHeadingBox = await page.locator('h1').boundingBox();
await page.mouse.move(400, 250);
await expect.poll(active, { timeout: 8000 }).not.toBe(first);
assert.deepEqual(await page.locator('h1').boundingBox(), firstHeadingBox);

await page.getByRole('button', { name: 'Pause slideshow', exact: true }).click();
const pausedImage = await active();
await page.waitForTimeout(6400);
assert.equal(await active(), pausedImage, 'Pause must stop automatic rotation');
await page.getByRole('button', { name: 'Play slideshow', exact: true }).click();
await expect.poll(active, { timeout: 8000 }).not.toBe(pausedImage);

await page.getByRole('button', { name: 'Next photograph', exact: true }).click();
await expect(page.getByRole('button', { name: 'Play slideshow', exact: true })).toBeVisible();
const manualImage = await active();
await page.getByRole('button', { name: 'Previous photograph', exact: true }).click();
assert.notEqual(await active(), manualImage);
await page.emulateMedia({ reducedMotion: 'reduce' });
await expect(page.getByRole('button', { name: 'Play slideshow', exact: true })).toBeDisabled();

await page.reload({ waitUntil: 'networkidle' });
const reducedImage = await active();
await page.waitForTimeout(6400);
assert.equal(await active(), reducedImage, 'Reduced motion must disable autoplay');
await page.getByRole('button', { name: 'Next photograph', exact: true }).click();
assert.notEqual(await active(), reducedImage, 'Manual controls must still work');
await page.reload({ waitUntil: 'networkidle' });
await page.screenshot({ path: `${root}/hero-desktop.png` });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', isMobile: true });
mobile.on('pageerror', (error) => errors.push(error.message));
await mobile.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await mobile.screenshot({ path: `${root}/hero-mobile.png` });
for (const width of [320, 390, 768, 1024, 1440]) {
  await mobile.setViewportSize({ width, height: 844 });
  const metrics = await mobile.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
  assert.ok(metrics.scroll <= metrics.width, `Horizontal overflow at ${width}`);
  const overlay = await mobile.locator('.hero-blue-overlay').evaluate((el) => getComputedStyle(el).backgroundImage);
  assert.ok(overlay.includes('linear-gradient') && overlay.includes('rgba('));
}
await mobile.setViewportSize({ width: 390, height: 844 });
await mobile.getByRole('link', { name: 'Explore our work', exact: true }).click();
assert.ok(mobile.url().endsWith('#our-work'));
assert.equal(await mobile.locator('.site-header').evaluate((el) => getComputedStyle(el).backgroundColor), 'rgb(255, 255, 255)');
assert.equal(await page.locator('.slideshow-section').count(), 1, 'Hero and slideshow should be combined');
assert.equal(errors.length, 0, errors.join('\n'));
console.log('Hero checks passed: autoplay under pointer, pause/resume, manual control, stable text, reduced motion, blue overlay, white navigation, and responsive widths.');
await browser.close();

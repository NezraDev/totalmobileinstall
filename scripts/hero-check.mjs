import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const out = '.impeccable/review';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const hero = page.locator('.photo-hero');
  const active = () => hero.locator('.slide.active img').getAttribute('src');
  const initial = await active();
  const heading = await page.locator('h1').boundingBox();
  await expect.poll(active, { timeout: 6000 }).not.toBe(initial);
  assert.deepEqual(await page.locator('h1').boundingBox(), heading);
  assert.equal(await hero.locator('button').count(), 0);
  const heroBounds = await hero.boundingBox();
  const headerBounds = await page.locator('.site-header').boundingBox();
  assert.ok(
    heroBounds.height + headerBounds.height >= 999,
    'Hero fills desktop first screen',
  );
  assert.equal(
    await page.locator('.brand-wordmark .brand-name').first().innerText(),
    'TOTAL MOBILE INSTALL',
  );
  assert.ok(
    (
      await page.locator('.site-header .brand-icon img').getAttribute('src')
    ).endsWith('/icon.png'),
  );
  const counterChanges = await page
    .locator('.metrics-strip')
    .evaluate(async (strip) => {
      const value = strip.querySelectorAll('.metric-value')[1];
      const samples = new Set([value.textContent]);
      const observer = new MutationObserver(() =>
        samples.add(value.textContent),
      );
      observer.observe(value, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      strip.scrollIntoView({ behavior: 'instant', block: 'center' });
      await new Promise((resolve) => setTimeout(resolve, 1450));
      observer.disconnect();
      return [...samples];
    });
  assert.ok(
    counterChanges.length > 2,
    'Metrics count up when scrolled into view',
  );
  await expect(page.locator('.metric-value').nth(1)).toHaveText('10K+', {
    timeout: 3000,
  });
  await page
    .locator('.metrics-strip')
    .screenshot({ path: `${out}/metrics-desktop.png` });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'networkidle' });
  const reducedImage = await active();
  await page.waitForTimeout(4700);
  assert.equal(await active(), reducedImage);
  await page.screenshot({ path: `${out}/home-revision-desktop.png` });
  const result = page.locator('.transformation-top h3');
  const before = await result.innerText();
  await page
    .getByRole('button', { name: 'Next transformation', exact: true })
    .click();
  assert.notEqual(await result.innerText(), before);
  await expect(page.locator('.comparison-hint')).toBeVisible();
  assert.ok(
    (await page.locator('.comparison-hint').innerText()).includes('buttons'),
  );
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
    isMobile: true,
  });
  mobile.on('pageerror', (error) => errors.push(error.message));
  await mobile.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await mobile.screenshot({ path: `${out}/home-revision-mobile.png` });
  await mobile
    .locator('.metrics-strip')
    .screenshot({ path: `${out}/metrics-mobile.png` });
  await mobile.locator('.transformations').scrollIntoViewIfNeeded();
  await mobile.locator('.transformations img').evaluateAll((images) =>
    Promise.all(
      images.map((image) => {
        image.loading = 'eager';
        return image.decode().catch(() => {});
      }),
    ),
  );
  await mobile
    .locator('.transformations')
    .screenshot({ path: `${out}/transformations-mobile.png` });
  for (const width of [320, 390, 768, 1024, 1280, 1440]) {
    await mobile.setViewportSize({ width, height: 844 });
    const sizes = await mobile.evaluate(() => ({
      width: innerWidth,
      content: document.documentElement.scrollWidth,
    }));
    assert.ok(sizes.content <= sizes.width, `Horizontal overflow at ${width}`);
  }

  await page.goto('http://localhost:5173/contact', {
    waitUntil: 'domcontentloaded',
  });
  const map = page.locator('.location-map').first();
  await map.scrollIntoViewIfNeeded();
  const embed = map.locator('iframe');
  await expect(embed).toBeVisible();
  assert.equal(
    new URL(await embed.getAttribute('src')).searchParams.get('marker'),
    '29.961365651200683,-90.09014810481109',
  );
  await expect(
    page.frameLocator('iframe.map-embed').locator('.maplibregl-marker'),
  ).toBeVisible({ timeout: 30000 });
  const mapFrame = await (await embed.elementHandle()).contentFrame();
  await mapFrame.waitForLoadState('networkidle');
  await mapFrame.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
      ),
  );
  const attribution = page
    .frameLocator('iframe.map-embed')
    .locator('.maplibregl-ctrl-attrib');
  await expect(attribution).toBeVisible();
  await map.screenshot({ path: `${out}/map-revision-desktop.png` });
  assert.equal(
    await page
      .getByRole('link', { name: 'Get directions', exact: true })
      .last()
      .getAttribute('href'),
    'https://maps.app.goo.gl/RwCt2X5jmooMkDi8A',
  );
  assert.deepEqual(errors, []);
  console.log(
    'Homepage revision checks pass: full-height hero, 4.5s rotation, no hero controls, coded wordmark, animated counters, labeled transformations, reduced motion, responsive widths.',
  );
} finally {
  await browser.close();
}

import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base = (
  process.env.TMI_BROWSER_BASE_URL || 'http://127.0.0.1:4174'
).replace(/\/$/, '');
const report = JSON.parse(
  fs.readFileSync('.ssr-build/seo-routes.json', 'utf8'),
);
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const errors = [];
const captureErrors = (page) => {
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /hydrat|did not match|server rendered|React error/i.test(message.text())
    )
      errors.push(message.text());
  });
};
fs.mkdirSync('.impeccable/review', { recursive: true });
try {
  const page = await browser.newPage({
    reducedMotion: 'reduce',
    viewport: { width: 1440, height: 1000 },
  });
  captureErrors(page);
  for (const route of report.routes) {
    const response = await page.goto(`${base}${route.path}`, {
      waitUntil: 'networkidle',
    });
    assert.equal(response.status(), 200);
    assert.equal(await page.title(), route.title);
    assert.equal(await page.locator('head title').count(), 1);
    assert.equal(
      await page.locator('head meta[name="description"]').count(),
      1,
    );
    assert.equal(
      await page.locator('link[rel="canonical"]').getAttribute('href'),
      route.canonical,
    );
    assert.equal(await page.locator('#tmi-structured-data').count(), 1);
    assert.equal(await page.locator('h1').count(), 1);
  }
  await page.goto(`${base}/book-service?service=window-tinting&mode=mobile`, {
    waitUntil: 'networkidle',
  });
  assert.equal(
    await page.getByLabel('Service needed').inputValue(),
    'window-tinting',
  );
  assert.equal(
    await page.getByLabel('Preferred service mode').inputValue(),
    'shop',
  );
  assert.equal(
    await page.locator('link[rel="canonical"]').getAttribute('href'),
    `${report.origin}/book-service`,
  );
  await page.goto(`${base}/book-service?service=mobile-detailing&mode=shop`, {
    waitUntil: 'networkidle',
  });
  assert.equal(
    await page.getByLabel('Detailing service', { exact: true }).inputValue(),
    'paint-correction',
  );
  assert.equal(
    await page.getByLabel('Preferred service mode').inputValue(),
    'shop',
  );
  const missing = await page.goto(`${base}/services/unknown-service`, {
    waitUntil: 'networkidle',
  });
  assert.equal(missing.status(), 404);
  assert.equal(await page.locator('link[rel="canonical"]').count(), 0);
  assert.ok(
    (
      await page.locator('meta[name="robots"]').getAttribute('content')
    ).includes('noindex'),
  );
  await page.goto(`${base}/services`, { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'FAQ', exact: true }).first().click();
  await page.waitForURL('**/faq');
  await page.waitForFunction(() => document.title.includes('FAQs'));
  assert.equal(
    await page.locator('link[rel="canonical"]').getAttribute('href'),
    `${report.origin}/faq`,
  );
  await page.close();

  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noScript.newPage();
  for (const route of [
    '/',
    '/services/windshield-replacement',
    '/faq',
    '/contact',
  ]) {
    const response = await staticPage.goto(`${base}${route}`, {
      waitUntil: 'load',
    });
    assert.equal(response.status(), 200);
    assert.ok(await staticPage.locator('h1').isVisible());
    assert.ok((await staticPage.locator('main').innerText()).length > 350);
    assert.equal(await staticPage.locator('.route-loading').count(), 0);
  }
  await noScript.close();

  for (const width of [1440, 390, 320]) {
    const motionPage = await browser.newPage({
      viewport: { width, height: 1000 },
      reducedMotion: 'no-preference',
    });
    captureErrors(motionPage);
    await motionPage.goto(`${base}/`, { waitUntil: 'networkidle' });
    await motionPage.evaluate(() => document.fonts.ready);
    await motionPage.waitForTimeout(1100);
    assert.equal(
      await motionPage.locator('.crystal-headline').getAttribute('aria-label'),
      'Windshield Repair, At Your Door.',
    );
    assert.equal(
      await motionPage.locator('.crystal-headline').getAttribute('data-motion'),
      'active',
    );
    assert.equal(await motionPage.locator('.crystal-headline').count(), 1);
    assert.equal(
      await motionPage.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `Overflow at ${width}`,
    );
    if (width !== 320)
      await motionPage.screenshot({
        path: `.impeccable/review/seo-motion-${width}.png`,
      });
    await motionPage.locator('.service-grid').scrollIntoViewIfNeeded();
    await motionPage.waitForTimeout(800);
    assert.equal(
      await motionPage.locator('.crystal-headline').getAttribute('data-motion'),
      'paused',
    );
    const paused = await motionPage
      .locator('.crystal-headline__line')
      .first()
      .evaluate(
        (element) => getComputedStyle(element, '::after').animationPlayState,
      );
    assert.equal(paused, 'paused');
    assert.equal(
      await motionPage.locator('.site-header').getAttribute('data-scrolled'),
      'true',
    );
    await motionPage.emulateMedia({ reducedMotion: 'reduce' });
    await motionPage.waitForFunction(
      () => document.querySelectorAll('[data-arrival]').length === 0,
    );
    assert.equal(await motionPage.locator('[data-arrival]').count(), 0);
    const staticEffect = await motionPage
      .locator('.crystal-headline__line')
      .first()
      .evaluate(
        (element) => getComputedStyle(element, '::after').animationName,
      );
    assert.equal(staticEffect, 'none');
    await motionPage.close();
  }
  assert.deepEqual(errors, []);
  console.log(
    'SEO browser checks passed: 17 hydrated routes, query-prefilled forms, navigation metadata, 404/noindex, JavaScript-disabled content, crystal motion/pause/reduced-motion, and responsive widths 320/390/1440; no hydration errors.',
  );
} finally {
  await browser.close();
}

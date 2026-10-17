import { chromium } from '@playwright/test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const out = '.impeccable/review';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const desktop = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: 'reduce',
});
async function settlePhotos(page) {
  await page.evaluate(async () => {
    const images = [...document.querySelectorAll('img')];
    images.forEach((image) => (image.loading = 'eager'));
    await Promise.all(images.map((image) => image.decode().catch(() => {})));
    window.scrollTo(0, 0);
  });
}
const problems = [];
desktop.on('pageerror', (e) => problems.push(e.message));
await desktop.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await desktop.evaluate(() => document.fonts.ready);
assert.equal(await desktop.locator('h1').count(), 1);
assert.ok((await desktop.locator('h1').innerText()).includes('At Your Door.'));
await settlePhotos(desktop);
await desktop.screenshot({ path: `${out}/desktop.png`, fullPage: true });
const firstTitle = await desktop.locator('.slide-caption p').innerText();
await desktop
  .getByRole('button', { name: 'Next photograph', exact: true })
  .click();
assert.notEqual(
  await desktop.locator('.slide-caption p').innerText(),
  firstTitle,
);
const firstPair = await desktop.locator('.transformation-top h3').innerText();
await desktop
  .getByRole('button', { name: 'Next transformation', exact: true })
  .click();
assert.notEqual(
  await desktop.locator('.transformation-top h3').innerText(),
  firstPair,
);
const paths = [
  '/services',
  ...[
    'auto-glass-repair',
    'windshield-replacement',
    'adas-calibration',
    'window-tinting',
    'mobile-detailing',
    'side-rear-glass',
  ].map((s) => `/services/${s}`),
  '/service-areas',
  '/gallery',
  '/faq',
  '/contact',
  '/about',
  '/book-service',
  '/privacy-policy',
  '/terms-of-use',
  '/missing-page',
  '/services/unknown',
];
for (const route of paths) {
  await desktop.goto(`http://localhost:5173${route}`, {
    waitUntil: 'networkidle',
  });
  assert.equal(await desktop.locator('h1').count(), 1, route);
  const metrics = await desktop.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  assert.ok(
    metrics.scroll <= metrics.width,
    `Overflow ${route}: ${JSON.stringify(metrics)}`,
  );
  assert.ok((await desktop.title()).includes('Total Mobile Install'), route);
  const broken = await desktop
    .locator('img')
    .evaluateAll((imgs) =>
      imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
    );
  assert.equal(broken.length, 0, `Broken images ${route}`);
}
await desktop.goto('http://localhost:5173/contact', {
  waitUntil: 'networkidle',
});
await settlePhotos(desktop);
await desktop.screenshot({
  path: `${out}/contact-desktop.png`,
  fullPage: true,
});
await desktop.goto(
  'http://localhost:5173/book-service?service=mobile-detailing',
  { waitUntil: 'networkidle' },
);
await desktop
  .getByLabel('Detailing service', { exact: true })
  .selectOption('ceramic-coating');
assert.equal(
  await desktop.getByLabel('Preferred service mode').inputValue(),
  'shop',
);
assert.equal(
  await desktop
    .getByLabel('Preferred service mode')
    .locator('option[value="mobile"]')
    .count(),
  0,
);
assert.ok(
  await desktop
    .getByRole('button', { name: 'Online requests unavailable' })
    .isDisabled(),
);
await desktop
  .getByLabel('Service needed')
  .selectOption('windshield-replacement');
await desktop.getByLabel('Preferred service mode').selectOption('mobile');
assert.ok(await desktop.getByLabel('Service address or ZIP code').isVisible());
await desktop.goto('http://localhost:5173/faq', { waitUntil: 'networkidle' });
const faq = desktop.locator('summary').first();
await faq.focus();
await desktop.keyboard.press('Enter');
assert.ok(
  (await desktop.locator('details').first().getAttribute('open')) !== null,
);
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
mobile.on('pageerror', (e) => problems.push(e.message));
await mobile.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await settlePhotos(mobile);
await mobile.screenshot({ path: `${out}/mobile.png`, fullPage: true });
await mobile
  .getByRole('button', { name: 'Open navigation', exact: true })
  .click();
assert.ok(
  await mobile.getByRole('navigation', { name: 'Main navigation' }).isVisible(),
);
await mobile.keyboard.press('Escape');
assert.equal(
  await mobile
    .getByRole('button', { name: 'Open navigation', exact: true })
    .getAttribute('aria-expanded'),
  'false',
);
await mobile.getByRole('button', { name: 'After', exact: true }).click();
assert.ok(await mobile.locator('.after-photo').isVisible());
assert.ok(!(await mobile.locator('.before-photo').isVisible()));
for (const width of [320, 390, 768, 1024, 1280]) {
  await mobile.setViewportSize({ width, height: 844 });
  await mobile.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  const metrics = await mobile.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  assert.ok(
    metrics.scroll <= metrics.width,
    `Home overflow at ${width}: ${JSON.stringify(metrics)}`,
  );
}
await mobile.setViewportSize({ width: 390, height: 844 });
await mobile.goto('http://localhost:5173/book-service', {
  waitUntil: 'networkidle',
});
await settlePhotos(mobile);
await mobile.screenshot({ path: `${out}/booking-mobile.png`, fullPage: true });
assert.equal(problems.length, 0, problems.join('\n'));
fs.writeFileSync(
  `${out}/functional-results.json`,
  JSON.stringify(
    {
      routes: paths.length + 1,
      widths: [320, 390, 768, 1024, 1280, 1440],
      consoleErrors: problems,
      checked: [
        'Unique H1 and SEO',
        'Local photos load',
        'Slideshow and transformation controls',
        'Mobile navigation and Escape',
        'Detailing restrictions',
        'Mobile location field',
        'Unconfigured form never submits',
        'Keyboard FAQ',
        'No horizontal overflow',
      ],
    },
    null,
    2,
  ),
);
await desktop.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await desktop.screenshot({ path: `${out}/desktop-first-viewport.png` });
await mobile.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await mobile.screenshot({ path: `${out}/mobile-first-viewport.png` });
console.log('Browser checks passed. Desktop and mobile screenshots saved.');
await browser.close();

import { chromium } from '@playwright/test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const out = '.impeccable/review';
const baseUrl = (
  process.env.TMI_BROWSER_BASE_URL || 'http://localhost:5173'
).replace(/\/$/, '');
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
await desktop.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
await desktop.evaluate(() => document.fonts.ready);
assert.equal(await desktop.locator('h1').count(), 1);
assert.ok((await desktop.locator('h1').innerText()).includes('At Your Door.'));
await settlePhotos(desktop);
await desktop.screenshot({ path: `${out}/desktop.png`, fullPage: true });
assert.equal(await desktop.locator('.photo-hero button').count(), 0);
assert.equal(await desktop.locator('.hero-slide-progress span').count(), 5);
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
  '/our-work',
  '/home-service',
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
  await desktop.goto(`${baseUrl}${route}`, {
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
assert.equal(new URL(desktop.url()).pathname, '/services/unknown');
await desktop.goto(`${baseUrl}/services`, { waitUntil: 'networkidle' });
await settlePhotos(desktop);
assert.equal(await desktop.locator('.service-card').count(), 4);
for (const specialty of [
  'Auto Glass',
  'Advanced Driver-Assistance Calibration',
  'Premium Ceramic Window Tinting',
  'Showroom-Finish Mobile Detailing',
]) {
  assert.ok(
    (await desktop.locator('.service-card').allTextContents()).some((text) =>
      text.includes(specialty),
    ),
    specialty,
  );
}
await desktop.screenshot({
  path: `${out}/services-desktop.png`,
  fullPage: true,
});
await desktop.goto(`${baseUrl}/services/auto-glass-repair`, {
  waitUntil: 'networkidle',
});
const autoGlassCopy = await desktop.locator('main').innerText();
assert.ok(autoGlassCopy.includes('under 30 minutes'));
assert.ok(autoGlassCopy.includes('lifetime leak warranty'));
assert.ok(autoGlassCopy.includes('Insurance claims handled for you'));
await desktop.goto(`${baseUrl}/services/adas-calibration`, {
  waitUntil: 'networkidle',
});
assert.ok(
  (await desktop.locator('h2').first().innerText()).includes(
    'Advanced Driver-Assistance Calibration',
  ),
);
const adasCopy = await desktop.locator('main').innerText();
assert.ok(adasCopy.includes('Pre- and post-scan reports included'));
assert.ok(adasCopy.includes('Domestic, European, and Asian makes'));
await desktop.goto(`${baseUrl}/services/window-tinting`, {
  waitUntil: 'networkidle',
});
const tintCopy = await desktop.locator('main').innerText();
assert.ok(tintCopy.includes('Up to 99% UV rejection'));
assert.ok(tintCopy.includes('Lifetime film warranty'));
await desktop.goto(`${baseUrl}/services/mobile-detailing`, {
  waitUntil: 'networkidle',
});
const detailingCopy = await desktop.locator('main').innerText();
assert.ok(detailingCopy.includes('5800 Morrison Rd'));
assert.ok(detailingCopy.includes('shop-only'));
await desktop.goto(`${baseUrl}/service-areas`, { waitUntil: 'networkidle' });
const coverageCopy = await desktop.locator('main').innerText();
assert.ok(coverageCopy.includes('40-mile service radius'));
assert.ok(coverageCopy.includes('North Shore'));
await desktop.goto(`${baseUrl}/home-service`, {
  waitUntil: 'networkidle',
});
assert.equal(new URL(desktop.url()).pathname, '/our-work');
assert.equal(await desktop.locator('.project-card').count(), 9);
await desktop
  .getByRole('button', { name: 'Show project on map' })
  .nth(0)
  .click();
await desktop.locator('.project-map-popup > strong').waitFor();
assert.equal(
  await desktop.locator('.project-map-popup > strong').innerText(),
  'Bentley windshield',
);
assert.equal(await desktop.locator('.project-map-popup__proof img').count(), 2);
assert.ok(
  (await desktop.locator('.projects-map__privacy').innerText()).includes(
    'not an individual client location',
  ),
);
await settlePhotos(desktop);
await desktop.screenshot({
  path: `${out}/projects-desktop.png`,
  fullPage: true,
});
await desktop.goto(`${baseUrl}/contact`, {
  waitUntil: 'networkidle',
});
await settlePhotos(desktop);
await desktop.screenshot({
  path: `${out}/contact-desktop.png`,
  fullPage: true,
});
await desktop.goto(`${baseUrl}/book-service?service=mobile-detailing`, {
  waitUntil: 'networkidle',
});
assert.equal(
  await desktop
    .locator('.form-grid > .form-field')
    .first()
    .locator('label')
    .innerText(),
  'Service needed *',
);
assert.equal(
  await desktop.getByLabel('Vehicle year, make, and model').count(),
  1,
);
assert.ok(
  await desktop
    .getByText('Online form delivery is not connected yet')
    .isVisible(),
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
  await desktop.getByRole('button', { name: 'Open email draft' }).isEnabled(),
);
await desktop
  .getByLabel('Service needed')
  .selectOption('windshield-replacement');
await desktop.getByLabel('Preferred service mode').selectOption('mobile');
assert.ok(await desktop.getByLabel('Service address or ZIP code').isVisible());
await desktop.goto(
  `${baseUrl}/book-service?service=windshield-replacement&mode=mobile`,
  { waitUntil: 'networkidle' },
);
assert.equal(
  await desktop.getByLabel('Preferred service mode').inputValue(),
  'mobile',
);
assert.ok(await desktop.getByLabel('Service address or ZIP code').isVisible());
await desktop.goto(`${baseUrl}/faq`, { waitUntil: 'networkidle' });
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
await mobile.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
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
  await mobile.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
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
await mobile.goto(`${baseUrl}/book-service`, {
  waitUntil: 'networkidle',
});
await settlePhotos(mobile);
await mobile.screenshot({ path: `${out}/booking-mobile.png`, fullPage: true });
await mobile.goto(`${baseUrl}/services`, { waitUntil: 'networkidle' });
await settlePhotos(mobile);
assert.equal(await mobile.locator('.mobile-actions').isVisible(), false);
assert.equal(
  await mobile
    .locator('.service-grid')
    .evaluate(
      (grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length,
    ),
  1,
);
await mobile.screenshot({ path: `${out}/services-mobile.png`, fullPage: true });
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
        'Four client-approved specialties and full service details',
        'Client-approved New Orleans service radius',
        'Mobile location field',
        'Unconfigured form offers a validated email draft fallback',
        'Keyboard FAQ',
        'No horizontal overflow',
      ],
    },
    null,
    2,
  ),
);
await desktop.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
await desktop.screenshot({ path: `${out}/desktop-first-viewport.png` });
await mobile.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
await mobile.screenshot({ path: `${out}/mobile-first-viewport.png` });
console.log('Browser checks passed. Desktop and mobile screenshots saved.');
await browser.close();

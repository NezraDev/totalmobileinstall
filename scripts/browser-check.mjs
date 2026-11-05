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
assert.ok(
  (await desktop.locator('h1').innerText()).includes(
    'New Orleans Auto Glass Repair,',
  ),
);
assert.equal(
  await desktop.locator('select[name="serviceMode"]').count(),
  0,
);
await settlePhotos(desktop);
assert.ok(
  (
    await desktop.locator('.section-soft .section-heading h2').innerText()
  ).includes('Automobile glass repair'),
);
assert.equal(await desktop.locator('.section-soft .service-card').count(), 6);
await desktop.screenshot({ path: `${out}/desktop.png`, fullPage: true });
assert.equal(await desktop.locator('.photo-hero button').count(), 0);
assert.equal(await desktop.locator('.hero-slide-progress span').count(), 5);
await desktop.getByRole('button', { name: 'Open TMI Quick Answers' }).click();
const desktopChat = desktop.getByRole('dialog');
await desktopChat
  .getByRole('textbox', { name: 'Ask a question' })
  .fill('How do you repair windshield cracks?');
await desktopChat.getByRole('button', { name: 'Send question' }).click();
const desktopChatAnswer = desktop
  .locator('.tmi-chat-message.is-assistant')
  .last();
await desktopChatAnswer.waitFor();
assert.ok(
  (await desktopChatAnswer.innerText()).includes(
    'tells you if a repair will work',
  ),
);
assert.ok(
  await desktopChatAnswer.evaluate((answer) => {
    const log = answer.closest('.tmi-chat-log');
    return (
      Math.abs(
        answer.getBoundingClientRect().top - log.getBoundingClientRect().top,
      ) < 28
    );
  }),
  'Long chatbot answers should start in view instead of opening at their clipped end.',
);
await desktop.getByRole('button', { name: 'Close chat' }).click();
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
    'windshield-repair',
    'windshield-replacement',
    'adas-calibration',
    'window-tinting',
    'mobile-detailing',
    'car-window-replacement',
  ].map((s) => `/services/${s}`),
  '/service-areas',
  '/auto-glass-repair/metairie',
  '/auto-glass-repair/kenner',
  '/auto-glass-repair/west-bank',
  '/guides',
  '/guides/windshield-chip-repair-or-replacement',
  '/guides/cracked-windshield-what-to-do',
  '/guides/adas-calibration-after-windshield-replacement',
  '/guides/broken-car-window-what-to-do',
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
  assert.equal(
    await desktop.getByRole('link', { name: 'Get directions' }).count(),
    0,
    route,
  );
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
assert.equal(await desktop.locator('.service-card').count(), 6);
for (const service of [
  'Windshield Repair',
  'Windshield Replacement',
  'ADAS Calibration',
  'Window Tinting',
  'Mobile Detailing',
  'Car Window Replacement',
]) {
  assert.ok(
    (await desktop.locator('.service-card').allTextContents()).some((text) =>
      text.includes(service),
    ),
    service,
  );
}
await desktop.screenshot({
  path: `${out}/services-desktop.png`,
  fullPage: true,
});
for (const [from, to] of [
  ['/services/auto-glass-repair', '/services/windshield-repair'],
  ['/services/side-rear-glass', '/services/car-window-replacement'],
]) {
  await desktop.goto(`${baseUrl}${from}`, { waitUntil: 'networkidle' });
  assert.equal(new URL(desktop.url()).pathname, to, from);
  assert.equal(await desktop.locator('h1').count(), 1, from);
}
assert.ok(
  (await desktop.locator('.service-card .text-link').allTextContents()).some(
    (text) => text.includes('Explore windshield chip repair'),
  ),
);
await desktop.goto(`${baseUrl}/services/windshield-repair`, {
  waitUntil: 'networkidle',
});
assert.equal(
  await desktop.locator('h1').innerText(),
  'Windshield Repair in New Orleans',
);
assert.ok(
  (await desktop.locator('main h2').allTextContents()).includes(
    'Windshield Chip Repair',
  ),
);
const autoGlassCopy = await desktop.locator('main').innerText();
assert.ok(
  autoGlassCopy.includes('Repair options for eligible chips and cracks'),
);
assert.ok(autoGlassCopy.includes('Damage assessment before repair'));
assert.ok(autoGlassCopy.includes('Help with insurance claims'));
await desktop.goto(`${baseUrl}/services/windshield-replacement`, {
  waitUntil: 'networkidle',
});
const replacementCopy = await desktop.locator('main').innerText();
assert.ok(replacementCopy.includes('written warranty terms'));
assert.ok(replacementCopy.includes('The right windshield for your vehicle'));
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
assert.ok(
  tintCopy.includes('Film options for heat rejection and UV protection'),
);
assert.ok(tintCopy.includes('written warranty terms'));
assert.ok(tintCopy.includes('Not available as of now'));
assert.equal(
  await desktop.getByRole('link', { name: 'Request this service' }).count(),
  0,
);
await desktop.goto(`${baseUrl}/services/mobile-detailing`, {
  waitUntil: 'networkidle',
});
const detailingCopy = await desktop.locator('main').innerText();
assert.ok(detailingCopy.includes('Ceramic coating packages'));
assert.ok(!/\bshop\b/i.test(detailingCopy));
assert.ok(!/shop[- ]only/i.test(detailingCopy));
await desktop.goto(`${baseUrl}/service-areas`, { waitUntil: 'networkidle' });
const coverageCopy = await desktop.locator('main').innerText();
assert.ok(coverageCopy.includes('40-mile mobile service radius'));
assert.ok(coverageCopy.includes('North Shore'));
assert.equal(await desktop.locator('.location-map--coverage').count(), 1);
// The full Service Areas list: 7 parishes, 57 places, and 15 neighborhoods.
assert.equal(await desktop.locator('.area-parish').count(), 7);
assert.equal(await desktop.locator('.area-parish .area-list li').count(), 72);
for (const name of [
  'Pearl River',
  'Des Allemands',
  'Pleasure Bend',
  'Tremé',
  'Belle Chasse',
  'Crescent City Connection',
])
  assert.ok(coverageCopy.includes(name), name);
const coverageWords = coverageCopy.match(/[A-Za-z0-9’'.-]+/g).length;
assert.ok(coverageWords >= 600, `Service Areas has ${coverageWords} words`);
assert.equal(
  await desktop.locator('.area-parish__links a[href^="/auto-glass-repair/"]').count(),
  4,
);
assert.ok(
  (await desktop.locator('.map-coverage-legend').innerText()).includes(
    '40-mile mobile service radius',
  ),
);
// Content depth: 650+ words on service pages, 400+ on supporting pages (FAQ answers opened).
for (const [route, minimum] of [
  ['/services/windshield-repair', 650],
  ['/services/windshield-replacement', 650],
  ['/services/car-window-replacement', 650],
  ['/services/adas-calibration', 650],
  ['/services/mobile-detailing', 650],
  ['/services', 400],
  ['/gallery', 400],
  ['/contact', 400],
  ['/about', 400],
]) {
  await desktop.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
  const words = await desktop.locator('main').evaluate((main) => {
    main.querySelectorAll('details').forEach((item) => (item.open = true));
    return (main.innerText.match(/[A-Za-z0-9’'.-]+/g) || []).length;
  });
  assert.ok(words >= minimum, `${route} has ${words} words`);
}
// Guides: 700+ words each, linked to a service page and Book Service.
for (const slug of [
  'windshield-chip-repair-or-replacement',
  'cracked-windshield-what-to-do',
  'adas-calibration-after-windshield-replacement',
  'broken-car-window-what-to-do',
]) {
  await desktop.goto(`${baseUrl}/guides/${slug}`, { waitUntil: 'networkidle' });
  const text = `${await desktop.locator('.page-intro').innerText()} ${await desktop.locator('article').innerText()}`;
  const words = text.match(/[A-Za-z0-9’'.-]+/g).length;
  assert.ok(words >= 700 && words <= 1100, `${slug} has ${words} words`);
  assert.ok(await desktop.locator('article a[href^="/services/"]').count(), slug);
  assert.ok(await desktop.locator('article a[href^="/book-service"]').count(), slug);
}
// Location pages: 650+ words of main content each, and not near-duplicates.
const locationTexts = [];
for (const slug of ['metairie', 'kenner', 'west-bank']) {
  await desktop.goto(`${baseUrl}/auto-glass-repair/${slug}`, { waitUntil: 'networkidle' });
  const text = await desktop.locator('main').innerText();
  const words = text.match(/[A-Za-z0-9’'.-]+/g).length;
  assert.ok(words >= 650, `${slug} has ${words} words`);
  assert.ok(!/2642|Tulane/i.test(text), slug);
  assert.ok(await desktop.locator('a[href="/services/windshield-repair"]').count(), slug);
  locationTexts.push(new Set(text.toLowerCase().match(/[a-z’'-]+/g)));
}
for (let a = 0; a < locationTexts.length; a++)
  for (let b = a + 1; b < locationTexts.length; b++) {
    const shared = [...locationTexts[a]].filter((w) => locationTexts[b].has(w)).length;
    const overlap = shared / Math.min(locationTexts[a].size, locationTexts[b].size);
    assert.ok(overlap < 0.8, `Location pages ${a} and ${b} share ${Math.round(overlap * 100)}% of words`);
  }
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
assert.equal(await desktop.getByLabel('Detailing service').count(), 0);
assert.equal(await desktop.getByLabel('Preferred service mode').count(), 0);
assert.equal(await desktop.locator('input[name="requestType"]').count(), 3);
assert.ok(await desktop.getByLabel('Service address or ZIP code').isVisible());
await desktop.goto(`${baseUrl}/book-service?service=window-tinting&mode=shop`, {
  waitUntil: 'networkidle',
});
assert.equal(await desktop.getByLabel('Service needed').inputValue(), '');
assert.ok(
  (
    await desktop
      .getByLabel('Service needed')
      .locator('option[value="window-tinting"]')
      .innerText()
  ).includes('Not available as of now'),
);
assert.equal(await desktop.getByLabel('Preferred service mode').count(), 0);
await desktop.goto(`${baseUrl}/faq`, { waitUntil: 'networkidle' });
assert.equal(await desktop.locator('.faq-list details').count(), 12);
const faqQuestions = await desktop
  .locator('.faq-list summary')
  .allTextContents();
const faqAnswers = await desktop
  .locator('.faq-list details > div')
  .allTextContents();
for (const detail of [
  'no additional charge',
  'confirm the next available time',
  '45 to 90 minutes',
  'pre- and post-scan reports',
  '25% visible-light transmission',
  '12% on the rearmost window',
  'written terms that apply',
  'within 40 miles',
  'range of makes and models',
]) {
  assert.ok(
    faqAnswers.some((text) => text.includes(detail)),
    detail,
  );
}
for (const question of [
  'Will my insurance cover windshield replacement?',
  'How fast can a mobile technician arrive?',
  'How long does a windshield replacement take?',
  'Do you perform ADAS calibration after replacement?',
  'What window tint percentages are legal in Louisiana?',
  'Do you offer a warranty?',
  'Can you service vehicles at my office?',
  'Do you only work on luxury vehicles?',
]) {
  assert.ok(
    faqQuestions.some((text) => text.includes(question)),
    question,
  );
}
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
await mobile.getByRole('button', { name: 'Open TMI Quick Answers' }).click();
const mobileChat = mobile.getByRole('dialog');
await mobileChat
  .getByRole('textbox', { name: 'Ask a question' })
  .fill('How do you repair windshield cracks?');
await mobileChat.getByRole('button', { name: 'Send question' }).click();
const mobileChatAnswer = mobile
  .locator('.tmi-chat-message.is-assistant')
  .last();
await mobileChatAnswer.waitFor();
assert.ok(
  (await mobileChatAnswer.innerText()).includes(
    'tells you if a repair will work',
  ),
);
assert.ok(
  await mobileChatAnswer.evaluate((answer) => {
    const log = answer.closest('.tmi-chat-log');
    return (
      Math.abs(
        answer.getBoundingClientRect().top - log.getBoundingClientRect().top,
      ) < 28
    );
  }),
  'Long chatbot answers should start in view on mobile.',
);
await mobile.getByRole('button', { name: 'Close chat' }).click();
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
        'Mobile-only requests without a service mode choice',
        'Six listed services across four specialties and full service details',
        'Client-approved New Orleans service radius',
        'Mobile location field',
        'Unconfigured form disables sending and offers direct contact links',
        'Eight client-supplied FAQ topics with keyboard interaction',
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

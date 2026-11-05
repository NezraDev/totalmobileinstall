import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createPreviewServer } from './preview.mjs';

const report = JSON.parse(
  await fs.readFile('.ssr-build/seo-routes.json', 'utf8'),
);
const variants = JSON.parse(
  await fs.readFile('src/content/image-variants.json', 'utf8'),
);
const routePaths = new Set(report.routes.map((route) => route.path));
const titles = new Set();
const descriptions = new Set();
const exists = async (file) => {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
};
let links = 0;
let images = 0;
for (const route of [...report.routes, { ...report.notFound, path: '/404' }]) {
  const file =
    route.path === '/' ? 'dist/index.html' : `dist${route.path}.html`;
  const html = await fs.readFile(file, 'utf8');
  // The business requested restoring its existing homepage badge images only.
  // Continue checking all other page content for unconfirmed claims.
  const claimHtml = html.replace(
    /<ul class="home-trust-badges"[\s\S]*?<\/ul>/g,
    '',
  );
  const visibleClaimsToConfirm = [
    '10k+',
    'certified, family-owned care',
    'certified technicians',
    'dealership-grade work',
    'dealership-grade care',
    '100% customer satisfaction guaranteed',
    'premium quality guaranteed',
    'awarded best service provider',
    'lifetime leak warranty',
    'lifetime film warranty',
    'up to 99% uv rejection',
    'under 30 minutes',
    'showroom-quality results',
  ];
  for (const claim of visibleClaimsToConfirm)
    assert.ok(
      !claimHtml.toLowerCase().includes(claim),
      `Unconfirmed claim is not visible: ${claim} (${route.path})`,
    );
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `One H1: ${route.path}`);
  assert.equal(
    (html.match(/<title\b/g) || []).length,
    1,
    `One title: ${route.path}`,
  );
  assert.equal((html.match(/name="description"/g) || []).length, 1);
  assert.ok(
    !html.includes('<!--app-html-->') &&
      !html.includes('class="route-loading"'),
    `Full HTML required: ${route.path}`,
  );
  assert.ok(html.includes('data-prerendered="true"'));
  assert.ok(route.title && route.description);
  assert.ok(route.title.length <= 62, `Title length ${route.title.length}: ${route.path}`);
  assert.ok(
    route.description.length <= 160,
    `Description length ${route.description.length}: ${route.path}`,
  );
  assert.ok(!titles.has(route.title), `Unique title: ${route.path}`);
  assert.ok(
    !descriptions.has(route.description),
    `Unique description: ${route.path}`,
  );
  titles.add(route.title);
  descriptions.add(route.description);
  assert.ok(
    html.includes('property="og:title"') &&
      html.includes('name="twitter:card"'),
  );
  if (route.canonical) {
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.ok(html.includes(`href="${route.canonical}"`));
    const url = new URL(route.canonical);
    assert.equal(url.origin, report.origin);
    assert.equal(url.search, '');
    assert.equal(url.hash, '');
  } else assert.equal((html.match(/rel="canonical"/g) || []).length, 0);
  if (route.noindex) assert.ok(html.includes('content="noindex, follow"'));
  const schema = html.match(
    /<script[^>]*id="tmi-structured-data"[^>]*>([\s\S]*?)<\/script>/,
  );
  if (route.path !== '/404') {
    assert.ok(schema, `Structured data: ${route.path}`);
    const data = JSON.parse(schema[1]);
    assert.equal(data['@context'], 'https://schema.org');
    const business = data['@graph'].find(
      (item) => item['@type'] === 'AutomotiveBusiness',
    );
    // City only: no street address, and only the rounded public center.
    assert.equal(business.address.streetAddress, undefined, route.path);
    assert.equal(business.address.addressLocality, 'New Orleans');
    assert.equal(business.address.postalCode, '70119');
    assert.deepEqual(
      [business.geo.latitude, business.geo.longitude],
      [29.96, -90.09],
    );
    assert.deepEqual(
      [
        business.areaServed[0].geoMidpoint.latitude,
        business.areaServed[0].geoMidpoint.longitude,
      ],
      [29.96, -90.09],
    );
    assert.ok(business.logo, `Business logo: ${route.path}`);
    assert.equal(business.sameAs.length, 2, `Social profiles: ${route.path}`);
    assert.equal(business.hasOfferCatalog.itemListElement.length, 5);
    assert.equal(business.areaServed[0]['@type'], 'GeoCircle');
    assert.equal(business.areaServed[0].geoRadius, 64374);
    // The 7 parishes and 57 places from the Service Areas list, each named once.
    const areaTypes = business.areaServed.map((area) => area['@type']);
    assert.equal(areaTypes.filter((type) => type === 'AdministrativeArea').length, 7);
    assert.equal(areaTypes.filter((type) => type === 'City').length, 57);
    assert.equal(
      new Set(business.areaServed.slice(1).map((area) => area.name)).size,
      64,
    );
    assert.ok(await exists(path.join('dist', new URL(business.logo).pathname)));
    assert.ok(
      business.areaServed.some((area) => area.name === 'Metairie, LA') &&
        business.areaServed.some((area) => area.name === 'Slidell, LA'),
    );
    if (route.path !== '/' && !route.noindex)
      assert.ok(
        data['@graph'].some((item) => item['@type'] === 'BreadcrumbList'),
        `Breadcrumbs: ${route.path}`,
      );
    assert.ok(
      !schema[1].includes('aggregateRating') &&
        !schema[1].includes('priceRange'),
    );
    assert.equal(
      data['@graph'].filter((item) => item['@type'] === 'Service').length,
      /^\/(services|auto-glass-repair)\//.test(route.path) ? 1 : 0,
    );
    // FAQPage only where the questions are on the page, and every question is shown.
    const faqPage = data['@graph'].find((item) => item['@type'] === 'FAQPage');
    const hasFaq =
      route.path === '/faq' ||
      /^\/(services|auto-glass-repair)\//.test(route.path);
    assert.equal(Boolean(faqPage), hasFaq, `FAQPage: ${route.path}`);
    const pageText = html
      .replace(/&#x27;|&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');
    if (faqPage)
      for (const item of faqPage.mainEntity) {
        assert.ok(item.acceptedAnswer.text, route.path);
        assert.ok(pageText.includes(item.name), `FAQ question not on page: ${item.name}`);
      }
    const articles = data['@graph'].filter((item) => item['@type'] === 'Article');
    assert.equal(articles.length, route.path.startsWith('/guides/') ? 1 : 0, route.path);
    if (articles.length)
      assert.ok(
        articles[0].headline && /^\d{4}-\d{2}-\d{2}$/.test(articles[0].datePublished),
        route.path,
      );
  }
  for (const [, href] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    if (!href.startsWith('/')) continue;
    const target = new URL(href.replace(/&amp;/g, '&'), report.origin).pathname;
    assert.ok(
      routePaths.has(target) || target === '/home-service',
      `Internal link ${route.path} -> ${target}`,
    );
    links += 1;
  }
  for (const [, tag] of html.matchAll(/(<img\b[^>]*>)/g)) {
    assert.ok(/\balt="[^"]*"/.test(tag), `Alt attribute: ${route.path}`);
    assert.ok(
      /\bwidth="\d+"/.test(tag) && /\bheight="\d+"/.test(tag),
      `Image dimensions: ${route.path}`,
    );
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    if (src?.startsWith('/'))
      assert.ok(await exists(path.join('dist', src)), `Image exists: ${src}`);
    images += 1;
  }
}
for (const image of Object.values(variants)) {
  let previous = 0;
  for (const source of image.sources) {
    assert.ok(source.width > previous);
    previous = source.width;
    assert.ok(await exists(path.join('dist', source.src)));
  }
}
const xml = await fs.readFile('dist/sitemap.xml', 'utf8');
const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);
assert.deepEqual(
  locations.sort(),
  report.routes
    .filter((route) => !route.noindex)
    .map((route) => route.canonical)
    .sort(),
);
const robots = await fs.readFile('dist/robots.txt', 'utf8');
assert.ok(
  robots.includes('Allow: /') &&
    robots.includes(`${report.origin}/sitemap.xml`),
);
assert.ok(!/^Disallow:\s*\/$/m.test(robots));
assert.ok(
  !(await fs.readFile('dist/_redirects', 'utf8')).includes(
    '/* /index.html 200',
  ),
);
assert.ok(
  !(await fs.readFile('dist/_redirects', 'utf8')).includes('/*.html'),
  'Netlify does not support wildcards in the middle of a path segment',
);
assert.equal(
  JSON.parse(await fs.readFile('.openai/hosting.json', 'utf8')).static
    .not_found_handling,
  '404-page',
);
// City only: no built file shows the street address or the exact base coordinates.
for (const file of await fs.readdir('dist', { recursive: true })) {
  if (!/\.(html|js|css|xml|txt|json)$/.test(file)) continue;
  const text = await fs.readFile(path.join('dist', file), 'utf8');
  assert.ok(!/tulane/i.test(text), `Street address in ${file}`);
  assert.ok(
    !/29\.96136565|90\.09014810/.test(text),
    `Exact coordinates in ${file}`,
  );
  if (file.endsWith('.html'))
    assert.ok(!/2642/.test(text), `Street number in ${file}`);
}
for (const sensitive of [
  '.env',
  '.git/config',
  '.openai/hosting.json',
  'src/main.jsx',
  '.ssr-build/entry-server.js',
])
  assert.equal(await exists(path.join('dist', sensitive)), false);

// Old domain: every totalmobileglass.com page 301s to the matching new page.
// Netlify applies the first matching rule, so this follows the same order.
{
  const rules = (await fs.readFile('dist/_redirects', 'utf8'))
    .split(/\r?\n/)
    .filter((line) => /^https?:\/\/(www\.)?totalmobileglass\.com\//.test(line))
    .map((line) => line.trim().split(/\s+/));
  const resolve = (url) => {
    for (const [from, to, status] of rules) {
      const hit = from.endsWith('/*') ? url.startsWith(from.slice(0, -1)) : url === from;
      if (hit) return { to, status };
    }
    return null;
  };
  const expected = {
    '/': '/',
    '/services': '/services',
    '/auto-glass': '/',
    '/adas-calibration': '/services/adas-calibration',
    '/window-tint': '/services/window-tinting',
    '/mobile-detailing': '/services/mobile-detailing',
    '/service-areas': '/service-areas',
    '/gallery': '/gallery',
    '/about': '/about',
    '/contact': '/contact',
    '/faq': '/faq',
    '/terms': '/terms-of-use',
    '/privacy': '/privacy-policy',
    '/some-old-page': '/',
  };
  for (const origin of [
    'https://totalmobileglass.com',
    'https://www.totalmobileglass.com',
    'http://totalmobileglass.com',
    'http://www.totalmobileglass.com',
  ])
    for (const [oldPath, newPath] of Object.entries(expected)) {
      const rule = resolve(origin + oldPath);
      assert.ok(rule, `No redirect for ${origin}${oldPath}`);
      assert.equal(rule.status, '301!', origin + oldPath);
      assert.equal(rule.to, `https://totalmobileinstall.com${newPath}`, origin + oldPath);
      assert.ok(routePaths.has(newPath), `Redirect target is not a page: ${newPath}`);
    }
}
const server = await createPreviewServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
try {
  const origin = `http://127.0.0.1:${server.address().port}`;
  for (const route of report.routes)
    assert.equal(
      (await fetch(`${origin}${route.path}`)).status,
      200,
      route.path,
    );
  for (const missing of [
    '/unknown-page',
    '/services/unknown-service',
    '/missing.png',
    '/.env',
    '/.git/config',
  ]) {
    const response = await fetch(`${origin}${missing}`);
    assert.equal(response.status, 404, missing);
    assert.ok(response.headers.get('x-robots-tag').includes('noindex'));
  }
  for (const [from, to] of [
    ['/home-service', '/our-work'],
    ['/services/', '/services'],
    ['/services.html', '/services'],
    ['/contact.html', '/contact'],
    ['/services/window-tinting.html', '/services/window-tinting'],
    ['/index.html', '/'],
    // /auto-glass-repair is not a page; the location pages sit under it.
    ['/auto-glass-repair', '/service-areas'],
    ['/auto-glass-repair/metairie/', '/auto-glass-repair/metairie'],
    ['/auto-glass-repair/west-bank.html', '/auto-glass-repair/west-bank'],
    // Pages renamed in November 2026.
    ...['', '/', '.html', '/index.html'].flatMap((suffix) => [
      [`/services/auto-glass-repair${suffix}`, '/services/windshield-repair'],
      [
        `/services/side-rear-glass${suffix}`,
        '/services/car-window-replacement',
      ],
    ]),
  ]) {
    const response = await fetch(`${origin}${from}`, { redirect: 'manual' });
    assert.equal(response.status, 301, from);
    assert.equal(response.headers.get('location'), to, from);
  }
  assert.equal(
    (await fetch(`${origin}/book-service?service=window-tinting`))
      .status,
    200,
  );
  const legacyQuery = await fetch(
    `${origin}/services/auto-glass-repair?utm_source=gbp`,
    { redirect: 'manual' },
  );
  assert.equal(
    legacyQuery.headers.get('location'),
    '/services/windshield-repair?utm_source=gbp',
    'Redirects keep the query string',
  );
  assert.equal(
    (await fetch(`${origin}/sitemap.xml`)).headers.get('content-type'),
    'application/xml; charset=utf-8',
  );
} finally {
  await new Promise((resolve) => server.close(resolve));
}
console.log(
  `SEO checks passed: ${report.routes.length} prerendered routes + 404, ${locations.length} sitemap URLs, ${links} internal links, ${images} dimensioned images; metadata, schema, assets, 200/301/404 responses verified.`,
);

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
      !html.toLowerCase().includes(claim),
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
    assert.equal(business.address.streetAddress, '2642 Tulane Ave');
    assert.equal(business.address.postalCode, '70119');
    assert.equal(business.geo.latitude, 29.961365651200683);
    assert.ok(
      !schema[1].includes('aggregateRating') &&
        !schema[1].includes('priceRange'),
    );
    assert.equal(
      data['@graph'].filter((item) => item['@type'] === 'Service').length,
      route.path.startsWith('/services/') ? 1 : 0,
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
for (const sensitive of [
  '.env',
  '.git/config',
  '.openai/hosting.json',
  'src/main.jsx',
  '.ssr-build/entry-server.js',
])
  assert.equal(await exists(path.join('dist', sensitive)), false);

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
  ]) {
    const response = await fetch(`${origin}${from}`, { redirect: 'manual' });
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), to);
  }
  assert.equal(
    (await fetch(`${origin}/book-service?service=window-tinting&mode=shop`))
      .status,
    200,
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

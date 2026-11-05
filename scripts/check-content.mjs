import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { photos, slides, beforeAfter, brand } from '../src/content/assets.js';
import { services } from '../src/content/services.js';
import { business } from '../src/content/business.js';
const localImages = [
  ...Object.values(photos),
  ...slides,
  ...beforeAfter.flatMap((p) => [p.before, p.after]),
];
for (const image of localImages) {
  for (const key of ['src', 'srcSmall']) {
    assert.ok(
      image[key].startsWith('/images/'),
      'Images must be local public assets',
    );
    assert.ok(
      fs.existsSync(path.join('public', image[key])),
      `Missing ${image[key]}`,
    );
  }
  assert.ok(image.alt);
  assert.ok(image.width > 0 && image.height > 0);
}
for (const file of Object.values(brand))
  assert.ok(fs.existsSync(path.join('public', file)));
assert.equal(services.length, 6);
assert.ok(beforeAfter.length >= 1);
// Service Areas: the 57 places the owner chose, by parish, plus New Orleans neighborhoods.
const areaPlaces = business.serviceAreas.flatMap((area) => area.places);
const areaNeighborhoods = business.serviceAreas.flatMap(
  (area) => area.neighborhoods || [],
);
assert.equal(business.serviceAreas.length, 7);
assert.equal(areaPlaces.length, 57);
assert.equal(areaNeighborhoods.length, 15);
assert.equal(
  new Set([...areaPlaces, ...areaNeighborhoods]).size,
  72,
  'Service area names are unique',
);
for (const area of business.serviceAreas)
  assert.ok(area.id && / Parish$/.test(area.name) && area.places.length, area.name);
for (const folder of fs.readdirSync('src/pages')) {
  const base = path.join('src/pages', folder);
  assert.ok(fs.existsSync(path.join(base, 'data.js')));
  assert.ok(fs.existsSync(path.join(base, `${folder}.jsx`)));
}
for (const file of fs
  .readdirSync('src/pages', { recursive: true })
  .filter((f) => /\.(js|jsx)$/.test(f))) {
  assert.ok(
    !fs.readFileSync(path.join('src/pages', file), 'utf8').includes('—'),
    `Em dash in ${file}`,
  );
}
assert.ok(
  !fs.readFileSync('.env.example', 'utf8').includes('VITE_RESEND_API_KEY'),
);
console.log(
  `Content checks passed: ${services.length} services, ${beforeAfter.length} matched photo pairs, ${Object.keys(photos).length} photos, 12 page data files, ${areaPlaces.length} service-area places in ${business.serviceAreas.length} parishes.`,
);

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

// This script never contacts a real endpoint. All requests are intercepted below.
const realFetch = globalThis.fetch;
const endpoint = 'https://contact.example.test/request';
const tests = [];
let moduleSequence = 0;
let interceptedRequests = 0;

async function loadIntegration(name, env = {}) {
  const file = new URL(`../src/integrations/${name}.js`, import.meta.url);
  const { outputFiles } = await build({
    entryPoints: [fileURLToPath(file)],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    define: { 'import.meta.env': JSON.stringify({ DEV: false, ...env }) },
  });
  const code = outputFiles[0].text;
  return import(
    `data:text/javascript;base64,${Buffer.from(code).toString('base64')}#check-${++moduleSequence}`
  );
}

const noRequestExpected = async () => {
  throw new Error(
    'Unexpected fetch. Real network requests are prohibited by this check.',
  );
};

function mockFetch(callback) {
  globalThis.fetch = async (...args) => {
    interceptedRequests++;
    return callback(...args);
  };
}

async function check(name, run) {
  globalThis.fetch = noRequestExpected;
  await run();
  tests.push(name);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function pendingUntilAborted(_url, { signal }) {
  return new Promise((_resolve, reject) => {
    const abort = () =>
      reject(signal.reason || new DOMException('Aborted', 'AbortError'));
    if (signal.aborted) abort();
    else signal.addEventListener('abort', abort, { once: true });
  });
}

const valid = {
  fullName: 'Test Customer',
  phone: '5045550100',
  email: 'customer@example.test',
  serviceId: 'windshield-replacement',
  detailType: '',
  vehicle: '2020 Test Vehicle',
  serviceMode: 'mobile',
  location: '70126',
  preferredDate: '',
  message: 'A test request that will never be sent.',
  website: '',
};

try {
  await check(
    'Unconfigured or insecure production endpoints cannot submit',
    async () => {
      for (const value of [
        '',
        'not a URL',
        'http://contact.example.test/request',
      ]) {
        const client = await loadIntegration('emailClient', {
          VITE_CONTACT_ENDPOINT: value,
        });
        assert.equal(client.isContactConfigured(), false);
        await assert.rejects(
          client.submitContactRequest(valid),
          (error) => error.code === 'unconfigured',
        );
      }
      const local = await loadIntegration('emailClient', {
        DEV: true,
        VITE_CONTACT_ENDPOINT: 'http://localhost:4444/contact',
      });
      assert.equal(local.isContactConfigured(), true);
    },
  );

  await check(
    'The no-endpoint fallback builds an encoded, reviewable email draft',
    async () => {
      const fallback = await loadIntegration('emailClient');
      const href = fallback.buildContactMailtoHref(
        {
          ...valid,
          fullName: 'Test Customer & Co.',
          serviceId: 'Windshield Repair & Replacement',
          serviceMode: 'Mobile Service',
          message: 'Please call after 3pm. Thanks!',
          website: 'must not be included',
        },
        'quotes@totalmobileglass.com',
      );
      const draft = new URL(href);
      assert.equal(draft.protocol, 'mailto:');
      assert.equal(draft.pathname, 'quotes@totalmobileglass.com');
      assert.match(draft.searchParams.get('subject'), /Service request/);
      const body = draft.searchParams.get('body');
      assert.match(body, /Test Customer & Co\./);
      assert.match(body, /Windshield Repair & Replacement/);
      assert.match(body, /Preferred service mode: Mobile Service/);
      assert.match(body, /Please call after 3pm\. Thanks!/);
      assert.doesNotMatch(body, /must not be included/);
      assert.throws(
        () => fallback.buildContactMailtoHref(valid, 'not-an-email'),
        (error) => error.code === 'configuration',
      );
    },
  );

  const client = await loadIntegration('emailClient', {
    VITE_CONTACT_ENDPOINT: endpoint,
  });

  await check(
    'Validation catches missing fields, invalid email, and mobile location before fetch',
    async () => {
      assert.deepEqual(client.validateContactRequest(valid), {});
      const empty = client.validateContactRequest({});
      for (const field of [
        'fullName',
        'phone',
        'email',
        'serviceId',
        'vehicle',
        'serviceMode',
      ])
        assert.ok(empty[field], field);
      assert.ok(
        client.validateContactRequest({ ...valid, email: 'invalid' }).email,
      );
      assert.ok(
        client.validateContactRequest({ ...valid, location: '' }).location,
      );
      assert.ok(
        client.validateContactRequest({ ...valid, message: 'x'.repeat(3001) })
          .message,
      );
      assert.deepEqual(
        client.validateContactRequest({
          ...valid,
          serviceMode: 'shop',
          location: '',
        }),
        {},
      );
      await assert.rejects(
        client.submitContactRequest({ ...valid, email: '' }),
        (error) =>
          error.code === 'validation' && Boolean(error.fieldErrors.email),
      );
    },
  );

  await check(
    'Mobile-only and shop-only service choices are enforced',
    async () => {
      const detailing = { ...valid, serviceId: 'mobile-detailing' };
      for (const detailType of ['interior', 'hand-wash']) {
        assert.deepEqual(
          client.validateContactRequest({ ...detailing, detailType }),
          {},
        );
        assert.ok(
          client.validateContactRequest({
            ...detailing,
            detailType,
            serviceMode: 'shop',
            location: '',
          }).serviceMode,
        );
      }
      for (const detailType of [
        'paint-correction',
        'polishing',
        'ceramic-coating',
      ]) {
        assert.ok(
          client.validateContactRequest({ ...detailing, detailType })
            .serviceMode,
        );
        assert.deepEqual(
          client.validateContactRequest({
            ...detailing,
            detailType,
            serviceMode: 'shop',
            location: '',
          }),
          {},
        );
        await assert.rejects(
          client.submitContactRequest({ ...detailing, detailType }),
          (error) =>
            error.code === 'validation' &&
            Boolean(error.fieldErrors.serviceMode),
        );
      }
      assert.ok(
        client.validateContactRequest({
          ...valid,
          serviceId: 'window-tinting',
          serviceMode: 'mobile',
        }).serviceMode,
      );
      assert.deepEqual(
        client.validateContactRequest({
          ...valid,
          serviceId: 'window-tinting',
          serviceMode: 'shop',
          location: '',
        }),
        {},
      );
      for (const detailType of ['', 'unknown']) {
        assert.ok(
          client.validateContactRequest({ ...detailing, detailType })
            .detailType,
        );
      }
      mockFetch(async (_url, options) => {
        const body = JSON.parse(options.body);
        assert.equal(body.detailType, 'interior');
        assert.equal(body.message, valid.message);
        return json({ accepted: true }, 202);
      });
      await client.submitContactRequest({
        ...detailing,
        detailType: 'interior',
      });
    },
  );

  await check(
    'Only endpoint acceptance resolves; the JSON contract omits arbitrary routing and secrets',
    async () => {
      mockFetch(async (url, options) => {
        assert.equal(url, endpoint);
        assert.equal(options.method, 'POST');
        assert.equal(options.headers['Content-Type'], 'application/json');
        assert.equal(options.headers.Authorization, undefined);
        assert.equal(options.credentials, 'omit');
        assert.equal(options.cache, 'no-store');
        assert.ok(options.signal instanceof AbortSignal);
        const body = JSON.parse(options.body);
        assert.equal(body.schemaVersion, 1);
        assert.equal(body.fullName, valid.fullName);
        assert.equal(body.to, undefined);
        assert.equal(body.from, undefined);
        assert.equal(body.unknownField, undefined);
        return json(
          {
            accepted: true,
            requestId: 'test-reference',
            message: 'Untrusted custom success copy',
          },
          202,
        );
      });
      const result = await client.submitContactRequest({
        ...valid,
        fullName: ` ${valid.fullName} `,
        to: 'ignored@example.test',
        unknownField: 'ignored',
      });
      assert.equal(result.accepted, true);
      assert.equal(result.requestId, 'test-reference');
      assert.match(result.message, /appointment is not confirmed/i);
      assert.doesNotMatch(result.message, /Untrusted/);
    },
  );

  await check('Malformed 2xx responses never imply success', async () => {
    for (const body of [
      { ok: true },
      { accepted: 'true' },
      { accepted: false },
      null,
    ]) {
      mockFetch(async () => json(body));
      await assert.rejects(
        client.submitContactRequest(valid),
        (error) => error.code === 'request_failed',
      );
    }
    mockFetch(
      async () => new Response('<html>Not JSON</html>', { status: 200 }),
    );
    await assert.rejects(
      client.submitContactRequest(valid),
      (error) => error.code === 'request_failed',
    );
    mockFetch(async () => new Response(null, { status: 204 }));
    await assert.rejects(
      client.submitContactRequest(valid),
      (error) => error.code === 'request_failed',
    );
  });

  await check(
    'Endpoint errors preserve typed failure and only known validation fields',
    async () => {
      mockFetch(async () =>
        json(
          {
            accepted: false,
            fieldErrors: {
              email: 'Check your email.',
              unknown: 'Ignored',
              phone: 'x'.repeat(201),
            },
          },
          422,
        ),
      );
      await assert.rejects(client.submitContactRequest(valid), (error) => {
        assert.equal(error.code, 'request_failed');
        assert.deepEqual(error.fieldErrors, { email: 'Check your email.' });
        return true;
      });
      mockFetch(async () => json({ accepted: true }, 500));
      await assert.rejects(
        client.submitContactRequest(valid),
        (error) => error.code === 'request_failed',
      );
      mockFetch(async () => json({ accepted: false }, 429));
      await assert.rejects(
        client.submitContactRequest(valid),
        (error) => error.code === 'rate_limited',
      );
    },
  );

  await check(
    'Network failures reject without claiming acceptance',
    async () => {
      mockFetch(async () => {
        throw new TypeError('Simulated network failure');
      });
      await assert.rejects(
        client.submitContactRequest(valid),
        (error) => error.code === 'network',
      );
    },
  );

  await check('Caller aborts propagate to the request signal', async () => {
    mockFetch(pendingUntilAborted);
    const controller = new AbortController();
    const request = client.submitContactRequest(valid, {
      signal: controller.signal,
    });
    controller.abort();
    await assert.rejects(request, (error) => error.name === 'AbortError');
    const alreadyAborted = new AbortController();
    alreadyAborted.abort();
    await assert.rejects(
      client.submitContactRequest(valid, { signal: alreadyAborted.signal }),
      (error) => error.name === 'AbortError',
    );
  });

  await check(
    'Timeout rejects with uncertain-delivery wording and no automatic retry',
    async () => {
      const realSetTimeout = globalThis.setTimeout;
      const realClearTimeout = globalThis.clearTimeout;
      let calls = 0;
      try {
        globalThis.setTimeout = (callback, delay) => {
          assert.equal(delay, 15000);
          queueMicrotask(callback);
          return 'test-timeout';
        };
        globalThis.clearTimeout = (id) => assert.equal(id, 'test-timeout');
        mockFetch((...args) => {
          calls++;
          return pendingUntilAborted(...args);
        });
        await assert.rejects(
          client.submitContactRequest(valid),
          (error) =>
            error.code === 'timeout' &&
            /before sending again/i.test(error.message),
        );
        assert.equal(calls, 1);
      } finally {
        globalThis.setTimeout = realSetTimeout;
        globalThis.clearTimeout = realClearTimeout;
      }
    },
  );

  await check(
    'The verified shop pin and no-key map work without environment configuration',
    async () => {
      const map = await loadIntegration('mapConfig');
      const expected = [-90.02540735889556, 30.025471630757778];
      assert.equal(map.mapConfig.configured, true);
      assert.equal(map.mapConfig.cartoConfigured, false);
      assert.deepEqual(map.mapConfig.coordinates, expected);
      const embed = new URL(map.mapConfig.embedUrl);
      assert.equal(embed.origin, 'https://www.openstreetmap.org');
      assert.equal(embed.pathname, '/export/embed.html');
      assert.equal(embed.searchParams.get('layer'), 'mapnik');
      assert.equal(
        embed.searchParams.get('marker'),
        `${expected[1]},${expected[0]}`,
      );
      const [west, south, east, north] = embed.searchParams
        .get('bbox')
        .split(',')
        .map(Number);
      assert.ok(west < expected[0] && expected[0] < east);
      assert.ok(south < expected[1] && expected[1] < north);
      const directions = new URL(map.directionsUrl);
      assert.equal(
        directions.searchParams.get('destination'),
        `${expected[1]},${expected[0]}`,
      );
      assert.equal(directions.searchParams.get('api'), '1');
      assert.equal(embed.searchParams.has('key'), false);
    },
  );

  await check(
    'The service coverage circle is exactly 40 miles around the shop',
    async () => {
      const map = await loadIntegration('mapConfig');
      const feature = map.createServiceRadiusFeature(map.mapConfig.coordinates);
      const ring = feature.geometry.coordinates[0];
      assert.equal(feature.properties.radiusMiles, 40);
      assert.equal(ring.length, 97);
      assert.deepEqual(ring[0], ring.at(-1));
      const [longitude, latitude] = map.mapConfig.coordinates;
      const [edgeLongitude, edgeLatitude] = ring[0];
      const radians = Math.PI / 180;
      const latitudeDelta = (edgeLatitude - latitude) * radians;
      const longitudeDelta = (edgeLongitude - longitude) * radians;
      const haversine =
        Math.sin(latitudeDelta / 2) ** 2 +
        Math.cos(latitude * radians) *
          Math.cos(edgeLatitude * radians) *
          Math.sin(longitudeDelta / 2) ** 2;
      const distance = 2 * 6371008.8 * Math.asin(Math.sqrt(haversine));
      assert.ok(Math.abs(distance - map.serviceRadiusMeters) < 0.1);
      const bounds = map.serviceRadiusBounds(feature);
      assert.ok(bounds[0][0] < longitude && bounds[1][0] > longitude);
      assert.ok(bounds[0][1] < latitude && bounds[1][1] > latitude);
    },
  );

  await check(
    'Incomplete or invalid map overrides preserve the verified shop pin',
    async () => {
      for (const env of [
        { VITE_MAP_LONGITUDE: '', VITE_MAP_LATITUDE: '' },
        {
          VITE_CARTO_API_KEY: 'test-key',
          VITE_MAP_LONGITUDE: '',
          VITE_MAP_LATITUDE: '30',
        },
        {
          VITE_CARTO_API_KEY: 'test-key',
          VITE_MAP_LONGITUDE: '-190',
          VITE_MAP_LATITUDE: '30',
        },
        {
          VITE_CARTO_API_KEY: 'test-key',
          VITE_MAP_LONGITUDE: '-90',
          VITE_MAP_LATITUDE: 'invalid',
        },
      ]) {
        const map = await loadIntegration('mapConfig', env);
        assert.equal(map.mapConfig.configured, true);
        assert.deepEqual(
          map.mapConfig.coordinates,
          [-90.02540735889556, 30.025471630757778],
        );
        assert.equal(
          new URL(map.directionsUrl).searchParams.get('destination'),
          '30.025471630757778,-90.02540735889556',
        );
      }
    },
  );

  await check(
    'CARTO key applies to provider resources and is isolated from other hosts',
    async () => {
      const map = await loadIntegration('mapConfig', {
        VITE_CARTO_API_KEY: 'public-test-key',
        VITE_MAP_LONGITUDE: '12',
        VITE_MAP_LATITUDE: '34',
      });
      assert.equal(map.mapConfig.configured, true);
      assert.equal(map.mapConfig.cartoConfigured, true);
      assert.deepEqual(map.mapConfig.coordinates, [12, 34]);
      assert.equal(
        new URL(map.mapConfig.embedUrl).searchParams.get('marker'),
        '34,12',
      );
      assert.equal(
        new URL(map.directionsUrl).searchParams.get('destination'),
        '34,12',
      );
      for (const path of [
        'gl/positron-gl-style/style.json',
        'tiles/1/2/3.pbf',
        'fonts/font/0-255.pbf',
        'sprites/sprite.png',
      ]) {
        const url = new URL(
          map.transformCartoRequest(
            `https://basemaps.cartocdn.com/${path}?existing=1`,
          ).url,
        );
        assert.equal(url.searchParams.get('key'), 'public-test-key');
        assert.equal(url.searchParams.get('existing'), '1');
      }
      for (const url of [
        'https://example.test/tiles.pbf',
        'https://basemaps.cartocdn.com.example.test/style.json',
        '/relative/style.json',
      ]) {
        assert.equal(map.transformCartoRequest(url).url, url);
      }
    },
  );

  console.log(
    `Integration checks passed: ${tests.length} cases, ${interceptedRequests} mocked requests, zero network calls.`,
  );
  for (const name of tests) console.log(`  - ${name}`);
} finally {
  globalThis.fetch = realFetch;
}

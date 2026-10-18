import assert from 'node:assert/strict';
import {
  createContactHandler,
  startContactServer,
} from '../server/contact.mjs';
import {
  config as netlifyConfig,
  createNetlifyContactHandler,
} from '../netlify/functions/contact.mjs';

const origin = 'https://website.test';
const env = {
  ALLOWED_ORIGINS: origin,
  RESEND_API_KEY: 'test-server-key',
  RESEND_FROM: 'Total Mobile Install <amartin@service.totalmobileglass.com>',
};
const valid = {
  schemaVersion: 1,
  fullName: 'Test Customer',
  phone: '5045550100',
  email: 'customer@example.test',
  serviceId: 'windshield-replacement',
  vehicle: '2022 Toyota Camry',
  serviceMode: 'mobile',
  location: '70119',
  website: '',
};
const calls = [];
const handle = createContactHandler({
  env,
  send: async (url, options) => {
    calls.push({ url, options });
    return Response.json({ id: 'mock-provider-id' });
  },
});
const request = (body = valid, headers = {}, method = 'POST') =>
  new Request('https://backend.test/api/contact', {
    method,
    headers: { Origin: origin, 'Content-Type': 'application/json', ...headers },
    ...(method === 'OPTIONS' ? {} : { body: JSON.stringify(body) }),
  });
assert.equal((await handle(request(valid, {}, 'OPTIONS'))).status, 204);
assert.equal(
  (await handle(request(valid, { Origin: 'https://evil.test' }))).status,
  403,
);
const sameOriginHandler = createContactHandler({
  env: { ...env, URL: 'https://default-site.netlify.app', ALLOWED_ORIGINS: '' },
  send: async () => Response.json({ id: 'same-origin-request' }),
});
const sameOriginRequest = (requestOrigin) =>
  new Request('https://custom-domain.test/api/contact', {
    method: 'POST',
    headers: {
      Origin: requestOrigin,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(valid),
  });
assert.equal(
  (await sameOriginHandler(sameOriginRequest('https://custom-domain.test')))
    .status,
  202,
);
assert.equal(
  (await sameOriginHandler(sameOriginRequest('https://evil.test'))).status,
  403,
);
assert.equal((await handle(request({ ...valid, email: 'bad' }))).status, 422);
assert.equal(
  (await handle(request({ ...valid, fullName: { unexpected: true } }))).status,
  400,
);
assert.equal(
  (await handle(request({ ...valid, website: 'spam' }))).status,
  422,
);
assert.equal(
  (await handle(request({ ...valid, preferredDate: '2027-02-30' }))).status,
  422,
);
assert.equal(
  (
    await handle(
      request({
        ...valid,
        serviceId: 'mobile-detailing',
        detailType: 'ceramic-coating',
      }),
    )
  ).status,
  422,
);
assert.equal(
  (await handle(request({ ...valid, message: 'x'.repeat(17000) }))).status,
  413,
);
assert.equal(calls.length, 0);
const response = await handle(
  request({ ...valid, to: 'attacker@test.com', from: 'attacker@test.com' }),
);
assert.equal(response.status, 202);
assert.equal((await response.json()).requestId, 'mock-provider-id');
const payload = JSON.parse(calls[0].options.body);
assert.deepEqual(payload.to, [
  'quotes@totalmobileglass.com',
  'amartin@totalmobileglass.com',
]);
assert.equal(payload.from, env.RESEND_FROM);
assert.equal(payload.reply_to, valid.email);
assert.match(payload.text, /Mobile Service/);
assert.match(
  calls[0].options.headers.Authorization,
  /^Bearer test-server-key$/,
);
assert.equal(netlifyConfig.path, '/api/contact');
let netlifyPayload;
const netlifyHandle = createNetlifyContactHandler({
  env,
  send: async (_url, options) => {
    netlifyPayload = JSON.parse(options.body);
    return Response.json({ id: 'mock-netlify-request' });
  },
});
const netlifyResponse = await netlifyHandle(
  request(),
  { ip: '203.0.113.12' },
);
assert.equal(netlifyResponse.status, 202);
assert.equal((await netlifyResponse.json()).requestId, 'mock-netlify-request');
assert.equal(netlifyPayload.to[1], 'amartin@totalmobileglass.com');
await handle(request(valid));
assert.equal(
  calls[0].options.headers['Idempotency-Key'],
  calls[1].options.headers['Idempotency-Key'],
);
const unavailable = createContactHandler({
  env: { ALLOWED_ORIGINS: origin },
  send: () => {
    throw Error('must not call');
  },
});
assert.equal((await unavailable(request())).status, 503);
for (const send of [
  async () =>
    Response.json({ error: 'private provider error' }, { status: 403 }),
  async () => Response.json({}),
  async () => {
    throw Error('private failure');
  },
]) {
  const fail = await createContactHandler({ env, send })(request());
  assert.equal(fail.status, 502);
  assert.deepEqual(await fail.json(), { accepted: false });
}
for (let i = 0; i < 5; i++) await handle(request());
assert.equal((await handle(request())).status, 429);
const server = startContactServer({ PORT: '0' });
await new Promise((resolve) => server.once('listening', resolve));
try {
  const base = `http://127.0.0.1:${server.address().port}`;
  assert.equal((await fetch(`${base}/health`)).status, 200);
  assert.equal((await fetch(`${base}/missing`)).status, 404);
} finally {
  await new Promise((resolve) => server.close(resolve));
}
console.log(
  'Email server checks passed: validation, origin policy, rate limits, fixed routing, idempotency, provider errors and HTTP health. No real emails sent.',
);

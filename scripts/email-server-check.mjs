import assert from 'node:assert/strict';
import {
  createContactHandler,
  RESEND_FROM,
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
};
const valid = {
  schemaVersion: 1,
  fullName: 'Test Customer',
  phone: '5045550100',
  email: 'customer@example.test',
  serviceId: 'windshield-replacement',
  requestType: 'appointment',
  vehicle: '2022 Toyota Camry',
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
assert.equal(
  RESEND_FROM,
  'Total Mobile Install <amartin@totalmobileinstall.com>',
);
assert.equal(payload.from, RESEND_FROM);
assert.equal(payload.reply_to, valid.email);
assert.match(payload.text, /Location: 70119/);
assert.doesNotMatch(payload.text, /Service mode|Shop/);
assert.doesNotMatch(payload.text, /Detailing:|interior/i);
assert.doesNotMatch(payload.html, /Detailing<|interior/i);
assert.equal(
  payload.subject,
  'Appointment - Windshield Replacement - Test Customer',
);
assert.match(payload.html, /New service request/);
assert.match(payload.html, /images\/brand\/logo\.png/);
assert.match(payload.html, /requires confirmation/);
const hostileResponse = await handle(
  request({
    ...valid,
    email: 'hostile@test.com',
    fullName: '<img src=x onerror=alert(1)>',
    vehicle: '<script>alert(1)</script>',
    message: '<a href="https://evil.test">click</a>',
  }),
);
assert.equal(hostileResponse.status, 202);
const hostileHtml = JSON.parse(calls.at(-1).options.body).html;
assert.ok(
  !/<script|<img src=x|href="https:\/\/evil/.test(hostileHtml),
  'Customer text is escaped in the HTML email',
);
assert.match(hostileHtml, /&lt;script&gt;/);
calls.length = 1;
assert.match(
  calls[0].options.headers.Authorization,
  /^Bearer test-server-key$/,
);
assert.equal(
  (
    await handle(
      request({
        ...valid,
        email: 'tint@example.test',
        serviceId: 'window-tinting',
      }),
    )
  ).status,
  422,
  'Unavailable services are rejected on the server',
);
assert.equal(
  (await handle(request({ ...valid, email: 'type@example.test', requestType: 'other' })))
    .status,
  422,
  'Unknown request types are rejected',
);
const copies = [];
const copyHandler = createContactHandler({
  env,
  send: async () => Response.json({ id: 'copy-team-email' }),
  sendCopy: async (copy) => {
    copies.push(copy);
  },
});
const copyRequest = {
  ...valid,
  email: 'copy@example.test',
  vehicle: '<b>2022 Camry</b>',
  message: 'PRIVATE FREE TEXT',
};
const copyResponse = await copyHandler(request(copyRequest));
assert.equal(copyResponse.status, 202);
assert.equal((await copyResponse.json()).copySent, true);
assert.equal(copies.length, 1);
assert.equal(copies[0].to, 'copy@example.test');
assert.match(copies[0].text, /not a confirmed appointment/);
assert.match(copies[0].html, />Urgent<\/a>/);
assert.match(copies[0].html, />Quotation or Inquiry<\/a>/);
assert.match(copies[0].html, /30 minutes to 1 hour/);
assert.doesNotMatch(copies[0].html, /mailto:/);
const actionLinks = [
  ...copies[0].html.matchAll(/href="([^"]*\/api\/request-action\?t=[^"]*)"/g),
].map((match) => match[1]);
assert.equal(actionLinks.length, 2);
assert.doesNotMatch(actionLinks[0], /Test|Camry|copy%40/);
const actionSends = [];
let actionClock = Date.now();
const actionHandler = createContactHandler({
  env,
  now: () => actionClock,
  send: async (_url, options) => {
    actionSends.push(options);
    return Response.json({ id: 'action-email' });
  },
  sendCopy: async () => {},
});
const actionPage = await actionHandler(new Request(actionLinks[0]));
assert.equal(actionPage.status, 200);
assert.equal(actionSends.length, 0, 'Opening the link alone never sends');
assert.match(actionPage.headers.get('content-security-policy'), /nonce-/);
const actionToken = new URL(actionLinks[0]).searchParams.get('t');
const actionPost = () =>
  actionHandler(
    new Request(actionLinks[0].split('?')[0], {
      method: 'POST',
      body: new URLSearchParams({ t: actionToken }),
    }),
  );
const actionResult = await actionPost();
assert.equal(actionResult.status, 303);
assert.match(actionResult.headers.get('set-cookie'), /Max-Age=300; HttpOnly/);
assert.equal(actionSends.length, 1);
const cooldownPage = await actionHandler(new Request(actionLinks[0]));
const cooldownHtml = await cooldownPage.text();
assert.match(cooldownHtml, /urgent request was sent/);
assert.match(cooldownHtml, /id="timer">5:00</);
await actionPost();
assert.equal(actionSends.length, 1, 'No second send during the cooldown');
actionClock += 299000;
await actionPost();
assert.equal(actionSends.length, 1, 'Still cooling down near five minutes');
actionClock += 2000;
assert.equal((await actionPost()).status, 303);
assert.equal(actionSends.length, 2, 'Sending works again after five minutes');
assert.notEqual(
  actionSends[0].headers['Idempotency-Key'],
  actionSends[1].headers['Idempotency-Key'],
);
const cookieCooldown = await createContactHandler({
  env,
  now: () => actionClock,
  send: async () => {
    throw new Error('A browser in cooldown must not send');
  },
})(
  new Request(actionLinks[0].split('?')[0], {
    method: 'POST',
    headers: {
      cookie: actionResult.headers.get('set-cookie').split(';')[0].replace(/=\d+/, `=${actionClock + 60000}`),
    },
    body: new URLSearchParams({ t: actionToken }),
  }),
);
assert.equal(cookieCooldown.status, 200);
const actionEmail = JSON.parse(actionSends[0].body);
assert.match(actionEmail.subject, /^Urgent \/ Rush - Windshield Replacement - /);
assert.deepEqual(actionEmail.to, payload.to);
assert.equal(actionEmail.reply_to, 'copy@example.test');
assert.match(actionEmail.text, /clicked Urgent/);
assert.equal(
  (await actionHandler(new Request(`${actionLinks[0]}tampered`))).status,
  400,
);
assert.equal(
  (
    await createContactHandler({
      env,
      send: async () => Response.json({ id: 'expired' }),
      now: () => Date.now() + 8 * 24 * 60 * 60 * 1000,
    })(new Request(actionLinks[0]))
  ).status,
  400,
  'Links expire after seven days',
);
assert.doesNotMatch(copies[0].html + copies[0].text, /PRIVATE FREE TEXT/);
assert.doesNotMatch(copies[0].html, /<b>2022/);
assert.equal(
  (await (await copyHandler(request(copyRequest))).json()).copySent,
  false,
  'An identical retry does not send a second copy',
);
assert.equal(copies.length, 1);
const failedCopyResponse = await createContactHandler({
  env,
  send: async () => Response.json({ id: 'copy-team-email' }),
  sendCopy: async () => {
    throw new Error('Gmail rejected the login');
  },
})(request({ ...valid, email: 'failed-copy@example.test' }));
assert.equal(failedCopyResponse.status, 202);
assert.equal((await failedCopyResponse.json()).copySent, false);
const noCopyResponse = await createContactHandler({
  env,
  send: async () => Response.json({ id: 'copy-team-email' }),
})(request({ ...valid, email: 'no-copy@example.test' }));
assert.equal(noCopyResponse.status, 202);
assert.equal((await noCopyResponse.json()).copySent, false);
assert.deepEqual(netlifyConfig.path, ['/api/contact', '/api/request-action']);
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

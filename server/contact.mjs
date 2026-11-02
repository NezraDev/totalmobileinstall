import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import {
  limits,
  normalizedPayload,
  validateContactRequest,
} from '../src/integrations/contactValidation.js';
import { services } from '../src/content/services.js';
import { buildCustomerCopyEmail, buildRequestEmail } from './requestEmail.mjs';
import { createGmailCopySender, withCopyTimeout } from './customerCopy.mjs';
import {
  ACTION_COOLDOWN_MS,
  actionResponse,
  createActionToken,
  readActionToken,
  REQUEST_ACTION_PATH,
  requestActions,
} from './requestActions.mjs';

export const RESEND_FROM =
  'Total Mobile Install <amartin@totalmobileinstall.com>';

// No browser bundle imports this file. Credentials and routing stay server-side.
export function createContactHandler({
  env = process.env,
  send = fetch,
  now = Date.now,
  sendCopy = createGmailCopySender(env),
} = {}) {
  const origins = new Set(
    [env.URL || '', ...(env.ALLOWED_ORIGINS || '').split(',')]
      .map((s) => s.trim())
      .filter(Boolean),
  );
  const attempts = new Map();
  function limited(key, maximum) {
    const time = now();
    for (const [id, item] of attempts)
      if (item.until <= time) attempts.delete(id);
    if (!attempts.has(key)) {
      if (attempts.size >= 10000) return true;
      attempts.set(key, { count: 0, until: time + 15 * 60 * 1000 });
    }
    return ++attempts.get(key).count > maximum;
  }
  const actionCooldowns = new Map();
  async function handleAction(request, ip) {
    const unavailable = () =>
      actionResponse(400, {
        title: 'This link is no longer available',
        message: 'Please call our team and we will help with your request.',
      });
    if (!['GET', 'POST'].includes(request.method) || !env.RESEND_API_KEY)
      return unavailable();
    if (limited(`action:${ip}`, 40)) return unavailable();
    const token =
      request.method === 'GET'
        ? new URL(request.url).searchParams.get('t')
        : new URLSearchParams(await request.text()).get('t');
    const payload = readActionToken({
      secret: env.RESEND_API_KEY,
      token,
      now: now(),
    });
    const service = services.find(
      (item) => item.id === payload?.values.serviceId,
    );
    if (!payload || !service) return unavailable();
    const action = requestActions[payload.action];
    const cooldownId = createHash('sha256')
      .update(`${payload.action}:${JSON.stringify(payload.values)}`)
      .digest('hex');
    const cookieName = `tmi_action_${cooldownId.slice(0, 20)}`;
    const cookieUntil = Number(
      request.headers
        .get('cookie')
        ?.match(new RegExp(`(?:^|; )${cookieName}=(\\d+)`))?.[1],
    );
    // Memory covers this server instance; the browser cookie covers other instances.
    const cooldownUntil = Math.min(
      Math.max(actionCooldowns.get(cooldownId) || 0, cookieUntil || 0),
      now() + ACTION_COOLDOWN_MS,
    );
    if (cooldownUntil > now())
      return actionResponse(200, {
        title: action.sent,
        message: action.next,
        cooldown: Math.ceil((cooldownUntil - now()) / 1000),
        token,
        again: action.again,
      });
    if (request.method === 'GET')
      return actionResponse(200, { sending: action.sending, token });
    try {
      const email = buildRequestEmail({
        values: {
          ...payload.values,
          requestType: payload.action,
          message: action.teamMessage,
        },
        service,
        receivedAt: now(),
      });
      const response = await send('https://api.resend.com/emails', {
        method: 'POST',
        signal: AbortSignal.timeout(10000),
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          // Other server instances cannot send a duplicate inside the same 5-minute window.
          'Idempotency-Key': `tmi-action-${cooldownId}-${Math.floor(now() / ACTION_COOLDOWN_MS)}`,
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: ['quotes@totalmobileglass.com', 'amartin@totalmobileglass.com'],
          reply_to: payload.values.email,
          ...email,
        }),
      });
      if (!response.ok) throw new Error(`Resend status ${response.status}`);
      const until = now() + ACTION_COOLDOWN_MS;
      for (const [id, expires] of actionCooldowns)
        if (expires <= now()) actionCooldowns.delete(id);
      if (actionCooldowns.size < 10000) actionCooldowns.set(cooldownId, until);
      const secure =
        new URL(request.url).protocol === 'https:' ? '; Secure' : '';
      return new Response(null, {
        status: 303,
        headers: {
          Location: `${REQUEST_ACTION_PATH}?t=${encodeURIComponent(token)}`,
          'Cache-Control': 'no-store',
          'Referrer-Policy': 'no-referrer',
          'Set-Cookie': `${cookieName}=${until}; Path=${REQUEST_ACTION_PATH}; Max-Age=${ACTION_COOLDOWN_MS / 1000}; HttpOnly; SameSite=Lax${secure}`,
        },
      });
    } catch (error) {
      console.error('[contact] Request action could not be sent', {
        errorType:
          error && typeof error.name === 'string' ? error.name : 'unknown',
      });
      return actionResponse(502, {
        title: 'We could not send that',
        message: 'Please call our team so we can help right away.',
      });
    }
  }
  return async (request, ip = 'unknown') => {
    const origin = request.headers.get('origin');
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      Vary: 'Origin',
      'X-Content-Type-Options': 'nosniff',
    };
    const reply = (status, body) =>
      new Response(JSON.stringify(body), { status, headers });
    const path = new URL(request.url).pathname;
    if (path === '/health' && request.method === 'GET')
      return reply(200, { ok: true });
    if (path === REQUEST_ACTION_PATH) return handleAction(request, ip);
    if (path !== '/api/contact') return reply(404, { accepted: false });
    const requestOrigin = new URL(request.url).origin;
    if (!origin || (origin !== requestOrigin && !origins.has(origin)))
      return reply(403, { accepted: false });
    headers['Access-Control-Allow-Origin'] = origin;
    if (request.method === 'OPTIONS') {
      headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
      headers['Access-Control-Allow-Headers'] = 'Content-Type, Accept';
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== 'POST') {
      headers.Allow = 'POST, OPTIONS';
      return reply(405, { accepted: false });
    }
    if (limited(`ip:${ip}`, 20)) {
      headers['Retry-After'] = '900';
      return reply(429, { accepted: false });
    }
    if (!request.headers.get('content-type')?.startsWith('application/json'))
      return reply(415, { accepted: false });
    let payload;
    try {
      const text = await request.text();
      if (Buffer.byteLength(text) > 16384)
        return reply(413, { accepted: false });
      payload = JSON.parse(text);
    } catch {
      return reply(400, { accepted: false });
    }
    if (
      !payload ||
      Array.isArray(payload) ||
      payload.schemaVersion !== 1 ||
      Object.keys(limits).some(
        (key) => payload[key] != null && typeof payload[key] !== 'string',
      )
    )
      return reply(400, { accepted: false });
    if (payload.website) return reply(422, { accepted: false });
    const values = normalizedPayload(payload);
    const fieldErrors = validateContactRequest(values);
    if (values.preferredDate) {
      const today = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Chicago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date(now()));
      const date = new Date(`${values.preferredDate}T12:00:00Z`);
      if (
        !Number.isFinite(date.getTime()) ||
        date.toISOString().slice(0, 10) !== values.preferredDate ||
        values.preferredDate < today
      )
        fieldErrors.preferredDate = 'Choose today or a valid future date.';
    }
    if (Object.keys(fieldErrors).length)
      return reply(422, { accepted: false, fieldErrors });
    if (!env.RESEND_API_KEY) return reply(503, { accepted: false });
    if (
      limited(
        `email:${createHash('sha256').update(values.email.toLowerCase()).digest('hex')}`,
        5,
      )
    )
      return reply(429, { accepted: false });
    const service = services.find((item) => item.id === values.serviceId);
    const email = buildRequestEmail({ values, service, receivedAt: now() });
    // Stable for identical submissions within a 15-minute window; provider deduplicates retries.
    const idempotencyKey = createHash('sha256')
      .update(JSON.stringify(values) + Math.floor(now() / 900000))
      .digest('hex');
    try {
      const response = await send('https://api.resend.com/emails', {
        method: 'POST',
        signal: AbortSignal.timeout(10000),
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `tmi-${idempotencyKey}`,
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: ['quotes@totalmobileglass.com', 'amartin@totalmobileglass.com'],
          reply_to: values.email,
          ...email,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        console.error('[contact] Resend rejected the email request', {
          status: response.status,
          errorType:
            typeof result?.name === 'string'
              ? result.name
              : typeof result?.code === 'string'
                ? result.code
                : 'unknown',
        });
        return reply(502, { accepted: false });
      }
      if (typeof result?.id !== 'string' || !result.id) {
        console.error('[contact] Resend returned no email ID', {
          status: response.status,
        });
        return reply(502, { accepted: false });
      }
      // The team already has the request, so a failed customer copy never fails the booking.
      let copySent = false;
      if (sendCopy && !limited(`copy:${idempotencyKey}`, 1)) {
        try {
          await withCopyTimeout(
            Promise.resolve(
              sendCopy({
                to: values.email,
                ...buildCustomerCopyEmail({
                  values,
                  service,
                  actionLinks: Object.fromEntries(
                    Object.keys(requestActions).map((action) => [
                      action,
                      `${env.ACTION_BASE_URL || requestOrigin}${REQUEST_ACTION_PATH}?t=${createActionToken(
                        {
                          secret: env.RESEND_API_KEY,
                          action,
                          values,
                          now: now(),
                        },
                      )}`,
                    ]),
                  ),
                }),
              }),
            ),
          );
          copySent = true;
        } catch (error) {
          console.error('[contact] Customer copy could not be sent', {
            errorType:
              error && typeof error.code === 'string' ? error.code : 'unknown',
          });
        }
      }
      return reply(202, { accepted: true, requestId: result.id, copySent });
    } catch (error) {
      console.error('[contact] Resend request could not be completed', {
        errorType:
          error && typeof error.name === 'string' ? error.name : 'unknown',
      });
      return reply(502, { accepted: false });
    }
  };
}

export function startContactServer(env = process.env) {
  const handle = createContactHandler({
    env: {
      ACTION_BASE_URL: `http://localhost:${env.PORT || 3001}`,
      ...env,
    },
  });
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://contact.internal');
    try {
      let bytes = 0;
      const chunks = [];
      for await (const chunk of req) {
        bytes += chunk.length;
        if (bytes > 16384) {
          res.writeHead(413, { 'Content-Type': 'application/json' });
          res.end('{"accepted":false}');
          return;
        }
        chunks.push(chunk);
      }
      const request = new Request(url, {
        method: req.method,
        headers: req.headers,
        ...(['GET', 'HEAD'].includes(req.method)
          ? {}
          : { body: Buffer.concat(chunks) }),
      });
      const response = await handle(request, req.socket.remoteAddress);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(await response.text());
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end('{"accepted":false}');
    }
  });
  server.requestTimeout = 20000;
  server.headersTimeout = 15000;
  server.listen(Number(env.PORT || 3001), '0.0.0.0');
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  startContactServer();

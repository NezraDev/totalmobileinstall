import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import {
  limits,
  normalizedPayload,
  validateContactRequest,
} from '../src/integrations/contactValidation.js';
import { services } from '../src/content/services.js';

export const RESEND_FROM =
  'Total Mobile Install <amartin@totalmobileinstall.com>';

// No browser bundle imports this file. Credentials and routing stay server-side.
export function createContactHandler({
  env = process.env,
  send = fetch,
  now = Date.now,
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
    const text = [
      'New service request — Total Mobile Install',
      `Name: ${values.fullName}`,
      `Phone: ${values.phone}`,
      `Email: ${values.email}`,
      `Service: ${service.name}`,
      `Vehicle: ${values.vehicle}`,
      `Service mode: ${values.serviceMode === 'mobile' ? 'Mobile Service' : 'Shop'}`,
      values.detailType ? `Detailing: ${values.detailType}` : '',
      values.serviceMode === 'mobile' ? `Location: ${values.location}` : '',
      `Preferred date: ${values.preferredDate || 'Not specified'}`,
      `Message: ${values.message || 'None provided'}`,
      'This is a request; the appointment requires confirmation.',
    ]
      .filter(Boolean)
      .join('\n');
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
          subject: `Service request: ${service.name}`,
          text,
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
      return reply(202, { accepted: true, requestId: result.id });
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
  const handle = createContactHandler({ env });
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

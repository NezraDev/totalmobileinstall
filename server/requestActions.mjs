import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'node:crypto';
import { business } from '../src/content/business.js';

export const REQUEST_ACTION_PATH = '/api/request-action';
export const ACTION_COOLDOWN_MS = 5 * 60 * 1000;
const TOKEN_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;
const TOKEN_FIELDS = [
  'fullName',
  'phone',
  'email',
  'serviceId',
  'vehicle',
  'location',
  'preferredDate',
];

export const requestActions = {
  urgent: {
    button: 'Urgent',
    sending: 'Sending your urgent request…',
    again: 'Send urgent request again',
    sent: 'Your urgent request was sent to our team.',
    next: `If our team has not replied within 30 minutes to 1 hour, please call ${business.phone}.`,
    teamMessage:
      'The customer clicked Urgent in their confirmation email. They need this service as soon as possible and do not need a quotation first.',
  },
  quotation: {
    button: 'Quotation or Inquiry',
    sending: 'Sending your quotation request…',
    again: 'Send quotation request again',
    sent: 'Your quotation or inquiry request was sent to our team.',
    next: 'Our team will contact you with the details.',
    teamMessage:
      'The customer clicked Quotation or Inquiry in their confirmation email. They would like a quotation or have a question before booking this service.',
  },
};

// Encrypted links keep customer details out of URLs and logs, and cannot be edited.
const tokenKey = (secret) =>
  createHash('sha256').update(`tmi-request-action:${secret}`).digest();

export function createActionToken({ secret, action, values, now }) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', tokenKey(secret), iv);
  const body = Buffer.concat([
    cipher.update(
      JSON.stringify({
        action,
        expires: now + TOKEN_LIFETIME_MS,
        values: Object.fromEntries(
          TOKEN_FIELDS.map((field) => [field, values[field]]),
        ),
      }),
    ),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64url');
}

export function readActionToken({ secret, token, now }) {
  try {
    const data = Buffer.from(String(token), 'base64url');
    const decipher = createDecipheriv(
      'aes-256-gcm',
      tokenKey(secret),
      data.subarray(0, 12),
    );
    decipher.setAuthTag(data.subarray(12, 28));
    const payload = JSON.parse(
      Buffer.concat([
        decipher.update(data.subarray(28)),
        decipher.final(),
      ]).toString(),
    );
    if (payload.expires < now || !requestActions[payload.action]) return null;
    return payload;
  } catch {
    return null;
  }
}

const escapeHtml = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        character
      ],
  );

function page({ title, body, nonce = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(title)} | ${escapeHtml(business.name)}</title>
<style nonce="${nonce}">
body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;box-sizing:border-box;background:#010b3d;color:#fff;font:400 17px/1.6 'Segoe UI',Helvetica,Arial,sans-serif;text-align:center}
main{max-width:520px}
h1{margin:0 0 12px;font-size:30px;line-height:1.2;font-weight:600}
p{margin:0 0 20px;color:#dae2ff}
[hidden]{display:none}
form{margin:0 0 12px}
.timer{font-variant-numeric:tabular-nums;font-weight:700;color:#fff}
a,button{display:inline-block;padding:14px 24px;border:0;border-radius:3px;background:#d30103;color:#fff;font:700 15px 'Segoe UI',Helvetica,Arial,sans-serif;text-decoration:none;cursor:pointer}
:focus-visible{outline:2px solid #fff;outline-offset:3px}
</style>
</head>
<body><main>${body}</main></body>
</html>`;
}

const pageHeaders = (nonce) => ({
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex',
  'Content-Security-Policy': `default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`,
});

const callLink = `<a href="${escapeHtml(business.phoneHref)}">Call ${escapeHtml(business.phone)}</a>`;

export function actionResponse(
  status,
  { title, message, sending, token, cooldown, again },
) {
  const nonce = randomBytes(16).toString('base64');
  // A brief scripted pause means link scanners that only fetch the page cannot send anything.
  const retry = cooldown
    ? `<p id="wait">You can send another request in <span class="timer" id="timer">${Math.floor(cooldown / 60)}:${String(cooldown % 60).padStart(2, '0')}</span>.</p>
<form method="post" id="again" hidden><input type="hidden" name="t" value="${escapeHtml(token)}"><button>${escapeHtml(again)}</button></form>
<script nonce="${nonce}">var left=${cooldown},ends=Date.now()+left*1000;var tick=setInterval(function(){left=Math.ceil((ends-Date.now())/1000);if(left<=0){clearInterval(tick);document.getElementById('wait').hidden=true;document.getElementById('again').hidden=false;return}document.getElementById('timer').textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0')},1000)</script>`
    : '';
  const body = sending
    ? `<h1>${escapeHtml(sending)}</h1>
<form method="post"><input type="hidden" name="t" value="${escapeHtml(token)}"><noscript><button>Send now</button></noscript></form>
<script nonce="${nonce}">setTimeout(function(){document.forms[0].submit()},900)</script>`
    : `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p>${retry}${callLink}`;
  return new Response(page({ title: title || sending, body, nonce }), {
    status,
    headers: pageHeaders(nonce),
  });
}

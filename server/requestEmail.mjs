import { business } from '../src/content/business.js';
import { requestTypes } from '../src/integrations/contactValidation.js';

export const TEAM_REPLY_TO = 'quotes@totalmobileglass.com';
const SITE_ORIGIN = 'https://totalmobileinstall.com';
const FONT = "Manrope, 'Segoe UI', Helvetica, Arial, sans-serif";
const NIGHT = '#010b3d';
const BLUE = '#011a82';
const RED = '#d30103';
const INK = '#17223b';
const MUTED = '#505b6e';
const LINE = '#dfe3ec';
const SOFT = '#f4f6fb';

// Clients with real dark mode support use these rules. Gmail apps ignore them and recolor the
// message themselves, so the logo keeps its own white plate and no text sits on a locked color.
const EMAIL_HEAD = `<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<style>
:root { color-scheme: light dark; supported-color-schemes: light dark; }
@media (prefers-color-scheme: dark) {
  .tmi-page { background: #070b1f !important; }
  .tmi-card, .tmi-logo-row { background: #11172c !important; border-color: #2c3552 !important; }
  .tmi-ink { color: #f1f4ff !important; }
  .tmi-muted { color: #b6c0da !important; }
  .tmi-heading, .tmi-link { color: #c3d0ff !important; }
  .tmi-line { border-color: #2c3552 !important; }
  .tmi-panel { background: #1a2138 !important; color: #f1f4ff !important; }
  .tmi-note { background: #1c2750 !important; color: #dbe3ff !important; }
  .tmi-button-blue { background: #2a4bdc !important; }
}
</style>`;

const escapeHtml = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        character
      ],
  );

function formatDate(value) {
  if (!value) return 'Not specified';
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T12:00:00Z`));
}

function formatReceived(time) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: business.timezone,
  }).format(new Date(time));
}

const detailRow = ({ label, value, href }, isLast) => {
  const content = href
    ? `<a href="${escapeHtml(href)}" class="tmi-link" style="color:${BLUE};font-weight:600;text-decoration:underline;">${escapeHtml(value)}</a>`
    : escapeHtml(value);
  return `<tr>
<td class="tmi-muted tmi-line" width="122" valign="top" style="width:122px;padding:13px 16px 13px 0;${isLast ? '' : `border-bottom:1px solid ${LINE};`}font:500 14px/20px ${FONT};color:${MUTED};">${escapeHtml(label)}</td>
<td class="tmi-ink tmi-line" valign="top" style="padding:13px 0;${isLast ? '' : `border-bottom:1px solid ${LINE};`}font:600 15px/22px ${FONT};color:${INK};word-break:break-word;">${content}</td>
</tr>`;
};

const actionButton = (label, href, background) =>
  `<td style="padding:0 10px 10px 0;"><a class="${background === BLUE ? 'tmi-button-blue' : ''}" href="${escapeHtml(href)}" style="display:inline-block;padding:13px 22px;background:${background};border-radius:3px;font:700 14px/20px ${FONT};color:#ffffff;text-decoration:none;">${escapeHtml(label)}</a></td>`;

const section = (title, rows) => `<tr><td style="padding:28px 32px 0;">
<h2 class="tmi-heading" style="margin:0 0 6px;font:600 18px/24px ${FONT};color:${BLUE};">${title}</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
${rows.map((row, index) => detailRow(row, index === rows.length - 1)).join('\n')}
</table>
</td></tr>`;

export function buildRequestEmail({ values, service, receivedAt }) {
  const preferredDate = formatDate(values.preferredDate);
  const message = values.message || 'None provided';
  const phoneHref = `tel:${values.phone.replace(/[^\d+]/g, '')}`;
  const emailHref = `mailto:${encodeURIComponent(values.email).replace(/%40/g, '@')}`;
  const customer = [
    { label: 'Name', value: values.fullName },
    { label: 'Phone', value: values.phone, href: phoneHref },
    { label: 'Email', value: values.email, href: emailHref },
  ];
  const requestType = requestTypes[values.requestType];
  const heading =
    values.requestType === 'urgent'
      ? 'URGENT service request'
      : values.requestType === 'quotation'
        ? 'New quotation request'
        : 'New service request';
  const requested = [
    { label: 'Type of request', value: requestType },
    { label: 'Service', value: service.name },
    { label: 'Vehicle', value: values.vehicle },
    {
      label: 'Location',
      value: values.location,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(values.location)}`,
    },
    { label: 'Preferred date', value: preferredDate },
  ];
  const confirmation =
    'This is a request; the appointment requires confirmation.';
  const text = [
    `${heading} — Total Mobile Install`,
    `Type of request: ${requestType}`,
    `Name: ${values.fullName}`,
    `Phone: ${values.phone}`,
    `Email: ${values.email}`,
    `Service: ${service.name}`,
    `Vehicle: ${values.vehicle}`,
    `Location: ${values.location}`,
    `Preferred date: ${preferredDate}`,
    `Message: ${message}`,
    confirmation,
  ]
    .filter(Boolean)
    .join('\n');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${EMAIL_HEAD}
<title>New service request</title>
</head>
<body class="tmi-page" style="margin:0;padding:0;background:${SOFT};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(`${values.fullName}: ${service.name}, ${values.vehicle}`)}</div>
<table class="tmi-page" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SOFT};">
<tr><td align="center" style="padding:24px 12px;">
<table class="tmi-card" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid ${LINE};border-radius:4px;border-collapse:separate;overflow:hidden;">
<tr><td class="tmi-logo-row" style="padding:12px 20px;background:#ffffff;">
<a href="${SITE_ORIGIN}" style="display:inline-block;padding:10px 12px;background:#ffffff;background-image:linear-gradient(#ffffff,#ffffff);border-radius:4px;text-decoration:none;"><img src="${SITE_ORIGIN}${business.logo}" width="230" alt="${escapeHtml(business.name)}" style="display:block;width:230px;max-width:100%;height:auto;border:0;font:700 18px/24px ${FONT};color:${BLUE};"></a>
</td></tr>
<tr><td style="padding:30px 32px;background:${NIGHT};">
<h1 style="margin:0;font:600 28px/34px ${FONT};color:#ffffff;">${heading}</h1>
<p style="margin:10px 0 0;font:500 16px/24px ${FONT};color:#ffffff;">${escapeHtml(service.name)} · ${escapeHtml(values.vehicle)}</p>
<p style="margin:6px 0 0;font:400 14px/20px ${FONT};color:#c9d5ff;">Received ${escapeHtml(formatReceived(receivedAt))} Central Time</p>
</td></tr>
<tr><td style="padding:24px 32px 0;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
${actionButton(`Call ${values.fullName.split(' ')[0]}`, phoneHref, RED)}
${actionButton('Reply by email', emailHref, BLUE)}
</tr></table>
</td></tr>
${section('Customer', customer)}
${section('Request', requested)}
<tr><td style="padding:28px 32px 0;">
<h2 class="tmi-heading" style="margin:0 0 10px;font:600 18px/24px ${FONT};color:${BLUE};">Message</h2>
<div class="tmi-panel" style="padding:16px 18px;background:${SOFT};border-radius:3px;font:400 15px/24px ${FONT};color:${INK};white-space:pre-wrap;word-break:break-word;">${escapeHtml(message)}</div>
</td></tr>
<tr><td style="padding:24px 32px 28px;">
<p class="tmi-note" style="margin:0;padding:14px 18px;background:#e9edf8;border-radius:3px;font:600 14px/21px ${FONT};color:${BLUE};">${confirmation}</p>
</td></tr>
<tr><td style="padding:20px 32px;background:${NIGHT};font:400 13px/20px ${FONT};color:#c9d5ff;">
${escapeHtml(business.fullName)}<br>
${escapeHtml(business.address)}<br>
<a href="${escapeHtml(business.phoneHref)}" style="color:#ffffff;text-decoration:none;">${escapeHtml(business.phone)}</a>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
  return {
    subject: `${{ urgent: 'Urgent / Rush', appointment: 'Appointment', quotation: 'Quotation' }[values.requestType]} - ${service.name} - ${values.fullName}`,
    text,
    html,
  };
}

// Free-text messages stay out so the form cannot relay custom messages to other people's inboxes.
export function buildCustomerCopyEmail({ values, service, actionLinks }) {
  const firstName = values.fullName.split(/\s+/)[0];
  const preferredDate = formatDate(values.preferredDate);
  const requestType = requestTypes[values.requestType];
  const urgentLink = actionLinks.urgent;
  const quotationLink = actionLinks.quotation;
  const urgentHelp = `If this request is urgent and you do not need a quotation, click Urgent and we will alert our team right away. If our team has not replied within 30 minutes to 1 hour, please call ${business.phone}.`;
  const quotationHelp =
    'If you need a quotation or have an inquiry before service, click Quotation or Inquiry and we will let our team know.';
  const summary = [
    { label: 'Type of request', value: requestType },
    { label: 'Service', value: service.name },
    { label: 'Vehicle', value: values.vehicle },
    { label: 'Location', value: values.location },
    { label: 'Preferred date', value: preferredDate },
    { label: 'Your phone', value: values.phone },
  ];
  const confirmation =
    'This is a request, not a confirmed appointment. Our team will contact you to confirm availability.';
  const notYou =
    'If you did not make this request, you can ignore this email or call us.';
  const text = [
    `Hi ${firstName},`,
    'We received your service request. Here is your copy:',
    ...summary.map(({ label, value }) => `${label}: ${value}`),
    confirmation,
    urgentHelp,
    `Urgent: ${urgentLink}`,
    quotationHelp,
    `Quotation or Inquiry: ${quotationLink}`,
    notYou,
    business.fullName,
  ].join('\n');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${EMAIL_HEAD}
<title>We received your service request</title>
</head>
<body class="tmi-page" style="margin:0;padding:0;background:${SOFT};">
<table class="tmi-page" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SOFT};">
<tr><td align="center" style="padding:24px 12px;">
<table class="tmi-card" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid ${LINE};border-radius:4px;border-collapse:separate;overflow:hidden;">
<tr><td class="tmi-logo-row" style="padding:12px 20px;background:#ffffff;">
<a href="${SITE_ORIGIN}" style="display:inline-block;padding:10px 12px;background:#ffffff;background-image:linear-gradient(#ffffff,#ffffff);border-radius:4px;text-decoration:none;"><img src="${SITE_ORIGIN}${business.logo}" width="230" alt="${escapeHtml(business.name)}" style="display:block;width:230px;max-width:100%;height:auto;border:0;font:700 18px/24px ${FONT};color:${BLUE};"></a>
</td></tr>
<tr><td style="padding:30px 32px;background:${NIGHT};">
<h1 style="margin:0;font:600 28px/34px ${FONT};color:#ffffff;">We received your request</h1>
<p style="margin:10px 0 0;font:500 16px/24px ${FONT};color:#ffffff;">Hi ${escapeHtml(firstName)}, here is your copy.</p>
</td></tr>
${section('Your request', summary)}
<tr><td style="padding:24px 32px 0;">
<p class="tmi-note" style="margin:0;padding:14px 18px;background:#e9edf8;border-radius:3px;font:600 14px/21px ${FONT};color:${BLUE};">${confirmation}</p>
</td></tr>
<tr><td style="padding:28px 32px 0;">
<h2 class="tmi-heading" style="margin:0 0 10px;font:600 18px/24px ${FONT};color:${BLUE};">Next steps</h2>
<p class="tmi-ink" style="margin:0 0 12px;font:400 15px/23px ${FONT};color:${INK};">${escapeHtml(urgentHelp)}</p>
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
${actionButton('Urgent', urgentLink, RED)}
${actionButton(`Call ${business.phone}`, business.phoneHref, BLUE)}
</tr></table>
<p class="tmi-ink" style="margin:12px 0 12px;font:400 15px/23px ${FONT};color:${INK};">${quotationHelp}</p>
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
${actionButton('Quotation or Inquiry', quotationLink, BLUE)}
</tr></table>
</td></tr>
<tr><td style="padding:12px 32px 24px;">
<p class="tmi-muted" style="margin:8px 0 0;font:400 13px/20px ${FONT};color:${MUTED};">${notYou}</p>
</td></tr>
<tr><td style="padding:20px 32px;background:${NIGHT};font:400 13px/20px ${FONT};color:#c9d5ff;">
${escapeHtml(business.fullName)}<br>
${escapeHtml(business.city)}<br>
<a href="${SITE_ORIGIN}" style="color:#ffffff;text-decoration:none;">totalmobileinstall.com</a>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
  return {
    subject: 'We received your service request - Total Mobile Install',
    text,
    html,
  };
}

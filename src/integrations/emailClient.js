/** Public, frontend-only contract for a separately managed Resend integration. */
import { services, getAvailableServiceModes } from '../content/services.js';

export const CONTACT_ENDPOINT = (
  import.meta.env.VITE_CONTACT_ENDPOINT || ''
).trim();

const limits = {
  fullName: 100,
  phone: 30,
  email: 254,
  serviceId: 80,
  detailType: 40,
  vehicle: 160,
  serviceMode: 40,
  location: 200,
  preferredDate: 10,
  message: 3000,
  website: 200,
};

export class ContactRequestError extends Error {
  constructor(message, code = 'request_failed', fieldErrors = {}) {
    super(message);
    this.name = 'ContactRequestError';
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export function isContactConfigured() {
  try {
    const url = new URL(CONTACT_ENDPOINT);
    return (
      url.protocol === 'https:' ||
      (import.meta.env.DEV &&
        url.protocol === 'http:' &&
        ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))
    );
  } catch {
    return false;
  }
}

function normalizedPayload(payload = {}) {
  return Object.fromEntries(
    Object.keys(limits).map((key) => [key, String(payload[key] ?? '').trim()]),
  );
}

/** Build a reviewable email draft when the site has no secure request endpoint. */
export function buildContactMailtoHref(payload, emailAddress) {
  const address = String(emailAddress ?? '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
    throw new ContactRequestError(
      'The business email address is unavailable.',
      'configuration',
    );
  }

  const values = normalizedPayload(payload);
  const body = [
    'Service request for Total Mobile Install',
    '',
    `Name: ${values.fullName}`,
    `Phone: ${values.phone}`,
    `Email: ${values.email}`,
    `Service: ${values.serviceId}`,
    values.detailType ? `Detailing service: ${values.detailType}` : '',
    `Vehicle: ${values.vehicle}`,
    `Preferred service mode: ${values.serviceMode}`,
    values.location ? `Service address or ZIP: ${values.location}` : '',
    values.preferredDate ? `Preferred date: ${values.preferredDate}` : '',
    `Additional details: ${values.message || 'None provided.'}`,
  ]
    .filter(Boolean)
    .join('\r\n');

  return `mailto:${address}?subject=${encodeURIComponent('Service request — Total Mobile Install')}&body=${encodeURIComponent(body)}`;
}

/** Returns a field-name -> readable error object. Endpoint validation remains required. */
export function validateContactRequest(payload) {
  const values = normalizedPayload(payload);
  const errors = {};
  const selectedService = services.find(
    (service) => service.id === values.serviceId,
  );
  if (!values.fullName) errors.fullName = 'Enter your full name.';
  if (!values.phone || values.phone.replace(/\D/g, '').length < 10)
    errors.phone = 'Enter a phone number with at least 10 digits.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = 'Enter a valid email address.';
  if (!values.serviceId) errors.serviceId = 'Choose the service you need.';
  if (values.serviceId && !selectedService)
    errors.serviceId = 'Choose a valid service.';
  if (selectedService?.id === 'mobile-detailing') {
    if (
      ![
        'interior',
        'hand-wash',
        'paint-correction',
        'polishing',
        'ceramic-coating',
      ].includes(values.detailType)
    ) {
      errors.detailType = 'Choose the detailing service you need.';
    }
  }
  if (!values.vehicle)
    errors.vehicle = 'Enter your vehicle year, make, and model.';
  if (!values.serviceMode) errors.serviceMode = 'Choose a service preference.';
  else if (
    selectedService &&
    !getAvailableServiceModes(selectedService, values.detailType).includes(
      values.serviceMode,
    )
  ) {
    errors.serviceMode = 'Choose a service mode available for your selection.';
  }
  if (values.serviceMode === 'mobile' && !values.location)
    errors.location = 'Enter the service address or ZIP code.';
  if (values.preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(values.preferredDate))
    errors.preferredDate = 'Choose a valid preferred date.';
  for (const [key, maximum] of Object.entries(limits)) {
    if (values[key].length > maximum)
      errors[key] = `Keep this field to ${maximum} characters or fewer.`;
  }
  return errors;
}

/** A resolved request means acceptance by the configured endpoint, not delivery or an appointment. */
export async function submitContactRequest(payload, { signal } = {}) {
  if (!isContactConfigured()) {
    throw new ContactRequestError(
      'Online requests are not available yet. Please call 1-504-207-7742 or email quotes@totalmobileglass.com.',
      'unconfigured',
    );
  }
  const values = normalizedPayload(payload);
  const fieldErrors = validateContactRequest(values);
  if (Object.keys(fieldErrors).length) {
    throw new ContactRequestError(
      'Please check the highlighted fields.',
      'validation',
      fieldErrors,
    );
  }

  const controller = new AbortController();
  const abort = () => controller.abort(signal?.reason);
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 15000);
  if (signal?.aborted) abort();
  signal?.addEventListener('abort', abort, { once: true });

  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'omit',
      cache: 'no-store',
      signal: controller.signal,
      body: JSON.stringify({ schemaVersion: 1, ...values }),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.accepted !== true) {
      const safeFieldErrors = {};
      if (response.status === 400 || response.status === 422) {
        for (const [key, value] of Object.entries(result?.fieldErrors || {})) {
          if (
            Object.hasOwn(limits, key) &&
            typeof value === 'string' &&
            value.length <= 200
          )
            safeFieldErrors[key] = value;
        }
      }
      throw new ContactRequestError(
        response.status === 429
          ? 'Too many requests. Please wait a moment or call us.'
          : 'Your request could not be accepted. Your details are still here. Please try again or call us.',
        response.status === 429 ? 'rate_limited' : 'request_failed',
        safeFieldErrors,
      );
    }
    return {
      accepted: true,
      requestId: typeof result.requestId === 'string' ? result.requestId : null,
      message:
        'Request received. Our team will contact you to confirm availability. Your appointment is not confirmed yet.',
    };
  } catch (error) {
    if (error instanceof ContactRequestError) throw error;
    if (signal?.aborted) throw error;
    throw new ContactRequestError(
      timedOut
        ? 'The request took too long. Please call or email us before sending again.'
        : 'We could not connect. Your details are still here. Please try again or call us.',
      timedOut ? 'timeout' : 'network',
    );
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}

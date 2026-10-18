/** Public browser client for the server-only Resend integration. */
import {
  limits,
  normalizedPayload,
  validateContactRequest,
} from './contactValidation.js';
export { validateContactRequest } from './contactValidation.js';

export const CONTACT_ENDPOINT = (
  import.meta.env.VITE_CONTACT_ENDPOINT ||
  (import.meta.env.DEV ? '' : '/api/contact')
).trim();

export class ContactRequestError extends Error {
  constructor(message, code = 'request_failed', fieldErrors = {}) {
    super(message);
    this.name = 'ContactRequestError';
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export function isContactConfigured() {
  if (CONTACT_ENDPOINT === '/api/contact') return true;
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

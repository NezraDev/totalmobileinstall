import { services, getAvailableServiceModes } from '../content/services.js';

export const limits = {
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

export function normalizedPayload(payload = {}) {
  return Object.fromEntries(
    Object.keys(limits).map((key) => [key, String(payload[key] ?? '').trim()]),
  );
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

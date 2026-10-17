import { useId, useRef, useState } from 'react';
import { ArrowUpRight, Phone, CheckCircle2, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  services,
  serviceModes,
  serviceSpecialties,
  getAvailableServiceModes,
} from '../../content/services';
import { business } from '../../content/business';
import { formCopy as c } from '../../content/ui';
import {
  buildContactMailtoHref,
  isContactConfigured,
  validateContactRequest,
  submitContactRequest,
} from '../../integrations/emailClient';

export default function BookingForm({
  compact = false,
  initialService = '',
  initialMode = '',
  initialLocation = '',
}) {
  const selectedInitialService = services.find(
    (service) => service.id === initialService,
  );
  const requestedInitialMode = ['mobile', 'shop'].includes(initialMode)
    ? initialMode
    : '';
  const initialDetailType =
    selectedInitialService?.id === 'mobile-detailing' &&
    requestedInitialMode === 'shop'
      ? 'paint-correction'
      : 'interior';
  const initialAvailableModes = getAvailableServiceModes(
    selectedInitialService,
    initialDetailType,
  );
  const selectedInitialMode = selectedInitialService
    ? initialAvailableModes.includes(requestedInitialMode)
      ? requestedInitialMode
      : (initialAvailableModes[0] ?? '')
    : requestedInitialMode;
  const formId = useId(),
    formRef = useRef(null),
    pendingRef = useRef(false);
  const [values, setValues] = useState(() => ({
    fullName: '',
    phone: '',
    email: '',
    serviceId: selectedInitialService?.id || '',
    vehicle: '',
    serviceMode: selectedInitialMode,
    location: selectedInitialMode === 'mobile' ? initialLocation : '',
    preferredDate: '',
    message: '',
    website: '',
    detailType: initialDetailType,
  }));
  const [errors, setErrors] = useState({}),
    [status, setStatus] = useState('idle');
  const configured = isContactConfigured();
  const service = services.find((s) => s.id === values.serviceId);
  const modes = service
    ? getAvailableServiceModes(service, values.detailType)
    : ['mobile', 'shop'];
  function update(e) {
    const { name, value } = e.target;
    setValues((v) => {
      const next = { ...v, [name]: value };
      if (name === 'serviceId') {
        const selectedService = services.find((item) => item.id === value);
        next.detailType =
          selectedService?.id === 'mobile-detailing' &&
          next.serviceMode === 'shop'
            ? 'paint-correction'
            : 'interior';
        const availableModes = getAvailableServiceModes(
          selectedService,
          next.detailType,
        );
        next.serviceMode = availableModes.includes(next.serviceMode)
          ? next.serviceMode
          : (availableModes[0] ?? '');
        if (next.serviceMode !== 'mobile') next.location = '';
      }
      if (name === 'serviceMode' && value !== 'mobile') {
        next.location = '';
      }
      if (name === 'detailType') {
        const selectedService = services.find(
          (item) => item.id === next.serviceId,
        );
        const availableModes = getAvailableServiceModes(selectedService, value);
        next.serviceMode = availableModes.includes(next.serviceMode)
          ? next.serviceMode
          : (availableModes[0] ?? '');
        if (next.serviceMode !== 'mobile') next.location = '';
      }
      return next;
    });
    setErrors((current) => {
      const next = { ...current };
      delete next[name];
      if (name === 'serviceId') {
        delete next.serviceMode;
        delete next.location;
        delete next.detailType;
      }
      if (name === 'detailType') {
        delete next.serviceMode;
        delete next.location;
      }
      if (name === 'serviceMode') delete next.location;
      return next;
    });
    if (status === 'failed' || status === 'email-draft') setStatus('idle');
  }
  async function submit(e) {
    e.preventDefault();
    if (pendingRef.current) return;
    let payload = {
      ...values,
      message:
        values.serviceId === 'mobile-detailing'
          ? `${c.detailingChoices.find((d) => d.id === values.detailType)?.label}. ${values.message}`
          : values.message,
    };
    const nextErrors = validateContactRequest(payload);
    if (
      payload.preferredDate &&
      payload.preferredDate <
        new Intl.DateTimeFormat('en-CA', {
          timeZone: business.timezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(new Date())
    )
      nextErrors.preferredDate = 'Choose today or a future date.';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus('validation');
      setTimeout(
        () => formRef.current?.querySelector('[aria-invalid="true"]')?.focus(),
        0,
      );
      return;
    }
    if (!configured) {
      const detailingChoice = c.detailingChoices.find(
        (choice) => choice.id === values.detailType,
      );
      const mailto = buildContactMailtoHref(
        {
          ...values,
          serviceId: service?.name || values.serviceId,
          detailType:
            values.serviceId === 'mobile-detailing'
              ? detailingChoice?.label || ''
              : '',
          serviceMode: serviceModes[values.serviceMode] || values.serviceMode,
        },
        business.email,
      );
      setStatus('email-draft');
      window.location.href = mailto;
      return;
    }
    pendingRef.current = true;
    setStatus('submitting');
    try {
      await submitContactRequest(payload);
      setStatus('submitted');
    } catch (error) {
      setErrors(error.fieldErrors || {});
      setStatus('failed');
    } finally {
      pendingRef.current = false;
    }
  }
  const field = (name, type = 'text', required = false, hint) => (
    <div className={`form-field ${name === 'vehicle' ? 'field-wide' : ''}`}>
      <label htmlFor={`${formId}-${name}`}>
        {c.labels[name]}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={`${formId}-${name}`}
        name={name}
        type={type}
        required={required}
        autoComplete={
          {
            fullName: 'name',
            phone: 'tel',
            email: 'email',
            vehicle: 'off',
            location: 'street-address',
          }[name]
        }
        value={values[name]}
        onChange={update}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={
          errors[name]
            ? `${formId}-${name}-error`
            : hint
              ? `${formId}-${name}-hint`
              : undefined
        }
        maxLength={
          { fullName: 100, phone: 30, email: 254, vehicle: 160, location: 200 }[
            name
          ]
        }
        min={
          name === 'preferredDate'
            ? new Intl.DateTimeFormat('en-CA', {
                timeZone: business.timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }).format(new Date())
            : undefined
        }
      />
      {hint && <small id={`${formId}-${name}-hint`}>{hint}</small>}
      {errors[name] && (
        <small className="field-error" id={`${formId}-${name}-error`}>
          {errors[name]}
        </small>
      )}
    </div>
  );
  if (status === 'submitted')
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={40} />
        <h3>{c.successTitle}</h3>
        <p>{c.success}</p>
        <button
          className="button button-secondary"
          onClick={() => setStatus('idle')}
        >
          {c.retry}
        </button>
      </div>
    );
  return (
    <div className={`booking-form-wrap ${compact ? 'compact' : ''}`}>
      <h3>{c.title}</h3>
      <p className="form-intro">{c.description}</p>
      {!configured && (
        <div className="form-email-fallback" role="note">
          <strong>{c.emailFallbackTitle}</strong>
          <p>{c.emailFallbackDescription}</p>
          <div>
            <a href={business.phoneHref}>
              <Phone size={15} />
              {business.phone}
            </a>
            <a href={`mailto:${business.email}`}>
              {business.email}
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      )}
      <form ref={formRef} onSubmit={submit} noValidate>
        <p className="required-note">{c.required}</p>
        <div className="form-grid">
          <div className="form-field field-wide">
            <label htmlFor={`${formId}-serviceId`}>
              {c.labels.serviceId} <span aria-hidden="true">*</span>
            </label>
            <select
              id={`${formId}-serviceId`}
              className="form-select--center"
              name="serviceId"
              value={values.serviceId}
              onChange={update}
              required
              aria-invalid={Boolean(errors.serviceId)}
              aria-describedby={
                errors.serviceId ? `${formId}-serviceId-error` : undefined
              }
            >
              <option value="">{c.selectService}</option>
              {serviceSpecialties.map((specialty) => (
                <optgroup key={specialty.id} label={specialty.name}>
                  {services
                    .filter(
                      (serviceOption) =>
                        specialty.id === serviceOption.specialtyId,
                    )
                    .map((serviceOption) => (
                      <option key={serviceOption.id} value={serviceOption.id}>
                        {serviceOption.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
            {errors.serviceId && (
              <small className="field-error" id={`${formId}-serviceId-error`}>
                {errors.serviceId}
              </small>
            )}
          </div>
          {values.serviceId === 'mobile-detailing' && (
            <div className="form-field field-wide">
              <label htmlFor={`${formId}-detailType`}>
                {c.labels.detailType}
              </label>
              <select
                id={`${formId}-detailType`}
                className="form-select--center"
                name="detailType"
                value={values.detailType}
                onChange={update}
                aria-invalid={Boolean(errors.detailType)}
                aria-describedby={
                  errors.detailType ? `${formId}-detailType-error` : undefined
                }
              >
                {c.detailingChoices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
              {errors.detailType && (
                <small
                  className="field-error"
                  id={`${formId}-detailType-error`}
                >
                  {errors.detailType}
                </small>
              )}
            </div>
          )}
          {field('vehicle', 'text', true, c.vehicleHint)}
          <div className="form-field">
            <label htmlFor={`${formId}-serviceMode`}>
              {c.labels.serviceMode} <span aria-hidden="true">*</span>
            </label>
            <select
              id={`${formId}-serviceMode`}
              className="form-select--center"
              name="serviceMode"
              value={values.serviceMode}
              onChange={update}
              required
              aria-invalid={Boolean(errors.serviceMode)}
              aria-describedby={
                errors.serviceMode
                  ? `${formId}-mode-note ${formId}-serviceMode-error`
                  : `${formId}-mode-note`
              }
            >
              <option value="">{c.selectMode}</option>
              {['mobile', 'shop'].map((m) => (
                <option
                  key={m}
                  value={m}
                  disabled={Boolean(service) && !modes.includes(m)}
                >
                  {serviceModes[m]}
                  {service && !modes.includes(m) ? ' (unavailable)' : ''}
                </option>
              ))}
            </select>
            <small id={`${formId}-mode-note`}>
              {service?.modeNote || c.modeNote}
            </small>
            {errors.serviceMode && (
              <small className="field-error" id={`${formId}-serviceMode-error`}>
                {errors.serviceMode}
              </small>
            )}
          </div>
          {service &&
            values.serviceMode === 'mobile' &&
            field(
              'location',
              'text',
              true,
              initialLocation
                ? 'Map pin coordinates are included. Add the street address or ZIP code to help us confirm your visit.'
                : c.locationHint,
            )}
          {field('fullName', 'text', true)}
          {field('phone', 'tel', true)}
          {field('email', 'email', true)}
          {field('preferredDate', 'date', false, c.dateHint)}
          <div className="form-field field-wide">
            <label htmlFor={`${formId}-message`}>{c.labels.message}</label>
            <textarea
              id={`${formId}-message`}
              name="message"
              rows="4"
              value={values.message}
              onChange={update}
              maxLength="3000"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={
                errors.message ? `${formId}-message-error` : undefined
              }
            />
            {errors.message && (
              <small className="field-error" id={`${formId}-message-error`}>
                {errors.message}
              </small>
            )}
          </div>
          <div className="honeypot" aria-hidden="true">
            <label htmlFor={`${formId}-website`}>{c.labels.website}</label>
            <input
              id={`${formId}-website`}
              name="website"
              tabIndex="-1"
              value={values.website}
              onChange={update}
              autoComplete="off"
            />
          </div>
        </div>
        <div aria-live="polite" className="form-status">
          {status === 'email-draft' && (
            <p role="status" className="form-email-status">
              {c.emailDraftReady}{' '}
              <a href={`mailto:${business.email}`}>{business.email}</a>
            </p>
          )}
          {status === 'failed' && (
            <p role="alert" className="field-error">
              {c.error}
            </p>
          )}
          {status === 'validation' && (
            <p className="field-error">{c.validationSummary}</p>
          )}
        </div>
        <button
          className="button button-primary form-submit"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? (
            <>
              <LoaderCircle className="spin" size={18} />
              {c.submitting}
            </>
          ) : (
            <>
              {configured ? c.submit : c.emailDraftSubmit}
              <ArrowUpRight size={18} />
            </>
          )}
        </button>
        <p className="form-privacy">
          {configured ? c.privacy : c.emailDraftPrivacy}{' '}
          <Link to="/privacy-policy">{c.privacyLabel}</Link>
        </p>
      </form>
    </div>
  );
}

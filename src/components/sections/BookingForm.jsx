import { useId, useRef, useState } from 'react';
import { ArrowUpRight, Phone, CheckCircle2, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { services, serviceModes } from '../../content/services';
import { business } from '../../content/business';
import { formCopy as c } from '../../content/ui';
import {
  isContactConfigured,
  validateContactRequest,
  submitContactRequest,
} from '../../integrations/emailClient';

export default function BookingForm({ compact = false, initialService = '' }) {
  const formId = useId(),
    formRef = useRef(null),
    pendingRef = useRef(false);
  const [values, setValues] = useState({
    fullName: '',
    phone: '',
    email: '',
    serviceId: services.some((s) => s.id === initialService)
      ? initialService
      : '',
    vehicle: '',
    serviceMode: '',
    location: '',
    preferredDate: '',
    message: '',
    website: '',
    detailType: 'interior',
  });
  const [errors, setErrors] = useState({}),
    [status, setStatus] = useState('idle');
  const configured = isContactConfigured();
  const service = services.find((s) => s.id === values.serviceId);
  const shopOnly =
    values.serviceId === 'mobile-detailing' &&
    ['paint-correction', 'polishing', 'ceramic-coating'].includes(
      values.detailType,
    );
  const modes = shopOnly ? ['shop'] : service?.modes || [];
  function update(e) {
    const { name, value } = e.target;
    setValues((v) => {
      const next = { ...v, [name]: value };
      if (name === 'serviceId') {
        next.serviceMode = '';
        next.location = '';
      }
      if (
        name === 'detailType' &&
        ['paint-correction', 'polishing', 'ceramic-coating'].includes(value)
      ) {
        next.serviceMode = 'shop';
        next.location = '';
      }
      return next;
    });
    setErrors((v) => ({ ...v, [name]: undefined }));
    if (status === 'failed') setStatus('idle');
  }
  async function submit(e) {
    e.preventDefault();
    if (pendingRef.current || !configured) return;
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
        <div className="form-unavailable">
          <strong>{c.unavailable}</strong>
          <p>{c.unavailableDescription}</p>
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
          {field('fullName', 'text', true)}
          {field('phone', 'tel', true)}
          {field('email', 'email', true)}
          <div className="form-field">
            <label htmlFor={`${formId}-serviceId`}>
              {c.labels.serviceId} <span aria-hidden="true">*</span>
            </label>
            <select
              id={`${formId}-serviceId`}
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
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.serviceId && (
              <small className="field-error" id={`${formId}-serviceId-error`}>
                {errors.serviceId}
              </small>
            )}
          </div>
          {field('vehicle', 'text', true, c.vehicleHint)}
          {values.serviceId === 'mobile-detailing' && (
            <div className="form-field field-wide">
              <label htmlFor={`${formId}-detailType`}>
                {c.labels.detailType}
              </label>
              <select
                id={`${formId}-detailType`}
                name="detailType"
                value={values.detailType}
                onChange={update}
              >
                {c.detailingChoices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="form-field">
            <label htmlFor={`${formId}-serviceMode`}>
              {c.labels.serviceMode} <span aria-hidden="true">*</span>
            </label>
            <select
              id={`${formId}-serviceMode`}
              name="serviceMode"
              value={values.serviceMode}
              onChange={update}
              required
              disabled={!service}
              aria-invalid={Boolean(errors.serviceMode)}
              aria-describedby={`${formId}-mode-note`}
            >
              <option value="">{c.selectMode}</option>
              {modes.map((m) => (
                <option key={m} value={m}>
                  {serviceModes[m]}
                </option>
              ))}
            </select>
            <small id={`${formId}-mode-note`}>
              {service?.modeNote || c.modeNote}
            </small>
            {errors.serviceMode && (
              <small className="field-error">{errors.serviceMode}</small>
            )}
          </div>
          {field('preferredDate', 'date', false, c.dateHint)}
          {values.serviceMode === 'mobile' &&
            field('location', 'text', true, c.locationHint)}
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
            />
            {errors.message && (
              <small className="field-error">{errors.message}</small>
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
          disabled={!configured || status === 'submitting'}
        >
          {status === 'submitting' ? (
            <>
              <LoaderCircle className="spin" size={18} />
              {c.submitting}
            </>
          ) : (
            <>
              {configured ? c.submit : c.unconfiguredButton}
              <ArrowUpRight size={18} />
            </>
          )}
        </button>
        <p className="form-privacy">
          {c.privacy} <Link to="/privacy-policy">{c.privacyLabel}</Link>
        </p>
      </form>
    </div>
  );
}

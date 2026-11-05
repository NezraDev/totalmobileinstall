import { useId, useRef, useState } from 'react';
import { ArrowUpRight, Phone, CheckCircle2, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  findService,
  services,
  serviceSpecialties,
} from '../../content/services';
import { business } from '../../content/business';
import { formCopy as c } from '../../content/ui';
import {
  isContactConfigured,
  validateContactRequest,
  submitContactRequest,
} from '../../integrations/emailClient';
import { requestTypes } from '../../integrations/contactValidation';

const fieldSteps = {
  serviceId: 1,
  requestType: 1,
  location: 1,
  vehicle: 2,
  preferredDate: 2,
  fullName: 3,
  phone: 3,
  email: 3,
  message: 4,
};
const lastStep = c.stepLabels.length;

export default function BookingForm({
  stepped = false,
  compact = false,
  initialService = '',
  initialLocation = '',
}) {
  // Old ?service= links use pre-rename IDs; findService maps them to current ones.
  const initialMatch = findService(initialService);
  const selectedInitialService = initialMatch?.unavailable
    ? undefined
    : initialMatch;
  const formId = useId(),
    formRef = useRef(null),
    pendingRef = useRef(false);
  const [values, setValues] = useState(() => ({
    fullName: '',
    phone: '',
    email: '',
    serviceId: selectedInitialService?.id || '',
    requestType: '',
    vehicle: '',
    location: initialLocation,
    preferredDate: '',
    message: '',
    website: '',
  }));
  const [errors, setErrors] = useState({}),
    [status, setStatus] = useState('idle');
  const [requestError, setRequestError] = useState('');
  const [copySent, setCopySent] = useState(false);
  const [step, setStep] = useState(1);
  const hiddenStep = (name) => stepped && fieldSteps[name] !== step;
  const focusField = (selector) =>
    setTimeout(() => formRef.current?.querySelector(selector)?.focus(), 0);
  const configured = isContactConfigured();
  function update(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
    if (status === 'failed') setStatus('idle');
  }
  const buildPayload = () => values;
  function validate(payload) {
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
    return nextErrors;
  }
  function firstStepWithError(fieldErrors) {
    return Math.min(
      step,
      ...Object.keys(fieldErrors).map((name) => fieldSteps[name] ?? step),
    );
  }
  function goToNextStep() {
    const stepErrors = Object.fromEntries(
      Object.entries(validate(buildPayload())).filter(
        ([name]) => fieldSteps[name] === step,
      ),
    );
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      setStatus('validation');
      focusField('[aria-invalid="true"]');
      return;
    }
    setErrors({});
    setStatus('idle');
    setStep(step + 1);
    focusField('.form-field:not([hidden]) :is(input, select, textarea)');
  }
  function goToPreviousStep() {
    setStatus('idle');
    setStep(step - 1);
    focusField('.form-field:not([hidden]) :is(input, select, textarea)');
  }
  async function submit(e) {
    e.preventDefault();
    if (pendingRef.current) return;
    if (stepped && step < lastStep) {
      goToNextStep();
      return;
    }
    const payload = buildPayload();
    const nextErrors = validate(payload);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus('validation');
      if (stepped) setStep(firstStepWithError(nextErrors));
      focusField('[aria-invalid="true"]');
      return;
    }
    pendingRef.current = true;
    setRequestError('');
    setStatus('submitting');
    try {
      const result = await submitContactRequest(payload);
      setCopySent(result.copySent);
      setStatus('submitted');
    } catch (error) {
      setErrors(error.fieldErrors || {});
      if (stepped) setStep(firstStepWithError(error.fieldErrors || {}));
      setRequestError(error.message || c.error);
      setStatus('failed');
    } finally {
      pendingRef.current = false;
    }
  }
  const field = (name, type = 'text', required = false, hint) => (
    <div
      className={`form-field ${name === 'vehicle' ? 'field-wide' : ''}`}
      hidden={hiddenStep(name)}
    >
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
        {copySent && <p>{c.copySent(values.email)}</p>}
        <button
          className="button button-secondary"
          onClick={() => {
            setStep(1);
            setStatus('idle');
          }}
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
        {stepped && (
          <>
            <ol className="form-steps">
              {c.stepLabels.map((label, index) => (
                <li
                  key={label}
                  className={index + 1 < step ? 'done' : undefined}
                  aria-current={index + 1 === step ? 'step' : undefined}
                >
                  <b>{index + 1}</b>
                  {label}
                </li>
              ))}
            </ol>
            <p className="form-step-status" aria-live="polite">
              {c.stepStatus(step, lastStep)}
            </p>
          </>
        )}
        <p className="required-note">{c.required}</p>
        <div className="form-grid">
          <div
            className="form-field field-wide"
            hidden={hiddenStep('serviceId')}
          >
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
              {serviceSpecialties.map((specialty) => (
                <optgroup key={specialty.id} label={specialty.name}>
                  {services
                    .filter(
                      (serviceOption) =>
                        specialty.id === serviceOption.specialtyId,
                    )
                    .map((serviceOption) => (
                      <option
                        key={serviceOption.id}
                        value={serviceOption.id}
                        disabled={serviceOption.unavailable}
                      >
                        {serviceOption.name}
                        {serviceOption.unavailable
                          ? ` (${c.notAvailable})`
                          : ''}
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
          <fieldset
            className="form-field field-wide request-type"
            hidden={hiddenStep('requestType')}
            aria-describedby={
              errors.requestType ? `${formId}-requestType-error` : undefined
            }
          >
            <legend>
              {c.labels.requestType} <span aria-hidden="true">*</span>
            </legend>
            {Object.entries(requestTypes).map(([id, label]) => (
              <label key={id}>
                <input
                  type="radio"
                  name="requestType"
                  value={id}
                  checked={values.requestType === id}
                  onChange={update}
                  required
                  aria-invalid={Boolean(errors.requestType)}
                />
                <span>{label}</span>
              </label>
            ))}
            {errors.requestType && (
              <small className="field-error" id={`${formId}-requestType-error`}>
                {errors.requestType}
              </small>
            )}
          </fieldset>
          {field('vehicle', 'text', true, c.vehicleHint)}
          {field(
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
          <div className="form-field field-wide" hidden={hiddenStep('message')}>
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
            <label htmlFor={`${formId}-extra-check`}>
              Leave this field blank
            </label>
            <input
              id={`${formId}-extra-check`}
              name="company_profile_url_check"
              tabIndex="-1"
              value={values.website}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  website: event.target.value,
                }))
              }
              autoComplete="new-password"
            />
          </div>
        </div>
        <div aria-live="polite" className="form-status">
          {status === 'failed' && (
            <p role="alert" className="field-error">
              {requestError || c.error}
            </p>
          )}
          {status === 'validation' && (
            <p className="field-error">{c.validationSummary}</p>
          )}
        </div>
        {stepped && step < lastStep ? (
          <div className="form-step-nav">
            {step > 1 && (
              <button
                type="button"
                className="button button-secondary"
                onClick={goToPreviousStep}
              >
                {c.back}
              </button>
            )}
            <button className="button button-primary">
              {c.next}
              <ArrowUpRight size={18} />
            </button>
          </div>
        ) : (
          <>
            {stepped && (
              <div className="form-step-nav">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={goToPreviousStep}
                >
                  {c.back}
                </button>
              </div>
            )}
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
                  {c.submit}
                  <ArrowUpRight size={18} />
                </>
              )}
            </button>
          </>
        )}
        <p className="form-privacy">
          {c.privacy} <Link to="/privacy-policy">{c.privacyLabel}</Link>
        </p>
      </form>
    </div>
  );
}

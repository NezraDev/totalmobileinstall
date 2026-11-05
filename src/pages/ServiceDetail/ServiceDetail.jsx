import { Link, Navigate, useParams } from 'react-router-dom';
import { Check, ArrowUpRight } from 'lucide-react';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import Photo from '../../components/ui/Photo';
import ServiceGrid from '../../components/ui/ServiceGrid';
import { business } from '../../content/business';
import { currentServiceId } from '../../content/services';
import { guides } from '../../content/guides';
import { ui } from '../../content/navigation';
import NotFound from '../NotFound/NotFound';
import { data } from './data';

const relatedServiceIds = {
  'windshield-repair': [
    'windshield-replacement',
    'car-window-replacement',
    'adas-calibration',
  ],
  'windshield-replacement': [
    'windshield-repair',
    'adas-calibration',
    'car-window-replacement',
  ],
  'adas-calibration': [
    'windshield-replacement',
    'windshield-repair',
    'car-window-replacement',
  ],
  'window-tinting': [
    'mobile-detailing',
    'car-window-replacement',
    'windshield-replacement',
  ],
  'mobile-detailing': [
    'window-tinting',
    'windshield-repair',
    'windshield-replacement',
  ],
  'car-window-replacement': [
    'windshield-replacement',
    'windshield-repair',
    'window-tinting',
  ],
};

export default function ServiceDetail() {
  const { slug } = useParams();
  // Production uses the 301s in public/_redirects; this covers the dev server.
  const current = currentServiceId(slug);
  if (current !== slug) return <Navigate replace to={`/services/${current}`} />;
  const service = data.records[slug];
  if (!service) return <NotFound />;
  return (
    <>
      <PageMeta {...service.seo} />
      <PageIntro
        title={`${service.name} in New Orleans`}
        description={service.unavailable ? ui.notAvailable : service.short}
      ></PageIntro>
      <section className="section page-section">
        <div className="container split">
          <Photo
            photo={service.photo}
            className={`editorial-photo${service.unavailable ? ' editorial-photo--unavailable' : ''}`}
          />
          <div className="split-copy">
            <h2>{service.detailHeading || service.name}</h2>
            <p className="body-large">{service.description}</p>
            <p className="body-large">{service.detail}</p>
            <h3>{data.includedLabel}</h3>
            <ul className="detail-list">
              {service.points.map((point) => (
                <li key={point}>
                  <Check size={18} aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className="notice">{service.modeNote}</p>
            <div className="button-row">
              {service.unavailable ? (
                <span
                  className="button button-unavailable"
                  aria-disabled="true"
                >
                  {ui.notAvailable}
                </span>
              ) : (
                <Link
                  className="button button-primary"
                  to={service.requestHref}
                >
                  {data.requestLabel}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              )}
              <a className="text-link" href={business.phoneHref}>
                {data.callLabel}
              </a>
            </div>
            <p className="form-note">{data.inquiryNote}</p>
          </div>
        </div>
      </section>
      <section className="section page-section">
        <div className="container service-guide">
          <h2>{service.guide.heading}</h2>
          {service.guide.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {service.sections?.map((section) => (
            <div className="service-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ))}
          <p>{service.areaNote}</p>
          <div className="button-row">
            <Link className="text-link" to="/service-areas">
              {data.areasLabel}
            </Link>
            <Link className="text-link" to="/faq">
              {data.faqLabel}
            </Link>
            {guides
              .filter(
                (guide) =>
                  guide.service === service.id ||
                  guide.alsoFor?.includes(service.id),
              )
              .map((guide) => (
                <Link
                  key={guide.slug}
                  className="text-link"
                  to={`/guides/${guide.slug}`}
                >
                  {`Guide: ${guide.title}`}
                </Link>
              ))}
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <h2>{data.relatedLabel}</h2>
          <ServiceGrid
            items={relatedServiceIds[slug].map((id) => data.records[id])}
          />
        </div>
      </section>
      <section className="section page-section">
        <div className="container">
          <h2>Questions about {service.name.toLowerCase()}</h2>
          <div className="faq-list">
            {service.questions.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <div>
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

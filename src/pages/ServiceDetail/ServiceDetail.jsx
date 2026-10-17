import { Link, useParams } from 'react-router-dom';
import { Check, ArrowUpRight } from 'lucide-react';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import Photo from '../../components/ui/Photo';
import ServiceGrid from '../../components/ui/ServiceGrid';
import { business } from '../../content/business';
import NotFound from '../NotFound/NotFound';
import { data } from './data';

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = data.records[slug];
  if (!service) return <NotFound />;
  return (
    <>
      <PageMeta {...service.seo} />
      <PageIntro title={service.name} description={service.short}></PageIntro>
      <section className="section page-section">
        <div className="container split">
          <Photo photo={service.photo} className="editorial-photo" />
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
              <Link className="button button-primary" to={service.requestHref}>
                {data.requestLabel}
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <a className="text-link" href={business.phoneHref}>
                {data.callLabel}
              </a>
            </div>
            <p className="form-note">{data.inquiryNote}</p>
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <h2>{data.relatedLabel}</h2>
          <ServiceGrid
            items={Object.values(data.records)
              .filter((item) => item.id !== slug)
              .slice(0, 3)}
          />
        </div>
      </section>
    </>
  );
}

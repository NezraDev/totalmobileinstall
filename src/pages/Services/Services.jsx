import { Link } from 'react-router-dom';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import ServiceGrid from '../../components/ui/ServiceGrid';
import CTA from '../../components/ui/CTA';
import { services } from '../../content/services';
import { data } from './data';

export default function Services() {
  return (
    <div className="services-overview">
      <PageMeta {...data.seo} />
      <PageIntro title={data.title} description={data.description}></PageIntro>
      <section className="section page-section">
        <div className="container">
          <h2 className="sr-only">Compare our six vehicle services</h2>
          <ServiceGrid items={data.services} />
          <div className="service-guide services-guide">
            <h2>{data.guideHeading}</h2>
            {data.guide.map(([id, text]) => (
              <p key={id}>
                <Link className="text-link" to={`/services/${id}`}>
                  {services.find((service) => service.id === id).name}
                </Link>
                {' '}
                {text}
              </p>
            ))}
            <p>{data.guideNote}</p>
          </div>
          <div className="notice">
            <h2>{data.noteTitle}</h2>
            <p>{data.note}</p>
            <Link className="text-link" to={data.actionHref}>
              {data.action}
            </Link>
          </div>
        </div>
      </section>
      <CTA />
    </div>
  );
}

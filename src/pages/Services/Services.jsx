import { Link } from 'react-router-dom';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import ServiceGrid from '../../components/ui/ServiceGrid';
import CTA from '../../components/ui/CTA';
import { data } from './data';

export default function Services() {
  return (
    <>
      <PageMeta {...data.seo} />
      <PageIntro title={data.title} description={data.description}></PageIntro>
      <section className="section page-section">
        <div className="container">
          <ServiceGrid items={data.services} />
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
    </>
  );
}

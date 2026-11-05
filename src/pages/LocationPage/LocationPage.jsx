import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import Photo from '../../components/ui/Photo';
import { locations, locationPath } from '../../content/locations';
import NotFound from '../NotFound/NotFound';
import { data } from './data';

export default function LocationPage() {
  const { slug } = useParams();
  const page = data.records[slug];
  if (!page) return <NotFound />;
  const nearby = locations.filter((location) => location.slug !== slug);
  return (
    <>
      <PageMeta {...page.seo} />
      <PageIntro title={page.title} description={page.description}></PageIntro>
      <section className="section page-section">
        <div className="container split">
          <div className="split-copy">
            <h2>{page.areaHeading}</h2>
            {page.areaParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="button-row">
              <Link className="button button-primary" to={page.requestHref}>
                {data.requestLabel}
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <a className="text-link" href={data.phoneHref}>
                {data.callLabel}
              </a>
            </div>
          </div>
          <Photo photo={page.photo} className="editorial-photo" />
        </div>
      </section>
      <section className="section page-section section-soft">
        <div className="container service-guide">
          <h2>{page.howHeading}</h2>
          {page.howParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
      <section className="section page-section">
        <div className="container">
          <h2>{page.servicesHeading}</h2>
          <p className="area-intro">{data.servicesIntro}</p>
          <div className="location-services">
            {Object.entries(page.services).map(([id, text]) => (
              <div key={id}>
                <h3>{data.serviceLinks[id]}</h3>
                <p>{text}</p>
                <Link className="text-link" to={`/services/${id}`}>
                  {`${data.serviceLinks[id]} details`}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section page-section section-soft">
        <div className="container">
          <h2>{`${data.questionsHeading} ${page.slug === 'west-bank' ? 'on the West Bank' : `in ${page.name}`}`}</h2>
          <div className="faq-list">
            {page.questions.map((item) => (
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
      <section className="section page-section">
        <div className="container">
          <h2>{page.ctaHeading}</h2>
          <p className="area-intro">{page.ctaText}</p>
          <div className="button-row">
            <Link className="button button-primary" to={page.requestHref}>
              {data.requestLabel}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <a className="text-link" href={data.phoneHref}>
              {data.callLabel}
            </a>
          </div>
          <h3 className="location-nearby">{data.nearbyHeading}</h3>
          <div className="button-row">
            {nearby.map((location) => (
              <Link
                key={location.slug}
                className="text-link"
                to={locationPath(location.slug)}
              >
                {location.linkLabel}
              </Link>
            ))}
            <Link className="text-link" to="/service-areas">
              {data.allAreasLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

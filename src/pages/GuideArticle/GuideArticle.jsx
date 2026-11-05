import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import Photo from '../../components/ui/Photo';
import { business } from '../../content/business';
import { guides } from '../../content/guides';
import NotFound from '../NotFound/NotFound';
import { data } from './data';

export default function GuideArticle() {
  const { slug } = useParams();
  const guide = data.records[slug];
  if (!guide) return <NotFound />;
  return (
    <>
      <PageMeta {...guide.seo} />
      <PageIntro title={guide.title} description={guide.lead}></PageIntro>
      <article className="section page-section">
        <div className="container service-guide guide-article">
          <Photo photo={guide.photo} className="editorial-photo guide-photo" />
          {guide.sections.map((section) => (
            <section className="service-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.list && (
                <ul className="detail-list">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.steps && (
                <ol className="guide-steps">
                  {section.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              )}
              {section.after?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
          <div className="notice guide-related">
            <h2>{data.relatedHeading}</h2>
            <p>
              Our mobile team handles{' '}
              <Link className="text-link" to={guide.serviceHref}>
                {guide.serviceName.toLowerCase()}
              </Link>{' '}
              at your home or workplace within 40 miles of New Orleans.
            </p>
            <div className="button-row">
              <Link className="button button-primary" to={guide.requestHref}>
                {data.requestLabel}
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <a className="text-link" href={business.phoneHref}>
                Call {business.phone}
              </a>
            </div>
          </div>
          <h2 className="location-nearby">{data.moreHeading}</h2>
          <div className="button-row">
            {guides
              .filter((item) => item.slug !== guide.slug)
              .map((item) => (
                <Link key={item.slug} className="text-link" to={`/guides/${item.slug}`}>
                  {item.title}
                </Link>
              ))}
            <Link className="text-link" to="/guides">
              {data.allGuidesLabel}
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

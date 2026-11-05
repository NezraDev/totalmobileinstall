import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import CTA from '../../components/ui/CTA';
import { data } from './data';

export default function Guides() {
  return (
    <>
      <PageMeta {...data.seo} />
      <PageIntro title={data.title} description={data.description}></PageIntro>
      <section className="section page-section">
        <div className="container">
          <div className="location-services">
            {data.guides.map((guide) => (
              <div key={guide.slug}>
                <h2 className="guide-card__title">{guide.title}</h2>
                <p>{guide.summary}</p>
                <Link className="text-link" to={`/guides/${guide.slug}`}>
                  {data.readLabel}: {guide.title}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
          <div className="notice area-note">
            <h2>{data.helpHeading}</h2>
            <p>{data.helpText}</p>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}

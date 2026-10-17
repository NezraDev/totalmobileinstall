import { Link } from 'react-router-dom';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import Photo from '../../components/ui/Photo';
import CTA from '../../components/ui/CTA';
import { site } from '../../config/site';
import { data } from './data';

export default function About() {
  const stats = site.showUnconfirmedClaims
    ? [...data.stats, ...data.unconfirmedStats]
    : data.stats;
  return (
    <>
      <PageMeta {...data.seo} />
      <PageIntro title={data.title} description={data.description}></PageIntro>
      <section className="section page-section">
        <div className="container split">
          <Photo photo={data.image} className="editorial-photo" />
          <div className="split-copy">
            <h2>{data.heading}</h2>
            {data.paragraphs.map((p) => (
              <p className="body-large" key={p}>
                {p}
              </p>
            ))}
            {site.showUnconfirmedClaims && <p>{data.unconfirmedParagraph}</p>}
            <div className="about-stats">
              {stats.map((stat) => (
                <div className="stat" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
            <Link className="text-link" to={data.serviceHref}>
              {data.serviceLabel}
            </Link>
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container split">
          <div className="split-copy">
            <h2>{data.approachHeading}</h2>
            {data.approach.map((item) => (
              <div key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            ))}
          </div>
          <Photo photo={data.secondImage} className="editorial-photo" />
        </div>
      </section>
      <CTA />
    </>
  );
}

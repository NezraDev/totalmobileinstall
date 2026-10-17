import { Link } from 'react-router-dom';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import Photo from '../../components/ui/Photo';
import LocationMap from '../../components/sections/LocationMap';
import { data } from './data';

export default function ServiceAreas() {
  return (
    <>
      <PageMeta {...data.seo} />
      <PageIntro title={data.title} description={data.description}></PageIntro>
      <section className="section page-section">
        <div className="container split">
          <div className="split-copy">
            <h2>{data.heading}</h2>
            {data.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className="contact-row">
              <h3>{data.locationLabel}</h3>
              <p>{data.address}</p>
            </div>
            <p className="notice">{data.modeNote}</p>
            <div className="button-row">
              <Link className="button button-primary" to={data.requestHref}>
                {data.requestLabel}
              </Link>
              <a className="text-link" href={data.phoneHref}>
                {data.callLabel}
              </a>
            </div>
          </div>
          <Photo photo={data.image} className="editorial-photo" />
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <h2>{data.mapHeading}</h2>
          <LocationMap showCoverage />
        </div>
      </section>
    </>
  );
}

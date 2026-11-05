import { Link } from 'react-router-dom';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import Photo from '../../components/ui/Photo';
import LocationMap from '../../components/sections/LocationMap';
import { locations, locationPath } from '../../content/locations';
import { data } from './data';

const alphabetical = (names) => [...names].sort((a, b) => a.localeCompare(b, 'en'));

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
      <section className="section page-section">
        <div className="container">
          <h2>{data.communitiesHeading}</h2>
          <p className="area-intro">{data.communitiesIntro}</p>
          <div className="area-parishes">
            {data.communities.map((area) => (
              <div className="area-parish" key={area.id}>
                <div className="area-parish__intro">
                  <h3>{area.name}</h3>
                  <p className="area-parish__count">{data.countLabel(area)}</p>
                  <p>{data.parishNotes[area.id]}</p>
                  {locations.some((location) =>
                    location.parishIds.includes(area.id),
                  ) && (
                    <div className="area-parish__links">
                      {locations
                        .filter((location) => location.parishIds.includes(area.id))
                        .map((location) => (
                          <Link
                            key={location.slug}
                            className="text-link"
                            to={locationPath(location.slug)}
                          >
                            {location.linkLabel}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
                <div className="area-parish__places">
                  <ul className="area-list">
                    {alphabetical(area.places).map((place) => (
                      <li key={place}>{place}</li>
                    ))}
                  </ul>
                  {area.neighborhoods && (
                    <>
                      <h4>{data.neighborhoodsLabel}</h4>
                      <ul className="area-list">
                        {alphabetical(area.neighborhoods).map((place) => (
                          <li key={place}>{place}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="notice area-note">{data.communitiesNote}</p>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <h2>{data.mapHeading}</h2>
          <LocationMap />
        </div>
      </section>
    </>
  );
}

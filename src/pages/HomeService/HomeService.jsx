import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import Photo from '../../components/ui/Photo';
import LocationMap from '../../components/sections/LocationMap';
import { data } from './data';

export default function HomeService() {
  return (
    <>
      <PageMeta {...data.seo} />
      <PageIntro title={data.title} description={data.description} />
      <section className="section page-section home-service-map-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>{data.mapHeading}</h2>
              <p>{data.mapDescription}</p>
            </div>
          </div>
          <LocationMap selectable />
          <p className="home-service-confirmation">
            A map pin helps us understand your request. Mobile coverage is
            confirmed by our team for your vehicle, service, and address.
          </p>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container split home-service-details">
          <Photo photo={data.photo} className="editorial-photo" />
          <div className="split-copy">
            <h2>{data.photoHeading}</h2>
            <p className="body-large">{data.photoCopy}</p>
            <p>{data.detailCopy}</p>
            <Link className="button button-primary" to="/book-service?mode=mobile">
              {data.requestLabel}
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

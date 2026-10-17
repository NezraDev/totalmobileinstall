import { Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import BookingForm from '../../components/sections/BookingForm';
import LocationMap from '../../components/sections/LocationMap';
import { data } from './data';

export default function Contact() {
  const b = data.business;
  return (
    <>
      <PageMeta {...data.seo} />
      <PageIntro title={data.title} description={data.description}></PageIntro>
      <section className="section page-section">
        <div className="container split">
          <div className="split-copy">
            <h2>{data.detailsHeading}</h2>
            <div className="contact-details">
              <div className="contact-row">
                <Phone aria-hidden="true" />
                <div>
                  <h3>{data.phoneLabel}</h3>
                  <a href={b.phoneHref}>{b.phone}</a>
                </div>
              </div>
              <div className="contact-row">
                <Mail aria-hidden="true" />
                <div>
                  <h3>{data.emailLabel}</h3>
                  <a href={`mailto:${b.email}`}>{b.email}</a>
                </div>
              </div>
              <div className="contact-row">
                <MapPin aria-hidden="true" />
                <div>
                  <h3>{data.addressLabel}</h3>
                  <p>{b.address}</p>
                  <a
                    className="text-link"
                    href={data.directionsHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {data.directionsLabel}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </div>
              <div className="contact-row">
                <Clock aria-hidden="true" />
                <div>
                  <h3>{data.hoursLabel}</h3>
                  {b.hours.map((hour) => (
                    <p key={hour.days}>
                      {hour.days}: {hour.time}
                    </p>
                  ))}
                  <p className="form-note">{data.timezoneNote}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2>{data.formHeading}</h2>
            <p>{data.formDescription}</p>
            <BookingForm />
          </div>
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

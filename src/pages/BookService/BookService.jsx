import { useSearchParams } from 'react-router-dom';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import Photo from '../../components/ui/Photo';
import BookingForm from '../../components/sections/BookingForm';
import { data } from './data';

export default function BookService() {
  const [params] = useSearchParams();
  return (
    <>
      <PageMeta {...data.seo} />
      <PageIntro title={data.title} description={data.description}></PageIntro>
      <section className="section page-section">
        <div className="container split booking-layout">
          <div>
            <h2>{data.formHeading}</h2>
            <p>{data.formDescription}</p>
            <BookingForm
              initialService={params.get('service') || ''}
              initialMode={params.get('mode') || ''}
              initialLocation={(params.get('location') || '').slice(0, 180)}
            />
          </div>
          <aside className="booking-aside">
            <Photo photo={data.image} className="editorial-photo" />
            <h2>{data.helpHeading}</h2>
            <p>{data.helpCopy}</p>
            <div className="contact-details">
              <a className="text-link" href={data.phoneHref}>
                {data.phone}
              </a>
              <a href={`mailto:${data.email}`}>{data.email}</a>
            </div>
            <h3>{data.hoursHeading}</h3>
            {data.hours.map((hours) => (
              <p key={hours.days}>
                {hours.days}: {hours.time}
              </p>
            ))}
            <p className="form-note">{data.timezoneNote}</p>
            <p className="notice">{data.detailingNote}</p>
          </aside>
        </div>
      </section>
    </>
  );
}

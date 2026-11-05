import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import { site } from '../../config/site';
import { guides } from '../../content/guides';
import { data } from './data';

export default function FAQ() {
  return (
    <>
      <PageMeta {...data.seo} />
      <PageIntro title={data.title} description={data.description}></PageIntro>
      <section className="section page-section">
        <div className="container">
          <div className="faq-list">
            {data.items
              .filter(
                (item) =>
                  !item.requiresConfirmation || site.showUnconfirmedClaims,
              )
              .map((item) => (
              <details key={item.id}>
                <summary>
                  {item.question}
                  <Plus size={22} aria-hidden="true" />
                </summary>
                <div>
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
          <div className="notice">
            <h2>Explore related services</h2>
            <p>
              Compare{' '}
              <Link className="text-link" to="/services/windshield-repair">
                windshield chip repair
              </Link>{' '}
              and{' '}
              <Link className="text-link" to="/services/windshield-replacement">
                windshield replacement
              </Link>
              , learn about{' '}
              <Link className="text-link" to="/services/adas-calibration">
                ADAS calibration
              </Link>
              , or see{' '}
              <Link className="text-link" to="/services/car-window-replacement">
                car window replacement
              </Link>
              .
            </p>
            <Link className="text-link" to="/service-areas">
              Check the New Orleans mobile service area
            </Link>
          </div>
          <div className="notice">
            <h2>Read our auto glass guides</h2>
            <div className="button-row">
              {guides.map((guide) => (
                <Link
                  key={guide.slug}
                  className="text-link"
                  to={`/guides/${guide.slug}`}
                >
                  {guide.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="notice">
            <h2>{data.contactTitle}</h2>
            <p>{data.contactCopy}</p>
            <Link className="text-link" to={data.contactHref}>
              {data.contactLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

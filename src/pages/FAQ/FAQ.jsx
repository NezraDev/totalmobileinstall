import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import { data } from './data';

export default function FAQ() {
  return (
    <>
      <PageMeta {...data.seo} />
      <PageIntro title={data.title} description={data.description}></PageIntro>
      <section className="section page-section">
        <div className="container">
          <div className="faq-list">
            {data.items.map((item) => (
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
            <h2>Explore the service behind your question</h2>
            <p>
              Compare{' '}
              <Link className="text-link" to="/services/auto-glass-repair">
                windshield repair
              </Link>{' '}
              and{' '}
              <Link className="text-link" to="/services/windshield-replacement">
                windshield replacement
              </Link>
              , learn about{' '}
              <Link className="text-link" to="/services/adas-calibration">
                ADAS calibration
              </Link>
              , or explore{' '}
              <Link className="text-link" to="/services/window-tinting">
                window tint options
              </Link>
              .
            </p>
            <Link className="text-link" to="/service-areas">
              Check the New Orleans mobile service area
            </Link>
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

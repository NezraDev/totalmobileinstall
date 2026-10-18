import { Link } from 'react-router-dom';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import { data } from './data';

export default function NotFound() {
  return (
    <>
      <PageMeta {...data.seo} notFound />
      <PageIntro title={data.title} description={data.description}></PageIntro>
      <section className="section page-section">
        <div className="container">
          <div className="button-row">
            <Link className="button button-primary" to={data.homeHref}>
              {data.homeLabel}
            </Link>
            <Link className="button button-secondary" to={data.serviceHref}>
              {data.serviceLabel}
            </Link>
          </div>
          <p>
            {data.help}{' '}
            <a className="text-link" href={data.phoneHref}>
              {data.phone}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

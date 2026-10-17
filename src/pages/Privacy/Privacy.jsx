import { Link } from 'react-router-dom';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import { data } from './data';

export default function Privacy() {
  return (
    <>
      <PageMeta {...data.seo} />
      <PageIntro title={data.title} description={data.description}></PageIntro>
      <section className="section page-section">
        <div className="container legal-copy">
          <div className="notice">
            <h2>{data.noticeTitle}</h2>
            <p>{data.notice}</p>
          </div>
          <h2>{data.heading}</h2>
          <p>{data.copy}</p>
          <p>
            <a href={`mailto:${data.email}`}>{data.email}</a>
          </p>
          <p>
            <a href={data.phoneHref}>{data.phone}</a>
          </p>
          <Link className="text-link" to={data.contactHref}>
            {data.contactLabel}
          </Link>
        </div>
      </section>
    </>
  );
}

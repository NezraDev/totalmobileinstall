import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import LegalDocument from '../../components/ui/LegalDocument';
import { data } from './data';

export default function Terms() {
  return (
    <>
      <PageMeta {...data.seo} />
      <PageIntro title={data.title} description={data.description}></PageIntro>
      <section className="section page-section">
        <div className="container legal-copy">
          <LegalDocument sections={data.sections} />
        </div>
      </section>
    </>
  );
}

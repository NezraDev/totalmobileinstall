import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import Photo from '../../components/ui/Photo';
import Transformations from '../../components/sections/Transformations';
import CTA from '../../components/ui/CTA';
import { data } from './data';

export default function Gallery() {
  return (
    <>
      <PageMeta {...data.seo} />
      <PageIntro title={data.title} description={data.description}></PageIntro>
      <section className="section page-section">
        <div className="container">
          <div className="section-heading">
            <h2>{data.transformationHeading}</h2>
            <p>{data.transformationDescription}</p>
          </div>
          <Transformations all />
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <div className="section-heading">
            <h2>{data.photoHeading}</h2>
            <p>{data.photoDescription}</p>
          </div>
          <div className="photo-grid">
            {data.gallery.map((item) => (
              <figure className="photo-tile" key={item.id}>
                <Photo photo={item.photo} />
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}

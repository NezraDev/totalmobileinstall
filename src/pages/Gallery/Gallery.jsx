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
      <section className="section page-section">
        <div className="container">
          <h2>{data.notesHeading}</h2>
          <p className="area-intro">{data.notesDescription}</p>
          <div className="location-services">
            {data.transformations.map((project) => (
              <div key={project.id}>
                <h3>{project.title}</h3>
                <p>
                  {project.service}. {project.caseDescription}
                </p>
              </div>
            ))}
          </div>
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
                <Photo
                  photo={item.photo}
                  sizes="(max-width: 1000px) 50vw, 33vw"
                />
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

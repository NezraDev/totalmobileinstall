import { useState } from 'react';
import { ArrowUpRight, Check, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageIntro from '../../components/ui/PageIntro';
import PageMeta from '../../components/ui/PageMeta';
import Photo from '../../components/ui/Photo';
import ProjectsMap from '../../components/sections/ProjectsMap';
import { beforeAfter } from '../../content/assets';
import { data } from './data';

export default function Projects() {
  const [selectedId, setSelectedId] = useState(beforeAfter[0]?.id);
  const selectedProject =
    beforeAfter.find((project) => project.id === selectedId) ?? beforeAfter[0];

  return (
    <>
      <PageMeta {...data.seo} />
      <PageIntro title={data.title} description={data.description} />
      <section className="section page-section projects-overview-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Completed work · New Orleans</span>
              <h2>{data.mapHeading}</h2>
              <p>{data.mapDescription}</p>
            </div>
          </div>
          <ProjectsMap selectedProject={selectedProject} />
        </div>
      </section>
      <section className="section section-soft projects-gallery-section">
        <div className="container">
          <div className="section-heading projects-gallery-heading">
            <div>
              <span className="eyebrow">Before-and-after photos</span>
              <h2>{data.projectsHeading}</h2>
              <p>{data.projectsDescription}</p>
            </div>
            <Link className="text-link" to="/gallery">
              See full gallery <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="projects-grid">
            {beforeAfter.map((project) => {
              const isSelected = project.id === selectedId;
              return (
                <article
                  className={`project-card ${isSelected ? 'is-selected' : ''}`}
                  key={project.id}
                >
                  <div className="project-card__proof">
                    <figure>
                      <Photo
                        photo={project.before}
                        sizes="(max-width: 700px) 45vw, (max-width: 980px) 23vw, 16vw"
                      />
                      <figcaption>Before</figcaption>
                    </figure>
                    <figure>
                      <Photo
                        photo={project.after}
                        sizes="(max-width: 700px) 45vw, (max-width: 980px) 23vw, 16vw"
                      />
                      <figcaption>After</figcaption>
                    </figure>
                  </div>
                  <div className="project-card__copy">
                    <div>
                      <h3>{project.title}</h3>
                      <p>{project.service}</p>
                    </div>
                    <button
                      className="project-card__select"
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedId(project.id)}
                    >
                      {isSelected ? <Check size={17} /> : <MapPin size={17} />}
                      {isSelected ? 'Selected on map' : 'Show project on map'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

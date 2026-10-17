import Photo from './Photo';
export default function PageIntro({ title, description, children, image }) {
  return (
    <section className={`page-intro ${image ? 'page-intro-photo' : ''}`}>
      <div className="container">
        <div className="page-intro-copy">
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          {children}
        </div>
        {image && <Photo photo={image} priority />}
      </div>
    </section>
  );
}

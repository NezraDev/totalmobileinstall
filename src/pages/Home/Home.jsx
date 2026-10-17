import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Phone,
  Check,
  Quote,
} from 'lucide-react';
import { data as d } from './data';
import { business } from '../../content/business';
import PageMeta from '../../components/ui/PageMeta';
import Photo from '../../components/ui/Photo';
import ServiceGrid from '../../components/ui/ServiceGrid';
import CTA from '../../components/ui/CTA';
import Slideshow from '../../components/sections/Slideshow';
import Transformations from '../../components/sections/Transformations';
import BookingForm from '../../components/sections/BookingForm';
import LocationMap from '../../components/sections/LocationMap';
export default function Home() {
  const reviews = useRef(null);
  const scrollReviews = (direction) =>
    reviews.current?.scrollBy({
      left: direction * reviews.current.clientWidth * 0.75,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  return (
    <>
      <PageMeta {...d.seo} />
      <Slideshow {...d.slideshow} hero>
        <div className="container">
          <div className="hero-layout">
            <h1>
              {d.hero.title[0]}
              <br />
              <span>{d.hero.title[1]}</span>
            </h1>
            <div className="hero-side">
              <p>{d.hero.description}</p>
              <div className="hero-actions">
                <Link className="button button-white" to="/book-service">
                  {d.hero.primary}
                  <ArrowUpRight size={19} />
                </Link>
                <a className="hero-call" href={business.phoneHref}>
                  <Phone size={17} />
                  {d.hero.secondary}
                </a>
              </div>
            </div>
          </div>
          <div className="hero-note">
            <span>{d.hero.label}</span>
            <a className="hero-scroll" href="#our-work">
              {d.hero.explore}
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </Slideshow>
      <section className="section about-preview" id="our-work">
        <div className="container split">
          <figure className="editorial-photo">
            <Photo photo={d.about.image} />
            <figcaption>{d.about.caption}</figcaption>
          </figure>
          <div className="split-copy">
            <h2>{d.about.title}</h2>
            <p className="body-large">{d.about.description}</p>
            <p>{d.about.secondary}</p>
            <Link className="text-link" to="/about">
              {d.about.action}
              <ArrowUpRight size={18} />
            </Link>
            <div className="about-stats">
              {d.about.stats.map((s) => (
                <div className="stat" key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>{d.services.title}</h2>
              <p>{d.services.description}</p>
            </div>
            <Link className="text-link" to="/services">
              {d.services.action}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <ServiceGrid />
        </div>
      </section>
      <section className="why-section">
        <div className="container split">
          <div className="split-copy">
            <h2>{d.why.title}</h2>
            <p className="body-large">{d.why.description}</p>
            <div className="why-list">
              {d.why.items.map((i) => (
                <div key={i.title}>
                  <Check size={22} />
                  <div>
                    <h3>{i.title}</h3>
                    <p>{i.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="why-photo">
            <Photo photo={d.why.image} />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>{d.transformation.title}</h2>
              <p>{d.transformation.description}</p>
            </div>
            <Link className="text-link" to="/gallery">
              {d.transformation.action}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <Transformations />
        </div>
      </section>
      <section className="section reviews-section" id="reviews">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>{d.reviews.title}</h2>
              <p>{d.reviews.description}</p>
            </div>
            <div className="reviews-controls">
              <button
                className="icon-button"
                aria-label={d.reviews.previous}
                onClick={() => scrollReviews(-1)}
              >
                <ArrowLeft size={20} />
              </button>
              <button
                className="icon-button"
                aria-label={d.reviews.next}
                onClick={() => scrollReviews(1)}
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
          <div
            className="reviews-track"
            ref={reviews}
            tabIndex="0"
            role="region"
            aria-label={d.reviews.label}
          >
            {d.reviews.items.map((r) => (
              <figure className="review" key={r.id}>
                <Quote size={32} strokeWidth={1.3} />
                <blockquote>{r.quote}</blockquote>
                <figcaption>
                  <strong>{r.name}</strong>
                  <span>{r.location}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <section className="section home-contact">
        <div className="container contact-layout">
          <div className="contact-copy">
            <h2>{d.contact.title}</h2>
            <p className="body-large">{d.contact.description}</p>
            <div className="contact-details">
              <div className="contact-row">
                <span>{d.contact.phoneLabel}</span>
                <a className="contact-phone" href={business.phoneHref}>
                  {business.phone}
                  <ArrowUpRight size={20} />
                </a>
              </div>
              <div className="contact-row">
                <span>{d.contact.emailLabel}</span>
                <a href={`mailto:${business.email}`}>{business.email}</a>
              </div>
              <div className="contact-row">
                <span>{d.contact.hoursLabel}</span>
                {business.hours.map((h) => (
                  <p key={h.days}>
                    {h.days}
                    <strong>{h.time}</strong>
                  </p>
                ))}
                <small>{d.contact.hoursNote}</small>
              </div>
            </div>
            <LocationMap />
          </div>
          <BookingForm compact />
        </div>
      </section>
      <CTA />
    </>
  );
}

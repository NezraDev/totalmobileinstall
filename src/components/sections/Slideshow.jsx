import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import Photo from '../ui/Photo';
export default function Slideshow({
  slides,
  settings,
  hero = false,
  children,
}) {
  const [index, setIndex] = useState(0),
    [paused, setPaused] = useState(settings.autoplay === false),
    [hover, setHover] = useState(false),
    [hidden, setHidden] = useState(document.hidden),
    [reduced, setReduced] = useState(
      () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
  useEffect(() => {
    const visibility = () => setHidden(document.hidden);
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motion = (e) => setReduced(e.matches);
    document.addEventListener('visibilitychange', visibility);
    query.addEventListener('change', motion);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      query.removeEventListener('change', motion);
    };
  }, []);
  const auto = !paused && !hover && !hidden && !reduced;
  useEffect(() => {
    if (!auto || slides.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      settings.interval,
    );
    return () => clearInterval(id);
  }, [auto, slides.length, settings.interval]);
  const move = (d) => {
    setIndex((i) => (i + d + slides.length) % slides.length);
    setPaused(true);
  };
  return (
    <section
      id={hero ? undefined : 'our-work'}
      className={
        hero ? 'hero photo-hero slideshow-section' : 'slideshow-section'
      }
      aria-label={settings.label}
      aria-roledescription="carousel"
      onMouseEnter={() => !hero && setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={(e) => {
        if (!e.target.closest('[data-rotation-control]')) setPaused(true);
      }}
    >
      <div className="slideshow-images">
        {slides.map((s, i) => (
          <div
            className={`slide ${i === index ? 'active' : ''}`}
            key={s.id}
            aria-hidden={i !== index}
          >
            <Photo photo={s} priority={i === 0} sizes="100vw" />
          </div>
        ))}
      </div>
      {hero && <div className="hero-blue-overlay" aria-hidden="true" />}
      {children}
      <div className="slideshow-bar">
        <div className="slide-caption" aria-live={auto ? 'off' : 'polite'}>
          <span className="caption-line" />
          <div>
            <p>{slides[index].title}</p>
            <span>{slides[index].caption}</span>
          </div>
        </div>
        <div className="slideshow-controls">
          <div className="slide-dots">
            {slides.map((s, i) => (
              <button
                key={s.id}
                aria-label={`${settings.goTo} ${s.title}`}
                aria-current={index === i ? 'true' : undefined}
                onClick={() => {
                  setIndex(i);
                  setPaused(true);
                }}
              />
            ))}
          </div>
          <button
            className="icon-button pause-control"
            data-rotation-control
            aria-label={paused || reduced ? settings.play : settings.pause}
            onClick={() => setPaused(!paused)}
            disabled={reduced}
          >
            {paused || reduced ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            className="icon-button"
            aria-label={settings.previous}
            onClick={() => move(-1)}
          >
            <ArrowLeft size={19} />
          </button>
          <button
            className="icon-button"
            aria-label={settings.next}
            onClick={() => move(1)}
          >
            <ArrowRight size={19} />
          </button>
        </div>
      </div>
    </section>
  );
}

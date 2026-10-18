import { useEffect, useRef, useState } from 'react';
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
    [focused, setFocused] = useState(false),
    [hidden, setHidden] = useState(false),
    [reduced, setReduced] = useState(false),
    [firstReady, setFirstReady] = useState(false),
    [requested, setRequested] = useState(() => new Set([0]));
  const loaded = useRef(new Set());
  const pending = useRef(null);
  const firstImage = useRef(null);

  const requestSlide = (next) => {
    setRequested((previous) => {
      if (previous.has(next)) return previous;
      return new Set([...previous, next]);
    });
  };

  const selectSlide = (next) => {
    pending.current = null;
    setPaused(true);
    requestSlide(next);
    if (loaded.current.has(next)) setIndex(next);
    else pending.current = { index: next, kind: 'manual' };
  };

  const imageReady = (slideIndex) => {
    loaded.current.add(slideIndex);
    if (slideIndex === 0) setFirstReady(true);
    if (pending.current?.index === slideIndex) {
      pending.current = null;
      setIndex(slideIndex);
    }
  };

  useEffect(() => {
    const visibility = () => setHidden(document.hidden);
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motion = (e) => setReduced(e.matches);
    visibility();
    setReduced(query.matches);
    // A prerendered priority image may finish before hydration attaches onLoad.
    if (firstImage.current?.complete && firstImage.current.naturalWidth > 0)
      imageReady(0);
    document.addEventListener('visibilitychange', visibility);
    query.addEventListener('change', motion);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      query.removeEventListener('change', motion);
    };
  }, []);
  const auto = !paused && !hover && !focused && !hidden && !reduced;

  // Fetch one photograph ahead after the first image finishes, so hidden slides
  // do not compete with the initial hero image. Keep requested images cached.
  useEffect(() => {
    if (!auto || !firstReady || slides.length < 2) return;
    const next = (index + 1) % slides.length;
    const id = window.setTimeout(
      () => requestSlide(next),
      Math.min(650, settings.interval / 4),
    );
    return () => window.clearTimeout(id);
  }, [auto, firstReady, index, slides.length, settings.interval]);

  useEffect(() => {
    if (!auto || !firstReady || slides.length < 2) return;
    const next = (index + 1) % slides.length;
    const id = window.setTimeout(() => {
      requestSlide(next);
      if (loaded.current.has(next)) setIndex(next);
      else pending.current = { index: next, kind: 'auto' };
    }, settings.interval);
    return () => {
      window.clearTimeout(id);
      if (pending.current?.kind === 'auto') pending.current = null;
    };
  }, [auto, firstReady, index, slides.length, settings.interval]);
  const move = (d) => {
    selectSlide((index + d + slides.length) % slides.length);
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
        if (hero) setFocused(true);
        else if (!e.target.closest('[data-rotation-control]')) setPaused(true);
      }}
      onBlur={(e) => {
        if (hero && !e.currentTarget.contains(e.relatedTarget))
          setFocused(false);
      }}
    >
      <div className="slideshow-images">
        {slides.map((s, i) => (
          <div
            className={`slide ${i === index ? 'active' : ''}`}
            key={s.id}
            aria-hidden={i !== index}
          >
            {requested.has(i) && (
              <Photo
                photo={s}
                priority={i === 0}
                loading="eager"
                fetchPriority={i === 0 ? 'high' : 'low'}
                sizes={
                  hero
                    ? `(max-aspect-ratio: ${s.width}/${s.height}) ${Math.ceil((s.width / s.height) * 100)}vh, 100vw`
                    : '100vw'
                }
                ref={i === 0 ? firstImage : undefined}
                onLoad={() => imageReady(i)}
              />
            )}
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
        {hero ? (
          <div className="hero-slide-progress" aria-hidden="true">
            {slides.map((s, i) => (
              <span key={s.id} className={i === index ? 'active' : ''} />
            ))}
          </div>
        ) : (
          <div className="slideshow-controls">
            <div className="slide-dots">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  aria-label={`${settings.goTo} ${s.title}`}
                  aria-current={index === i ? 'true' : undefined}
                  onClick={() => {
                    selectSlide(i);
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
        )}
      </div>
    </section>
  );
}

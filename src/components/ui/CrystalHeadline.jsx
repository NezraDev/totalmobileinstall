import { useEffect, useRef, useState } from 'react';
import './CrystalHeadline.css';

/** A readable glass face with its light effects confined to the letterforms. */
export default function CrystalHeadline({ lines }) {
  const heading = useRef(null);
  const [motionActive, setMotionActive] = useState(false);

  useEffect(() => {
    const element = heading.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    let inView = false;
    const updateMotion = () =>
      setMotionActive(inView && document.visibilityState === 'visible');
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        updateMotion();
      },
      { threshold: 0.1 },
    );

    observer.observe(element);
    document.addEventListener('visibilitychange', updateMotion);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateMotion);
    };
  }, []);

  return (
    <h1
      ref={heading}
      className="crystal-headline"
      aria-label={lines.join(' ')}
      data-motion={motionActive ? 'active' : 'paused'}
    >
      {lines.map((line, index) => (
        <span
          key={line}
          className="crystal-headline__line"
          data-text={line}
          style={{ '--crystal-line': index }}
          aria-hidden="true"
        >
          {line}
        </span>
      ))}
    </h1>
  );
}

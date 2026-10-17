import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

function displayValue(item, progress) {
  const value = Math.round(item.value * progress);
  const formatted = item.compact
    ? new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: progress === 1 ? 0 : 1,
      }).format(value)
    : value.toLocaleString('en-US');
  return `${formatted}${item.suffix || ''}`;
}

export default function MetricsStrip({ label, items }) {
  const host = useRef(null);
  const [progress, setProgress] = useState(1);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    let frame;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        setEntered(true);
        if (query.matches) return;
        const start = performance.now();
        setProgress(0);
        const tick = (now) => {
          const time = Math.min((now - start) / 1150, 1);
          setProgress(1 - Math.pow(1 - time, 3));
          if (time < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.18 },
    );
    const finish = () => {
      if (query.matches) {
        cancelAnimationFrame(frame);
        setProgress(1);
      }
    };
    query.addEventListener('change', finish);
    observer.observe(host.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      query.removeEventListener('change', finish);
    };
  }, []);

  return (
    <section
      className={`metrics-strip ${entered ? 'metrics-entered' : ''}`}
      ref={host}
      aria-label={label}
    >
      <div className="container metrics-grid">
        {items.map((item) => (
          <div className="metric" key={item.id}>
            <strong className="metric-value" aria-hidden="true">
              {displayValue(item, progress)}
            </strong>
            <span className="sr-only">{displayValue(item, 1)} </span>
            <h2>{item.label}</h2>
            {item.to ? (
              <Link className="metric-detail" to={item.to}>
                {item.detail}
                <ArrowUpRight size={14} />
              </Link>
            ) : item.href ? (
              <a className="metric-detail" href={item.href}>
                {item.detail}
                <ArrowUpRight size={14} />
              </a>
            ) : (
              <p className="metric-detail">{item.detail}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

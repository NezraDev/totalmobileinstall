import { useId, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { beforeAfter } from '../../content/assets';
import { transformationCopy as c } from '../../content/ui';
import Photo from '../ui/Photo';
export default function Transformations({ all = false }) {
  const hintId = useId();
  const [index, setIndex] = useState(0),
    [mode, setMode] = useState('before');
  const pair = beforeAfter[index];
  if (!pair) return null;
  const change = (i) => {
    setIndex((i + beforeAfter.length) % beforeAfter.length);
    setMode('before');
  };
  return (
    <div className="transformations">
      <div className="transformation-top">
        <h3>{pair.title}</h3>
        <div
          className="comparison-navigation"
          role="group"
          aria-describedby={hintId}
        >
          <button
            className="comparison-button"
            aria-label={c.previous}
            onClick={() => change(index - 1)}
          >
            <ArrowLeft size={20} />
            <span>{c.previousLabel}</span>
          </button>
          <button
            className="comparison-button"
            aria-label={c.next}
            onClick={() => change(index + 1)}
          >
            <span>{c.nextLabel}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
      <p className="comparison-hint" id={hintId}>
        {c.navigationHint}
      </p>
      <div className="comparison-tabs" role="group" aria-label={pair.title}>
        {['before', 'after'].map((m) => (
          <button
            key={m}
            aria-pressed={mode === m}
            className={mode === m ? 'selected' : ''}
            onClick={() => setMode(m)}
          >
            {c[m]}
          </button>
        ))}
      </div>
      <div className={`comparison-pair show-${mode}`} key={pair.id}>
        <figure className="before-photo">
          <Photo photo={pair.before} sizes="(max-width: 700px) 100vw, 50vw" />
          <figcaption>{c.before}</figcaption>
        </figure>
        <figure className="after-photo">
          <Photo photo={pair.after} sizes="(max-width: 700px) 100vw, 50vw" />
          <figcaption>{c.after}</figcaption>
        </figure>
      </div>
      <div className="comparison-footer">
        <p>{c.angleNote}</p>
        <span>
          {index + 1} / {beforeAfter.length}
        </span>
      </div>
      {all && (
        <div className="comparison-projects">
          {beforeAfter.map((p, i) => (
            <button
              className={i === index ? 'selected' : ''}
              key={p.id}
              onClick={() => change(i)}
              aria-pressed={i === index}
            >
              {p.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

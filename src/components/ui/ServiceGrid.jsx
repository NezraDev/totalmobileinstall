import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { services } from '../../content/services';
import { photos } from '../../content/assets';
import { ui } from '../../content/navigation';
import Photo from './Photo';
const images = {
  repair: 'glassWork',
  windshield: 'redCorvette',
  adas: 'bmw',
  tint: 'blueCorvette',
  detailing: 'porsche',
  rearGlass: 'truckRear',
};
export default function ServiceGrid({ items = services, className = '' }) {
  return (
    <div className={`service-grid ${className}`.trim()}>
      {items.map((s) => (
        <Link
          to={`/services/${s.routeId || s.id}`}
          className={`service-card${s.unavailable ? ' service-card--unavailable' : ''}`}
          key={s.id}
        >
          <div className="service-image">
            <Photo
              photo={photos[images[s.imageKey]] || photos.redCorvette}
              sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw"
            />
          </div>
          <h3>{s.name}</h3>
          <p>{s.description}</p>
          {s.unavailable ? (
            <span className="service-unavailable">{ui.notAvailable}</span>
          ) : (
            <span className="text-link">
              {ui.learnMore}
              <ArrowUpRight size={16} />
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

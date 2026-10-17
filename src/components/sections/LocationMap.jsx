import { useEffect, useRef, useState } from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';
import {
  mapConfig,
  transformCartoRequest,
  directionsUrl,
} from '../../integrations/mapConfig';
import { mapCopy as c } from '../../content/ui';
import { business } from '../../content/business';
export default function LocationMap() {
  const host = useRef(null),
    canvas = useRef(null),
    [near, setNear] = useState(false),
    [state, setState] = useState(
      mapConfig.configured ? 'waiting' : 'unconfigured',
    );
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    if (host.current) io.observe(host.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!near || !mapConfig.configured) return;
    let map,
      disposed = false;
    setState('loading');
    (async () => {
      try {
        const [maplibre, , { default: workerUrl }] = await Promise.all([
          import('maplibre-gl'),
          import('maplibre-gl/dist/maplibre-gl.css'),
          import('maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'),
        ]);
        maplibre.setWorkerUrl(workerUrl);
        if (disposed) return;
        map = new maplibre.Map({
          container: canvas.current,
          style: mapConfig.styleUrl,
          center: mapConfig.coordinates,
          zoom: mapConfig.zoom,
          attributionControl: false,
          transformRequest: transformCartoRequest,
        });
        map.addControl(
          new maplibre.AttributionControl({
            compact: false,
            customAttribution: mapConfig.attribution,
          }),
        );
        map.addControl(
          new maplibre.NavigationControl({ showCompass: false }),
          'top-right',
        );
        new maplibre.Marker({ color: '#011A82' })
          .setLngLat(mapConfig.coordinates)
          .addTo(map);
        map.on('load', () => {
          if (!disposed) setState('ready');
        });
        map.on('error', () => {
          if (!disposed) {
            setState('error');
            map?.remove();
            map = null;
          }
        });
      } catch {
        map?.remove();
        if (!disposed) setState('error');
      }
    })();
    return () => {
      disposed = true;
      map?.remove();
    };
  }, [near]);
  return (
    <div
      className={`location-map ${state === 'ready' ? 'map-ready' : ''}`}
      ref={host}
    >
      <div
        ref={canvas}
        className="map-canvas"
        aria-label={`${business.name} location map`}
        role="region"
      />
      {state !== 'ready' && (
        <div className="map-fallback">
          <MapPin size={36} strokeWidth={1.4} />
          <h3>{state === 'loading' ? c.loading : c.unavailable}</h3>
          <p>{business.address}</p>
          <span>{state === 'error' ? c.error : c.fallback}</span>
        </div>
      )}
      <div className="map-address">
        <div>
          <strong>{business.name}</strong>
          <span>{business.address}</span>
        </div>
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
          {c.directions}
          <ArrowUpRight size={18} />
        </a>
      </div>
    </div>
  );
}

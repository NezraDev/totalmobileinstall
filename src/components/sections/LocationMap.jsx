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
    [provider, setProvider] = useState(
      mapConfig.cartoConfigured ? 'carto' : 'osm',
    ),
    [state, setState] = useState('waiting');
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setNear(true);
      return;
    }
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
    if (!near || provider !== 'carto') return;
    let map,
      disposed = false;
    let loadTimeout;
    const useEmbed = () => {
      if (disposed) return;
      window.clearTimeout(loadTimeout);
      map?.remove();
      map = null;
      setState('loading');
      setProvider('osm');
    };
    setState('loading');
    loadTimeout = window.setTimeout(useEmbed, 15000);
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
          if (!disposed) {
            window.clearTimeout(loadTimeout);
            setState('ready');
          }
        });
        map.on('error', useEmbed);
      } catch {
        useEmbed();
      }
    })();
    return () => {
      disposed = true;
      window.clearTimeout(loadTimeout);
      map?.remove();
    };
  }, [near, provider]);
  return (
    <div className="location-map map-ready" ref={host}>
      {provider === 'carto' && (
        <div
          ref={canvas}
          className="map-canvas"
          aria-label={`${business.name} location map`}
          role="region"
        />
      )}
      {near && provider === 'osm' && state !== 'error' && (
        <iframe
          className="map-embed"
          title={`${business.name} shop location at ${business.address}`}
          src={mapConfig.embedUrl}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setState('ready')}
          onError={() => setState('error')}
        />
      )}
      {state !== 'ready' && (
        <div className={`map-fallback ${state === 'error' ? 'map-error' : ''}`}>
          <MapPin size={36} strokeWidth={1.4} />
          <h3>{state === 'error' ? c.unavailable : c.loading}</h3>
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

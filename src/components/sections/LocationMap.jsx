import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, LoaderCircle, MapPin } from 'lucide-react';
import {
  mapConfig,
  transformCartoRequest,
  createServiceRadiusFeature,
  serviceRadiusBounds,
  serviceRadiusMiles,
} from '../../integrations/mapConfig';
import { mapCopy as c } from '../../content/ui';
import { business } from '../../content/business';

// Shows the 40-mile mobile coverage area only. There is no pin, popup, or
// coordinates readout, so the map never pinpoints the business base.
export default function LocationMap() {
  const host = useRef(null);
  const canvas = useRef(null);
  const [near, setNear] = useState(false);
  const [state, setState] = useState('waiting');

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return;
    let map;
    let attributionControl;
    let loadTimeout;
    let disposed = false;
    let usingCarto = mapConfig.cartoConfigured;
    const serviceRadius = createServiceRadiusFeature(mapConfig.coordinates);

    setState('loading');

    const showError = () => {
      if (!disposed) setState('error');
    };

    (async () => {
      try {
        const [maplibre, , { default: workerUrl }] = await Promise.all([
          import('maplibre-gl'),
          import('maplibre-gl/dist/maplibre-gl.css'),
          import('maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'),
        ]);
        maplibre.setWorkerUrl(workerUrl);
        if (disposed || !canvas.current) return;

        map = new maplibre.Map({
          container: canvas.current,
          style: structuredClone(
            usingCarto ? mapConfig.cartoStyle : mapConfig.osmStyle,
          ),
          // Opens on the whole coverage area, never a street-level view.
          bounds: serviceRadiusBounds(serviceRadius),
          fitBoundsOptions: { padding: 36, maxZoom: 8.5 },
          attributionControl: false,
          maxPitch: 0,
          transformRequest: transformCartoRequest,
        });

        const setAttribution = (content) => {
          if (attributionControl) map.removeControl(attributionControl);
          attributionControl = new maplibre.AttributionControl({
            compact: false,
            customAttribution: content,
          });
          map.addControl(attributionControl, 'bottom-right');
        };
        setAttribution(
          usingCarto ? mapConfig.cartoAttribution : mapConfig.osmAttribution,
        );
        map.addControl(
          new maplibre.NavigationControl({ showCompass: false }),
          'top-right',
        );
        map.addControl(
          new maplibre.ScaleControl({ unit: 'imperial' }),
          'bottom-left',
        );

        const switchToOsm = () => {
          if (disposed || !usingCarto) return;
          usingCarto = false;
          setState('loading');
          setAttribution(mapConfig.osmAttribution);
          map.setStyle(structuredClone(mapConfig.osmStyle));
          window.clearTimeout(loadTimeout);
          loadTimeout = window.setTimeout(showError, 15000);
        };

        map.on('style.load', () => {
          if (disposed) return;
          if (!map.getSource('tmi-service-radius')) {
            map.addSource('tmi-service-radius', {
              type: 'geojson',
              data: serviceRadius,
            });
          }
          if (!map.getLayer('tmi-service-radius-fill')) {
            map.addLayer({
              id: 'tmi-service-radius-fill',
              type: 'fill',
              source: 'tmi-service-radius',
              paint: {
                'fill-color': '#1745c8',
                'fill-opacity': 0.16,
              },
            });
          }
          if (!map.getLayer('tmi-service-radius-outline')) {
            map.addLayer({
              id: 'tmi-service-radius-outline',
              type: 'line',
              source: 'tmi-service-radius',
              paint: {
                'line-color': '#123db8',
                'line-opacity': 0.9,
                'line-width': 2.5,
              },
            });
          }
          window.clearTimeout(loadTimeout);
          setState('ready');
        });
        map.on('error', (event) => {
          if (usingCarto && [401, 403].includes(event.error?.status))
            switchToOsm();
        });

        loadTimeout = window.setTimeout(() => {
          if (usingCarto) switchToOsm();
          else showError();
        }, 15000);
      } catch {
        showError();
      }
    })();

    return () => {
      disposed = true;
      window.clearTimeout(loadTimeout);
      map?.remove();
    };
  }, [near]);

  return (
    <div className="location-map map-ready location-map--coverage" ref={host}>
      <div
        ref={canvas}
        className="map-canvas"
        aria-label={`${serviceRadiusMiles}-mile mobile service radius around ${business.address}`}
        role="region"
      />
      <div className="map-coverage-legend">
        <span className="map-coverage-legend__swatch" aria-hidden="true" />
        <span>
          <strong>{serviceRadiusMiles}-mile mobile service radius</strong>
          <small>ZIP code availability is confirmed with each request.</small>
        </span>
      </div>
      {state === 'loading' && (
        <div className="map-loading" role="status">
          <LoaderCircle size={18} className="spin" />
          {c.loading}
        </div>
      )}
      {state === 'error' && (
        <div className="map-fallback" role="status">
          <MapPin size={34} strokeWidth={1.5} />
          <strong>{c.unavailable}</strong>
          <span>
            {`Mobile service within ${serviceRadiusMiles} miles of ${business.address}.`}
          </span>
          <a
            href={mapConfig.embedUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in OpenStreetMap
            <ArrowUpRight size={16} />
          </a>
        </div>
      )}
      <div className="map-address">
        <div>
          <strong>{business.name}</strong>
          <span>{business.address}</span>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, LoaderCircle, MapPin } from 'lucide-react';
import {
  mapConfig,
  directionsUrl,
  transformCartoRequest,
  createServiceRadiusFeature,
  serviceRadiusBounds,
  serviceRadiusMiles,
} from '../../integrations/mapConfig';
import { mapCopy as c } from '../../content/ui';
import { business } from '../../content/business';

function formatCoordinates([longitude, latitude]) {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}

export default function LocationMap({ showCoverage = false }) {
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
    let marker;
    let markerRoot;
    let popup;
    let attributionControl;
    let loadTimeout;
    let disposed = false;
    let usingCarto = mapConfig.cartoConfigured;
    let coverageFitted = false;
    const serviceRadius = showCoverage
      ? createServiceRadiusFeature(mapConfig.coordinates)
      : null;

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
          center: mapConfig.coordinates,
          zoom: mapConfig.zoom,
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

        const markerElement = document.createElement('button');
        markerElement.type = 'button';
        markerElement.className = 'shop-map-marker';
        markerElement.setAttribute(
          'aria-label',
          `Map marker for ${business.name}`,
        );
        markerElement.title = `${business.name} shop location`;
        markerRoot = createRoot(markerElement);
        markerRoot.render(
          <MapPin size={30} fill="currentColor" aria-hidden="true" />,
        );

        const popupContent = document.createElement('div');
        popupContent.className = 'map-popup';
        const popupTitle = document.createElement('strong');
        popupTitle.textContent = business.name;
        const popupDescription = document.createElement('span');
        popupDescription.textContent = business.address;
        const popupCoordinates = document.createElement('small');
        popupCoordinates.textContent = formatCoordinates(mapConfig.coordinates);
        popupContent.append(popupTitle, popupDescription, popupCoordinates);
        popup = new maplibre.Popup({
          closeButton: true,
          closeOnClick: false,
          maxWidth: '280px',
          offset: 28,
        }).setDOMContent(popupContent);

        marker = new maplibre.Marker({
          element: markerElement,
          anchor: 'bottom',
        })
          .setLngLat(mapConfig.coordinates)
          .setPopup(popup)
          .addTo(map);

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
          if (serviceRadius) {
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
            if (!coverageFitted) {
              map.fitBounds(serviceRadiusBounds(serviceRadius), {
                padding: { top: 36, right: 36, bottom: 36, left: 36 },
                maxZoom: 8.5,
                duration: 0,
              });
              coverageFitted = true;
            }
          }
          window.clearTimeout(loadTimeout);
          setState('ready');
          if (!popup.isOpen()) popup.addTo(map);
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
      popup?.remove();
      marker?.remove();
      markerRoot?.unmount();
      map?.remove();
    };
  }, [near, showCoverage]);

  return (
    <div
      className={`location-map map-ready${showCoverage ? ' location-map--coverage' : ''}`}
      ref={host}
    >
      <div
        ref={canvas}
        className="map-canvas"
        aria-label={
          showCoverage
            ? `${serviceRadiusMiles}-mile mobile service radius around ${business.name}`
            : `${business.name} shop location map`
        }
        role="region"
      />
      {showCoverage && (
        <div className="map-coverage-legend">
          <span className="map-coverage-legend__swatch" aria-hidden="true" />
          <span>
            <strong>{serviceRadiusMiles}-mile mobile service radius</strong>
            <small>ZIP code availability is confirmed with each request.</small>
          </span>
        </div>
      )}
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
          <span>{business.address}</span>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
            {c.directions}
            <ArrowUpRight size={16} />
          </a>
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
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
          {c.directions}
          <ArrowUpRight size={18} />
        </a>
      </div>
    </div>
  );
}

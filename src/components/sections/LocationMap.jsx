import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  CarFront,
  House,
  LoaderCircle,
  MapPin,
} from 'lucide-react';
import {
  mapConfig,
  directionsUrl,
  transformCartoRequest,
} from '../../integrations/mapConfig';
import { mapCopy as c } from '../../content/ui';
import { business } from '../../content/business';

function formatCoordinates([longitude, latitude]) {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}

export default function LocationMap({ selectable = false }) {
  const host = useRef(null);
  const canvas = useRef(null);
  const [near, setNear] = useState(false);
  const [state, setState] = useState('waiting');
  const [coordinates, setCoordinates] = useState(mapConfig.coordinates);
  const displayCoordinates = formatCoordinates(coordinates);
  const bookingParams = new URLSearchParams({
    mode: 'mobile',
    location: displayCoordinates,
  });

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
    let moveWithKeyboard;
    let loadTimeout;
    let disposed = false;
    let usingCarto = mapConfig.cartoConfigured;

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
          zoom: selectable ? mapConfig.selectableZoom : mapConfig.zoom,
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
        markerElement.className = 'home-service-marker';
        markerElement.setAttribute(
          'aria-label',
          selectable
            ? 'Selected home service location. Drag to move it or use arrow keys.'
            : `Map marker for ${business.name}, with home and car icon`,
        );
        markerElement.title = selectable
          ? 'Drag to choose your home service location'
          : `${business.name} shop location`;
        markerRoot = createRoot(markerElement);
        markerRoot.render(
          <span className="home-service-marker__icons" aria-hidden="true">
            <House size={18} strokeWidth={2.2} />
            <CarFront size={19} strokeWidth={2.2} />
          </span>,
        );

        const popupContent = document.createElement('div');
        popupContent.className = 'map-popup';
        const popupTitle = document.createElement('strong');
        popupTitle.textContent = selectable
          ? 'Home service location'
          : business.name;
        const popupDescription = document.createElement('span');
        popupDescription.textContent = selectable
          ? 'Drag this pin or tap the map to choose where your vehicle will be.'
          : business.address;
        const popupCoordinates = document.createElement('small');
        popupCoordinates.textContent = formatCoordinates(mapConfig.coordinates);
        popupContent.append(popupTitle, popupDescription, popupCoordinates);

        popup = new maplibre.Popup({
          closeButton: true,
          closeOnClick: false,
          maxWidth: '280px',
          offset: 32,
        }).setDOMContent(popupContent);

        marker = new maplibre.Marker({
          element: markerElement,
          anchor: 'bottom',
          draggable: selectable,
        })
          .setLngLat(mapConfig.coordinates)
          .setPopup(popup)
          .addTo(map);

        const updateCoordinates = (next) => {
          const normalized = [Number(next[0]), Number(next[1])];
          popupCoordinates.textContent = formatCoordinates(normalized);
          setCoordinates(normalized);
        };

        if (selectable) {
          map.on('click', (event) => {
            const next = [event.lngLat.lng, event.lngLat.lat];
            marker.setLngLat(next);
            updateCoordinates(next);
            if (!popup.isOpen()) popup.addTo(map);
          });
          marker.on('drag', () => {
            const point = marker.getLngLat();
            updateCoordinates([point.lng, point.lat]);
          });
          moveWithKeyboard = (event) => {
            const changes = {
              ArrowLeft: [-1, 0],
              ArrowRight: [1, 0],
              ArrowUp: [0, 1],
              ArrowDown: [0, -1],
            };
            const delta = changes[event.key];
            if (!delta) return;
            event.preventDefault();
            const point = marker.getLngLat();
            const step = event.shiftKey ? 0.001 : 0.0001;
            const next = [
              point.lng + delta[0] * step,
              point.lat + delta[1] * step,
            ];
            marker.setLngLat(next);
            updateCoordinates(next);
            map.easeTo({ center: next, duration: 180 });
            if (!popup.isOpen()) popup.addTo(map);
          };
          markerElement.addEventListener('keydown', moveWithKeyboard);
          marker.on('dragend', () => {
            const point = marker.getLngLat();
            updateCoordinates([point.lng, point.lat]);
          });
        }

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
      if (moveWithKeyboard && marker?.getElement())
        marker.getElement().removeEventListener('keydown', moveWithKeyboard);
      marker?.remove();
      markerRoot?.unmount();
      map?.remove();
    };
  }, [near, selectable]);

  return (
    <>
      <div
        className={`location-map map-ready ${selectable ? 'map-selectable' : ''}`}
        ref={host}
      >
        <div
          ref={canvas}
          className="map-canvas"
          aria-label={
            selectable
              ? 'Interactive map. Move the home and car pin to set a preferred service location.'
              : `${business.name} location map`
          }
          role="region"
        />
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
        {!selectable && (
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
        )}
      </div>
      {selectable && (
        <div className="home-service-map-action">
          <div>
            <strong>Selected map pin</strong>
            <span>{displayCoordinates}</span>
            <small>
              Add a street address or ZIP code to your request so our team can
              confirm the visit.
            </small>
          </div>
          <Link
            className="button button-primary"
            to={`/book-service?${bookingParams.toString()}`}
          >
            Use this location
            <ArrowUpRight size={18} />
          </Link>
        </div>
      )}
    </>
  );
}

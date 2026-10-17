import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, CarFront, LoaderCircle } from 'lucide-react';
import { beforeAfter } from '../../content/assets';
import { mapConfig, transformCartoRequest } from '../../integrations/mapConfig';

const overviewCenter = [-90.0715, 29.9511];
const overviewZoom = 10.2;
const openStreetMapUrl = `https://www.openstreetmap.org/?mlat=${overviewCenter[1]}&mlon=${overviewCenter[0]}#map=11/${overviewCenter[1]}/${overviewCenter[0]}`;

function ProjectPopup({ project }) {
  return (
    <div className="project-map-popup">
      <span className="project-map-popup__eyebrow">
        Selected project · New Orleans portfolio
      </span>
      <strong>{project.title}</strong>
      <span className="project-map-popup__service">{project.service}</span>
      <div className="project-map-popup__proof">
        <figure>
          <img src={project.before.srcSmall} alt={project.before.alt} />
          <figcaption>Before</figcaption>
        </figure>
        <figure>
          <img src={project.after.srcSmall} alt={project.after.alt} />
          <figcaption>After</figcaption>
        </figure>
      </div>
      <small>Portfolio area only. Exact client locations are not shown.</small>
    </div>
  );
}

export default function ProjectsMap({ selectedProject }) {
  const host = useRef(null);
  const canvas = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const popupRootRef = useRef(null);
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
      { rootMargin: '240px' },
    );
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    popupRootRef.current?.render(<ProjectPopup project={selectedProject} />);
    if (mapRef.current && popupRef.current) {
      mapRef.current.easeTo({
        center: overviewCenter,
        zoom: overviewZoom,
        duration: 420,
      });
      popupRef.current.setLngLat(overviewCenter).addTo(mapRef.current);
    }
  }, [selectedProject, state]);

  useEffect(() => {
    if (!near) return;
    let map;
    let marker;
    let markerRoot;
    let popup;
    let popupRoot;
    let attributionControl;
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
          center: overviewCenter,
          zoom: overviewZoom,
          attributionControl: false,
          maxPitch: 0,
          transformRequest: transformCartoRequest,
        });
        mapRef.current = map;

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
        markerElement.className = 'projects-map-marker';
        markerElement.setAttribute(
          'aria-label',
          `Open selected project proof from ${beforeAfter.length} supplied projects in the New Orleans portfolio`,
        );
        markerElement.title = 'Open selected project proof';
        markerRoot = createRoot(markerElement);
        markerRoot.render(
          <>
            <CarFront size={23} strokeWidth={2.1} aria-hidden="true" />
            <span>{beforeAfter.length}</span>
          </>,
        );

        const popupHost = document.createElement('div');
        popupRoot = createRoot(popupHost);
        popupRootRef.current = popupRoot;
        popupRoot.render(<ProjectPopup project={selectedProject} />);
        popup = new maplibre.Popup({
          closeButton: true,
          closeOnClick: false,
          maxWidth: '360px',
          offset: 38,
        }).setDOMContent(popupHost);
        popupRef.current = popup;

        marker = new maplibre.Marker({
          element: markerElement,
          anchor: 'bottom',
        })
          .setLngLat(overviewCenter)
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

        const showSelectedProject = () => {
          if (disposed) return;
          window.clearTimeout(loadTimeout);
          map.resize();
          setState('ready');
          popup.setLngLat(overviewCenter).addTo(map);
        };
        map.on('style.load', showSelectedProject);
        map.once('load', showSelectedProject);
        markerElement.addEventListener('click', showSelectedProject);
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
      popupRoot?.unmount();
      marker?.remove();
      markerRoot?.unmount();
      map?.remove();
      mapRef.current = null;
      popupRef.current = null;
      popupRootRef.current = null;
    };
  }, [near]);

  return (
    <div className="projects-map-shell">
      <div className="projects-map" ref={host} data-map-state={state}>
        <div
          ref={canvas}
          className="projects-map__canvas"
          aria-label="New Orleans overview map showing the generalized area for Total Mobile Install portfolio projects"
          role="region"
        />
        {state === 'loading' && (
          <div className="map-loading" role="status">
            <LoaderCircle size={18} className="spin" />
            Loading project map…
          </div>
        )}
        {state === 'error' && (
          <div className="projects-map__fallback" role="status">
            <CarFront size={30} aria-hidden="true" />
            <strong>Explore the New Orleans portfolio area</strong>
            <span>The project proof remains available below the map.</span>
            <a
              href={openStreetMapUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open this area in OpenStreetMap <ArrowUpRight size={16} />
            </a>
          </div>
        )}
        <div className="projects-map__label">
          <span className="projects-map__label-icon">
            <CarFront size={17} />
          </span>
          <span>
            <strong>New Orleans portfolio area</strong>
            <small>{beforeAfter.length} photo-documented projects</small>
          </span>
        </div>
      </div>
      <p className="projects-map__privacy">
        This is a generalized portfolio marker, not an individual client
        location. Client names and exact addresses are kept private.
      </p>
    </div>
  );
}

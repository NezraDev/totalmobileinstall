import { business } from '../content/business';
export const businessAddress = business.address;

// Current shop pin supplied by the business on October 17, 2026.
export const verifiedShopCoordinates = Object.freeze([
  business.geo.longitude,
  business.geo.latitude,
]);

const cartoApiKey = (import.meta.env.VITE_CARTO_API_KEY || '').trim();
const longitudeText = (import.meta.env.VITE_MAP_LONGITUDE || '').trim();
const latitudeText = (import.meta.env.VITE_MAP_LATITUDE || '').trim();
const longitude = Number(longitudeText);
const latitude = Number(latitudeText);
const validCoordinates =
  longitudeText !== '' &&
  latitudeText !== '' &&
  Number.isFinite(longitude) &&
  Number.isFinite(latitude) &&
  longitude >= -180 &&
  longitude <= 180 &&
  latitude >= -90 &&
  latitude <= 90;

// A future deployment can override both coordinates together. Incomplete or
// invalid overrides keep the confirmed shop pin, never a zero/approximate pin.
const coordinates = validCoordinates
  ? [longitude, latitude]
  : verifiedShopCoordinates;

const embedUrl = new URL('https://www.openstreetmap.org/export/embed.html');
embedUrl.searchParams.set(
  'bbox',
  [
    coordinates[0] - 0.008,
    coordinates[1] - 0.005,
    coordinates[0] + 0.008,
    coordinates[1] + 0.005,
  ].join(','),
);
embedUrl.searchParams.set('layer', 'mapnik');
embedUrl.searchParams.set('marker', `${coordinates[1]},${coordinates[0]}`);

function rasterStyle(tileUrl) {
  return {
    version: 8,
    sources: {
      basemap: {
        type: 'raster',
        tiles: [tileUrl],
        tileSize: 256,
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: 'basemap-raster',
        type: 'raster',
        source: 'basemap',
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  };
}

const cartoAttribution =
  '<a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">&copy; CARTO</a> &middot; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">&copy; OpenStreetMap contributors</a>';
const osmAttribution =
  '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">&copy; OpenStreetMap contributors</a>';
const cartoTileUrl =
  'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';

/** Add the public browser key only to CARTO Basemaps requests. */
export function transformCartoRequest(url) {
  try {
    const requestUrl = new URL(url);
    if (requestUrl.hostname !== 'basemaps.cartocdn.com' || !cartoApiKey)
      return { url };
    const hashIndex = url.indexOf('#');
    const suffix = hashIndex >= 0 ? url.slice(hashIndex) : '';
    const target = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
    const keyValue = encodeURIComponent(cartoApiKey);
    let secured;
    if (/[?&]key=[^&]*/.test(target))
      secured = target.replace(
        /([?&]key=)[^&]*/,
        (_match, prefix) => `${prefix}${keyValue}`,
      );
    else
      secured = `${target}${target.includes('?') ? '&' : '?'}key=${keyValue}`;
    return { url: `${secured}${suffix}` };
  } catch {
    return { url };
  }
}

export const directionsUrl = 'https://maps.app.goo.gl/RwCt2X5jmooMkDi8A';

export const mapConfig = Object.freeze({
  configured: true,
  coordinates,
  cartoConfigured: Boolean(cartoApiKey),
  cartoStyle: rasterStyle(cartoTileUrl),
  osmStyle: rasterStyle('https://tile.openstreetmap.org/{z}/{x}/{y}.png'),
  cartoAttribution,
  osmAttribution,
  attribution: cartoAttribution,
  embedUrl: embedUrl.toString(),
  zoom: 14.5,
  address: businessAddress,
  directionsUrl,
});

export const serviceRadiusMiles = 40;
export const serviceRadiusMeters = serviceRadiusMiles * 1609.344;

/** Build a geodesic GeoJSON circle around the selected shop coordinates. */
export function createServiceRadiusFeature(
  center = mapConfig.coordinates,
  radiusMeters = serviceRadiusMeters,
  steps = 96,
) {
  const earthRadiusMeters = 6371008.8;
  const [longitude, latitude] = center;
  const latitudeRadians = (latitude * Math.PI) / 180;
  const longitudeRadians = (longitude * Math.PI) / 180;
  const angularDistance = radiusMeters / earthRadiusMeters;
  const ring = [];

  for (let step = 0; step <= steps; step += 1) {
    const bearing = (step / steps) * Math.PI * 2;
    const destinationLatitude = Math.asin(
      Math.sin(latitudeRadians) * Math.cos(angularDistance) +
        Math.cos(latitudeRadians) *
          Math.sin(angularDistance) *
          Math.cos(bearing),
    );
    const destinationLongitude =
      longitudeRadians +
      Math.atan2(
        Math.sin(bearing) *
          Math.sin(angularDistance) *
          Math.cos(latitudeRadians),
        Math.cos(angularDistance) -
          Math.sin(latitudeRadians) * Math.sin(destinationLatitude),
      );
    const normalizedLongitude =
      ((((destinationLongitude + Math.PI) % (Math.PI * 2)) + Math.PI * 2) %
        (Math.PI * 2)) -
      Math.PI;
    ring.push([
      (normalizedLongitude * 180) / Math.PI,
      (destinationLatitude * 180) / Math.PI,
    ]);
  }

  return {
    type: 'Feature',
    properties: {
      radiusMiles: serviceRadiusMiles,
      radiusMeters,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [ring],
    },
  };
}

export function serviceRadiusBounds(feature) {
  const ring = feature.geometry.coordinates[0];
  const bounds = [Infinity, Infinity, -Infinity, -Infinity];
  for (const [longitude, latitude] of ring) {
    bounds[0] = Math.min(bounds[0], longitude);
    bounds[1] = Math.min(bounds[1], latitude);
    bounds[2] = Math.max(bounds[2], longitude);
    bounds[3] = Math.max(bounds[3], latitude);
  }
  return [
    [bounds[0], bounds[1]],
    [bounds[2], bounds[3]],
  ];
}

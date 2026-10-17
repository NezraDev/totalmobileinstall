export const businessAddress = '5800 Morrison Rd, New Orleans, LA 70126';

// Exact shop pin supplied by the business on October 17, 2026.
export const verifiedShopCoordinates = Object.freeze([
  -90.02540735889556, 30.025471630757778,
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
    else secured = `${target}${target.includes('?') ? '&' : '?'}key=${keyValue}`;
    return { url: `${secured}${suffix}` };
  } catch {
    return { url };
  }
}

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${coordinates[1]},${coordinates[0]}`)}`;

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
  selectableZoom: 12.8,
  address: businessAddress,
  directionsUrl,
});

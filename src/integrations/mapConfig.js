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
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${coordinates[1]},${coordinates[0]}`)}`;
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

/** Apply only to CARTO requests: never forward the public browser key to another host. */
export function transformCartoRequest(url) {
  try {
    const requestUrl = new URL(url);
    if (requestUrl.hostname === 'basemaps.cartocdn.com' && cartoApiKey) {
      requestUrl.searchParams.set('key', cartoApiKey);
      return { url: requestUrl.toString() };
    }
  } catch {
    // Let MapLibre resolve any provider-relative URL normally.
  }
  return { url };
}

export const mapConfig = Object.freeze({
  configured: true,
  cartoConfigured: Boolean(cartoApiKey),
  coordinates,
  embedUrl: embedUrl.toString(),
  styleUrl: transformCartoRequest(
    'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  ).url,
  zoom: 14.5,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
  address: businessAddress,
  directionsUrl,
});

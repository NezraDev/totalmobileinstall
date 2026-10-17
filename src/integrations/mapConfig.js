export const businessAddress = '5800 Morrison Rd, New Orleans, LA 70126';
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(businessAddress)}`;

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
  configured: Boolean(cartoApiKey && validCoordinates),
  coordinates: validCoordinates ? [longitude, latitude] : null,
  styleUrl: transformCartoRequest(
    'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  ).url,
  zoom: 14.5,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
  address: businessAddress,
  directionsUrl,
});

// Research only. Census matches the street address but calculates a position along
// the street range; this is not a verified rooftop, parking entrance, or shop pin.
// Leave the production map unconfigured until the business verifies its exact pin.
export const geocodingResearch = Object.freeze({
  matchedAddress: '5800 MORRISON RD, NEW ORLEANS, LA, 70126',
  approximateCoordinates: [-90.025590997511, 30.025655914516],
  precision: 'Census MAF/TIGER address-range interpolation',
  checkedOn: '2026-10-17',
  source:
    'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=5800%20Morrison%20Rd%2C%20New%20Orleans%2C%20LA%2070126&benchmark=Public_AR_Current&format=json',
});

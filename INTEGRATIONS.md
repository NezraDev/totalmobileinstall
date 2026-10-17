# Integration and deployment setup

Verified against official documentation on October 17, 2026. This project is a static React/Vite frontend. No email server or serverless function is included.

## Public configuration

Copy `.env.example` to `.env.local`, fill in confirmed values, and rebuild. Vite exposes `VITE_` values to visitors and replaces them at build time. Never put a Resend sending credential in any frontend environment variable, content file, or browser SDK. [Vite environment variables](https://vite.dev/guide/env-and-mode#env-variables)

| Variable | Purpose |
| --- | --- |
| `VITE_CONTACT_ENDPOINT` | HTTPS URL for the separately managed contact endpoint |
| `VITE_CARTO_API_KEY` | Public, hostname-restricted CARTO Basemaps browser key |
| `VITE_MAP_LONGITUDE` and `VITE_MAP_LATITUDE` | Business-verified map marker coordinates |
| `VITE_SITE_URL` | Confirmed canonical website origin |

All photo and brand files live in `public/images`. Reference them as `/images/...`, without `/public`. Vite serves the public directory at the root and copies it unchanged into the production output. [Vite public directory](https://vite.dev/guide/assets#the-public-directory)

## External Resend endpoint contract

`src/integrations/emailClient.js` sends one JSON `POST` to `VITE_CONTACT_ENDPOINT`. The browser sends no credential, arbitrary recipient, or sender. The endpoint must accept `Content-Type: application/json`, handle `OPTIONS` for the final website origin, and return JSON. Use HTTPS in production. Do not accept arbitrary CORS origins.

```json
{
  "schemaVersion": 1,
  "fullName": "Customer name",
  "phone": "Customer phone",
  "email": "Customer email",
  "serviceId": "Service slug from the website",
  "detailType": "",
  "vehicle": "Year, make, model",
  "serviceMode": "mobile",
  "location": "Service address or ZIP code",
  "preferredDate": "2026-11-02",
  "message": "Optional description",
  "website": ""
}
```

- Required: full name, phone, email, service ID, vehicle, and service preference. Location is required for `mobile`. `detailType` is required only for `mobile-detailing` and otherwise empty. Date and message are optional. `website` is an invisible anti-spam field and must remain empty for normal visitors.
- Endpoint must validate field types, lengths, allowed service slugs, eligible service modes, date validity, and mobile location. Browser validation only assists the visitor.
- Detailing `detailType` values: `interior`, `hand-wash`, `paint-correction`, `polishing`, or `ceramic-coating`. The endpoint must reject a missing or unknown detailing value and reject mobile requests for `paint-correction`, `polishing`, or `ceramic-coating`. Mobile detailing is limited to interior and hand wash. Availability for other variants must be confirmed rather than inferred.
- Success: HTTP `200` or `202`, `{"accepted":true,"requestId":"opaque-reference"}`. This acknowledges endpoint acceptance, not an appointment or inbox delivery.
- Validation: HTTP `400` or `422`, `{"accepted":false,"fieldErrors":{"email":"Enter a valid email address."}}`.
- Rate limit: HTTP `429`, `{"accepted":false}`. Other failures: non-2xx JSON with `accepted:false`. A malformed body or 2xx response without `accepted:true` is treated as failure.
- The client times out after 15 seconds and does not retry automatically. The endpoint should support duplicate protection and short-lived request tracing. Do not log unnecessary personal details.
- Validate and escape user text on the endpoint, enforce origin checks and rate/abuse limits, cap payload size, and fix the destination to `quotes@totalmobileglass.com`. Use the validated customer email for reply-to only.

The external operator needs a Resend account, a private sending API key, and a verified domain they control. Complete the required DNS verification and configure a sender on that domain; no sender address has been invented here. Keep the key in that trusted service's secret store. [Resend Node.js prerequisites](https://resend.com/docs/send-with-nodejs), [Resend verified domains](https://resend.com/docs/dashboard/domains/introduction)

The trusted service calls Resend's send-email API and handles its returned error or ID. A send API response is not evidence of final delivery. Any later delivery monitoring belongs to that service. [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email)

## MapLibre and CARTO

The map uses the CARTO Positron vector style. Obtain the business's own Basemaps key through CARTO, identify this as commercial use, restrict it to the final website hostnames, and use a separate key for localhost. CARTO currently requires the key on style, tile, glyph, and sprite requests. The supplied `transformCartoRequest` function adds it only to requests for `basemaps.cartocdn.com`. The public key is distinct from any private CARTO platform token. Current commercial use is free up to 1 million tile requests per month, with paid tiers above that limit; verify the account's applicable plan before launch. [CARTO Basemaps setup](https://www.carto.com/basemaps/apikey/index.html), [CARTO terms](https://www.carto.com/legal/basemap-terms/)

Keep both CARTO and OpenStreetMap attribution visible on every map. Use MapLibre's stylesheet, reserve map height, load the library near the viewport, handle WebGL/network/tile errors, and remove the map on React effect cleanup. Keep the address and directions link available in every state. Do not request geolocation or draw an unconfirmed coverage polygon. [CARTO attribution](https://carto.com/attribution/), [MapLibre map lifecycle](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#remove), [MapLibre request transformation](https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/RequestTransformFunction/)

### Address research and exact-pin requirement

The U.S. Census public geocoder returned the exact address match `5800 MORRISON RD, NEW ORLEANS, LA, 70126`, with approximate coordinates **longitude -90.025590997511, latitude 30.025655914516**, on October 17, 2026. These coordinates are stored only as research in `mapConfig.js`. [Reproducible Census API query](https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=5800%20Morrison%20Rd%2C%20New%20Orleans%2C%20LA%2070126&benchmark=Public_AR_Current&format=json)

Census coordinates are interpolated along street address ranges and do not verify a shop entrance or actual building. The live map therefore remains unconfigured until the business verifies its exact pin and supplies the CARTO key. Once confirmed, set both coordinate variables. The current address-based directions link works without a map API key. [Census accuracy explanation](https://www.census.gov/programs-surveys/geography/technical-documentation/complete-technical-documentation/census-geocoder.html), [Google Maps URL directions format](https://developers.google.com/maps/documentation/urls/get-started)

## Static hosting

Run `npm ci`, then `npm run build`, and publish `dist`. `npm run preview` is for local build inspection. Configure the host to serve `index.html` for frontend routes such as `/services/window-tinting` while preserving real asset paths. The React router renders its own useful not-found page. This is a client-rendered static site; add build-time prerendering later if crawlable initial HTML for every route becomes a launch requirement. [Vite static deployment](https://vite.dev/guide/static-deploy)

Page copy is maintained in local `data.js` modules. Editing those files requires rebuilding and redeploying. Confirm the final domain before enabling canonical URLs; review the drafted FAQ, policy pages, claims, service availability, and testimonial permissions before public launch.

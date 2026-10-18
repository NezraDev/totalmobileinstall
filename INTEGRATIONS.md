# Integration and deployment setup

Updated October 18, 2026. The React/Vite site is prerendered for Netlify, with a server-side Netlify Function at `/api/contact` that calls Resend. The shared request validation and email handling live in `server/contact.mjs`. See `EMAIL_SETUP.md`.

## Public configuration

Copy `.env.example` to `.env.local`, fill in confirmed values, and rebuild. Vite exposes `VITE_` values to visitors and replaces them at build time. Never put a Resend sending credential in any frontend environment variable, content file, or browser SDK. [Vite environment variables](https://vite.dev/guide/env-and-mode#env-variables)

| Variable                                     | Purpose                                                                                       |
| -------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `VITE_CONTACT_ENDPOINT`                      | Optional local override; production defaults to the same-origin `/api/contact` Netlify Function |
| `VITE_CARTO_API_KEY`                         | Public, hostname-restricted CARTO Basemaps key; without it, MapLibre uses OpenStreetMap tiles |
| `VITE_MAP_LONGITUDE` and `VITE_MAP_LATITUDE` | Optional paired overrides for the confirmed shop coordinates                                  |
| `VITE_SITE_URL`                              | Confirmed canonical website origin                                                            |

All photo and brand files live in `public/images`. Reference them as `/images/...`, without `/public`. Vite serves the public directory at the root and copies it unchanged into the production output. [Vite public directory](https://vite.dev/guide/assets#the-public-directory)

## Resend endpoint contract

`src/integrations/emailClient.js` sends one JSON `POST` to `/api/contact` by default. Netlify routes that same-origin path directly to `netlify/functions/contact.mjs`; a `VITE_CONTACT_ENDPOINT` override is only needed for local backend development. The browser sends no credential, arbitrary recipient, or sender. The endpoint accepts `Content-Type: application/json`, handles `OPTIONS`, and returns JSON. The server accepts the Netlify site's primary `URL` plus any exact extra origins listed in `ALLOWED_ORIGINS`; do not accept arbitrary origins.

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
- Validate and escape user text on the endpoint, enforce origin checks and rate/abuse limits, cap payload size, and fix the destinations to `quotes@totalmobileglass.com` and `amartin@totalmobileglass.com`. Send from the verified `amartin@totalmobileglass.com` domain address and use the validated customer email for reply-to only.

The operator needs a Resend account, a private sending API key, and a verified `totalmobileglass.com` domain. Complete the required DNS verification and configure `Total Mobile Install <amartin@totalmobileglass.com>` as the sender. Store the key in Netlify's server environment with Functions scope; never use a `VITE_` variable. [Resend Node.js prerequisites](https://resend.com/docs/send-with-nodejs), [Resend verified domains](https://resend.com/docs/dashboard/domains/introduction), [Netlify Functions environment variables](https://docs.netlify.com/build/functions/environment-variables/)

The trusted service calls Resend's send-email API and handles its returned error or ID. A send API response is not evidence of final delivery. Any later delivery monitoring belongs to that service. [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email)

## MapLibre, the shop pin, and CARTO

The confirmed shop address is **2642 Tulane Ave, New Orleans, LA 70119**, with **latitude 29.961365651200683, longitude -90.09014810481109**. MapLibre uses longitude/latitude order and shares the business source of truth. Both optional coordinate overrides must be valid; incomplete or invalid overrides retain this pin. Directions use the business-supplied [Google Maps destination](https://maps.app.goo.gl/RwCt2X5jmooMkDi8A).

The portfolio map uses a generalized New Orleans overview marker. The supplied project records have no verified job-level locations; real photos remain the proof, and exact client locations are neither inferred nor published.

CARTO Basemaps requires a public API key. With `VITE_CARTO_API_KEY`, MapLibre loads CARTO Voyager tiles and shows the requested linked credit, **© CARTO · © OpenStreetMap contributors**. Request the business's own key, identify the site as commercial use, restrict it to the final website hostname, and use a separate key for localhost. The public key is embedded in the browser build, so it must be hostname-restricted and must not be a private CARTO platform token. Verify the account's current plan and usage limits before launch. [CARTO Basemaps key setup and current plans](https://www.carto.com/basemaps/apikey/index.html), [CARTO terms](https://www.carto.com/legal/basemap-terms/)

Without a CARTO key, MapLibre loads OpenStreetMap raster tiles and shows only OpenStreetMap attribution. If a configured CARTO key is rejected or the style fails to load, the map falls back to the OpenStreetMap tiles and updates its attribution accordingly. Keep the attribution visible and follow the tile provider's usage policy. MapLibre's stylesheet and worker load near the viewport; each map is removed during React cleanup. On Our Work, the map marker opens the selected project and its matched before/after photos; visitors can select another project in the accessible list below. The marker is deliberately generalized and does not represent an individual client location. [OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/), [CARTO attribution](https://carto.com/attributions), [MapLibre map lifecycle](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#remove)

## Static hosting

Run `npm ci`, then `npm run build`, and deploy the generated static pages together with the Netlify Function through a Git-connected Netlify deploy or the Netlify CLI. The build prerenders known routes and a 404 page, with sitemap/robots/metadata. Configure static 404-page handling and retain the generated 301 redirects rather than a catch-all SPA 200 rewrite. `npm run preview` inspects the generated static responses locally. See [NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md) and [SEO.md](SEO.md) for deployment and indexing details.

Page copy is maintained in local `data.js` modules. Editing those files requires rebuilding and redeploying. Confirm the final domain before enabling canonical URLs; review the drafted FAQ, policy pages, claims, service availability, and testimonial permissions before public launch.

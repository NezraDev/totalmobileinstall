# Total Mobile Install 2026

A complete frontend React website built from `../total-mobile-install-website-planning-prompt.md`. The current user request authorizes implementation rather than the source document's earlier planning-only workflow.

## Run locally

```powershell
cd TMI_2026
npm install
npm run dev
```

Open the Local URL printed by Vite. `npm run build` creates the static `dist` folder. `npm run preview` serves that production build. If Windows PowerShell resolves npm incorrectly, use `npm.cmd` for these commands.

## What is implemented

- White responsive navigation, supplied icon with an HTML wordmark, and a full-height photographic slideshow hero with a translucent blue overlay and immediate booking and phone actions.
- Automatic 4.5-second photo rotation with smooth crossfades and an uncluttered hero. Hero pause and arrow controls are removed as requested. Keyboard focus temporarily suspends rotation; reduced motion uses a static photo.
- All public page templates plus six service detail routes, page-specific SEO, and genuine recovery pages for invalid routes and slugs. `/our-work` is the completed-project map and `/home-service` redirects there for continuity.
- Nine genuine matched before-and-after projects. Desktop comparison panels preserve differing camera angles; mobile tabs switch clearly between stages.
- Six supplied testimonials with exact wording, scrollable using keyboard or controls. No invented aggregate score or review count.
- Accessible service inquiry form, eligible modes, shop-only detailing restrictions, conditional mobile address, field validation, pending/accepted/failed/unavailable states, and preserved input on failure.
- Deferred MapLibre maps using CARTO Voyager when configured, linked CARTO and OpenStreetMap attribution, readable map fallbacks, and an exact shop pin.
- An Our Work page with one generalized New Orleans portfolio marker. Selecting any of nine supplied projects opens its real before-and-after proof in the pin popup; no client names or exact job addresses are published.
- Static business structured data, self-hosted Manrope, local responsive WebP photos, reduced-motion preferences, visible focus, and a mobile call/booking bar that hides around forms, maps, and footer content.

## Edit content

Each folder in `src/pages` has a `data.js` beside its page component. Change that file for headings, editorial copy, SEO, gallery lists, FAQs, and page actions. Service detail records are keyed by slug in `src/pages/ServiceDetail/data.js`.

Shared sources:

- `src/content/business.js`: contact details, logo paths, hours, footer.
- `src/content/services.js`: the six service records and mode restrictions.
- `src/content/navigation.js`: navigation and shared layout labels.
- `src/content/ui.js`: form, map, transformation, and closing-action copy.
- `src/content/assets.js`: photographs, alt text, crops, slideshow, and paired images.
- `src/styles/tokens.css`: palette, type family, width, spacing, motion curve.
- `src/styles/global.css`: responsive layouts and component styles.

All images are in `public/images`. Image provenance, including earlier supplied retouches, is documented in `ASSETS.md`. Before-and-after images are matched source projects. The original horizontal PNG is preserved alongside a whitespace-trimmed derivative. No fabricated logo or stock project images are used.

Data changes require a rebuild and redeployment. This is file-based content maintenance, not a CMS. `sourceStatus` fields are maintainer metadata and never rendered as website copy. Linked-page editorial copy and FAQ answers are drafts based only on supplied facts.

## Configure external integrations

Copy `.env.example` to `.env.local` and supply the public values you have. Rebuild after changes. See `INTEGRATIONS.md` for current official requirements, the endpoint payload and response contract, map-key restrictions, and geocoding research.

The frontend never sends email directly. A separately hosted trusted endpoint calls Resend and sends to the fixed business address. No function or backend is scaffolded here. A submitted state appears only after a configured endpoint returns an accepted response. Until that endpoint is configured, the form validates the request and opens a prefilled email draft for the customer to review and send, with phone and email links as fallback.

The shop map uses MapLibre at the exact client-supplied coordinates (29.961365651200683, -90.09014810481109). Set `VITE_CARTO_API_KEY` to use CARTO Voyager tiles and show linked CARTO and OpenStreetMap attributions. Without a key, MapLibre uses OpenStreetMap raster tiles and shows OpenStreetMap attribution. The Our Work map uses a single generalized New Orleans portfolio marker because project-level ZIP codes or addresses were not provided. Selecting a project loads its genuine before-and-after photos into the popup. No client identity, precise job address, or visitor geolocation is shown.

## Launch inputs

- Configure the external Resend endpoint, verified sending domain, server validation and abuse controls. Private Resend credentials belong only to that endpoint.
- The exact shop pin is configured from the client. A CARTO key is required to use CARTO tiles; otherwise the MapLibre map uses OpenStreetMap raster tiles. The portfolio pin is intentionally city-level until verified anonymous project areas are available.
- Approve final Privacy Policy and Terms. Current pages explicitly state that approved text is pending.
- Review linked-page copy/FAQ answers, testimonial publication, and eligible service modes. The 40-mile New Orleans coverage claim is client-supplied; the team confirms availability for each exact address.
- Confirm certification, 10K+ vehicle, 100% satisfaction, award, and warranty claims before displaying them. Original supplied statistics are retained in page data. Unconfirmed certification, warranty, award and satisfaction claims are gated off by default in `src/config/site.js`; the vehicle metric requested by the client uses the brief's existing 10K+ figure and remains on the launch verification checklist. Badge files are preserved without implying verified credentials.
- The canonical origin defaults to the existing deployed Site. Set `VITE_SITE_URL` only when moving to a confirmed custom HTTPS origin. The supplied Google review destination is configured; no autoplay video is downloaded.

## Static hosting and search

`npm run build` produces complete HTML for 17 routes plus a 404 page, sitemap.xml, robots.txt, social metadata and truthful structured data. It retains the existing React interface and hydrates the generated pages. Deploy the full `dist` using the existing Sites workflow with `static.not_found_handling: "404-page"`. Flat HTML files support the established slashless URLs; `_redirects` supplies permanent legacy and duplicate-path redirects. Do not restore a catch-all SPA 200 rewrite or publish `.ssr-build`.

The configured production origin is the existing HTTPS Site URL. It is currently owner-private and anonymous requests return 401, so Google indexing requires the owner to choose a public audience. This work does not change sharing. See [SEO.md](SEO.md) for canonical-domain configuration, Search Console verification, sitemap submission, image variants and host checks, and [SEO_AUDIT.md](SEO_AUDIT.md) for the implementation audit and launch limitations.

## Validation

```powershell
npm run check
npm run build
npm run check:seo
npm run preview -- --port 4174
# In another terminal:
$env:TMI_BROWSER_BASE_URL='http://127.0.0.1:4174'
npm run test:browser
npm run test:seo-browser
```

The browser suites use the existing Playwright/Edge installation. They cover page/service routes, 320-1440px widths, asset loading, metadata, native form restrictions, maps, mobile navigation, FAQ interaction, transformations, hydrated and JavaScript-disabled content, crystal/reduced motion, and honest unconfigured submission. Screenshots and results are saved in `.impeccable/review`. No real email is sent. No lint or TypeScript task is configured.

The large MapLibre chunk is intentionally dynamically imported only near a map; it is not part of the opening download. Maps load near the viewport and clean up when their page unmounts.

The scrolling metrics section counts up once as it enters the viewport and respects reduced motion. Values use the source brief (9+ years, 10K+ vehicles) and actual service/project/testimonial records. No star average or aggregate rating is invented. Confirm the client-supplied vehicle figure before public launch.

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

The frontend never sends email directly. A separately hosted trusted endpoint calls Resend and sends to the fixed business address. No function or backend is scaffolded here. A submitted state appears only after a configured endpoint returns an accepted response. Without that endpoint the form explains online availability and provides working call/email actions.

The shop map uses MapLibre at the exact client-supplied coordinates (30.025471630757778, -90.02540735889556). Set `VITE_CARTO_API_KEY` to use CARTO Voyager tiles and show linked CARTO and OpenStreetMap attributions. Without a key, MapLibre uses OpenStreetMap raster tiles and shows OpenStreetMap attribution. The Our Work map uses a single generalized New Orleans portfolio marker because project-level ZIP codes or addresses were not provided. Selecting a project loads its genuine before-and-after photos into the popup. No client identity, precise job address, or visitor geolocation is shown.

## Launch inputs

- Configure the external Resend endpoint, verified sending domain, server validation and abuse controls. Private Resend credentials belong only to that endpoint.
- The exact shop pin is configured from the client. A CARTO key is required to use CARTO tiles; otherwise the MapLibre map uses OpenStreetMap raster tiles. The portfolio pin is intentionally city-level until verified anonymous project areas are available.
- Approve final Privacy Policy and Terms. Current pages explicitly state that approved text is pending.
- Review proposed linked-page copy/FAQ answers, testimonial publication, eligible service modes, and surrounding coverage. No invented radius or neighborhood list appears.
- Confirm certification, 10K+ vehicle, 100% satisfaction, award, and warranty claims before displaying them. Original supplied statistics are retained in page data. Unconfirmed certification, warranty, award and satisfaction claims are gated off by default in `src/config/site.js`; the vehicle metric requested by the client uses the brief's existing 10K+ figure and remains on the launch verification checklist. Badge files are preserved without implying verified credentials.
- Supply the business's final domain to `VITE_SITE_URL` if canonical URLs are wanted. Review destination and video URLs remain unconfigured. No autoplay video is downloaded.

## Static hosting and search

Deploy the contents of `dist`. The host must serve real static files normally and rewrite other public route requests to `index.html`. `public/_redirects` provides the common SPA rewrite format for compatible hosts. For other hosts configure the equivalent rule. Test a direct request and refresh at `/services/windshield-replacement` after deployment.

React renders unique page titles, descriptions, and optional canonical URLs. This remains a client-rendered static SPA. For stronger crawler previews, add build-time prerendering of known routes later, without a runtime server. Unknown routes display the application's Not Found page. The hosting layer controls actual HTTP 404 status and must be configured separately if required.

## Validation

```powershell
npm run check
node scripts/integration-check.mjs
node scripts/browser-check.mjs
node scripts/hero-check.mjs
npm run build
```

The browser check requires the Vite dev server at port 5173 and an installed Edge browser. It covers every page and service route, 320–1440px widths, asset loading, page titles, mobile navigation, keyboard FAQ interaction, slideshow controls, actual transformation switching, detailing restrictions, and honest unconfigured submission. Screenshots and results are saved in `.impeccable/review`. No real email is sent during checks.

The large MapLibre chunk is intentionally dynamically imported only near a map; it is not part of the opening download. Maps load near the viewport and clean up when their page unmounts.

The scrolling metrics section counts up once as it enters the viewport and respects reduced motion. Values use the source brief (9+ years, 10K+ vehicles) and actual service/project/testimonial records. No star average or aggregate rating is invented. Confirm the client-supplied vehicle figure before public launch.

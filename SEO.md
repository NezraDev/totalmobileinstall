# SEO configuration and publishing

The existing React/Vite application is preserved. `npm run build` builds the browser assets, resolves the same React routes at build time, and writes complete HTML documents with metadata. React hydrates those documents for normal interaction. The temporary `.ssr-build` Node bundle is ignored and is never deployed.

## Production origin

`src/config/site.js` defaults to the existing deployed origin, `https://total-mobile-install-2026.nuttypika64.chatgpt.site`. Set the public build variable `VITE_SITE_URL` to a confirmed custom HTTPS origin when switching domains, then rebuild and deploy. Do not include a path, query, fragment, or credentials. Canonical URLs, social URLs, schema, and sitemap use this one origin. Booking parameters and fragments are excluded from canonical URLs. No external production domain has been invented.

## Editing pages

Page metadata remains in each page's existing `data.js` file. `src/seo/routes.js` is the build-only route catalog, including all six valid service slugs. `PageMeta` and the HTML generator share `src/seo/metadata.js`, so direct responses and client navigation have the same title, description, canonical, robots, Open Graph, Twitter Card, and JSON-LD tags. Add new public routes to the React routes and this catalog together. Unknown routes and unapproved policy placeholders are `noindex`; error pages have no canonical.

The business source of truth is `src/content/business.js`: the supplied Tulane Avenue postal address, phone, email, hours, and verified map coordinates. Structured data includes applicable AutomotiveBusiness, WebSite, WebPage, and service details. It deliberately omits prices, aggregate ratings, customer addresses, badges, awards, unsupported reviews, and guarantees. No fabricated business claims were added.

## Hosting and HTTP behavior

Deploy the full generated `dist` through the existing Sites workflow. `.openai/hosting.json` requests static `not_found_handling: "404-page"`. Flat files such as `about.html` and `services/window-tinting.html` support the established slashless URLs. The generated root `404.html` replaces the previous catch-all SPA 200 rule. `_redirects` declares the legacy `/home-service`301 and canonical slash/index forms; `_headers` declares cache policy and noindex headers for placeholders/errors. The hosting platform already redirects HTTP to HTTPS.

`npm run preview -- --port 4174` serves the built output locally with the same declared routes, 301s, and 404s. It is an inspection server, not a replacement production backend. Actual CDN routing must also be verified once anonymous access is allowed. The current Site is owner-private and returns401 to anonymous visitors; Google cannot crawl it in this state. Robots.txt is not access control. No private routes, API handlers, credentials, or source files are shipped with the static assets.

## Search Console

1. After approving a public launch, select the deployed HTTPS URL-prefix property in Google Search Console. Domain verification for a custom domain requires DNS access.
2. Set `VITE_GOOGLE_SITE_VERIFICATION` to the public HTML-tag token supplied by Search Console and rebuild/deploy. This token is intentionally public; never substitute an API key or account credential. Alternatively, use the account's DNS verification method without code changes.
3. Verify ownership in Search Console, then submit `sitemap.xml` at the configured origin. The sitemap contains only canonical, indexable routes, with no query variants or fabricated modification dates.
4. Inspect the homepage and representative service pages. Check the live canonical, rendered content, indexing status, and Core Web Vitals after traffic data becomes available. No Search Console account verification or sitemap submission has been claimed.

There was no configured analytics integration. No tracking script, analytics account, or third-party service was added. Existing external contact and map configuration remain intact.

## Images and validation

All images remain under `public/images`. Existing WebP originals are retained. `scripts/generate-image-variants.py` optionally regenerates committed smaller WebP variants and the real-width manifest using Pillow; Python is not required by the production build. Shared Photo sizing, intrinsic dimensions, lazy loading, and first-image priority reduce avoidable image transfer and layout shifts. The slideshow stages one upcoming photo instead of loading all hero photos immediately. Fonts remain locally hosted; maps remain lazy.

Run:

```text
npm run check
npm run build
npm run check:seo
npm run preview -- --port 4174
npm run test:browser
npm run test:seo-browser
```

Set `TMI_BROWSER_BASE_URL=http://127.0.0.1:4174` for both browser suites. They use the existing Playwright/Edge setup. The project has no configured lint or TypeScript task; no lint/type dependency was added solely for this work. SEO tests verify generated HTML, unique metadata, schema facts, sitemap membership, image assets, links and local 200/301/404 responses; browser tests cover hydration, forms, navigation, responsive layout and JavaScript-disabled content. No ranking or Core Web Vitals score is guaranteed.

## Primary references

- [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google robots.txt guidance](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [React static prerendering and hydration](https://react.dev/reference/react-dom/static/prerenderToNodeStream)
- [Vite SSR build support](https://vite.dev/guide/ssr)
- [Cloudflare static HTML routing](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/)
- [Cloudflare static redirects](https://developers.cloudflare.com/workers/static-assets/redirects/)

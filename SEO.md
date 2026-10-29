# SEO configuration and publishing

The existing React/Vite application is preserved. `npm run build` builds the browser assets, resolves the same React routes at build time, and writes complete HTML documents with metadata. React hydrates those documents for normal interaction. The temporary `.ssr-build` Node bundle is ignored and is never deployed.

## Production origin

The approved production domain is `https://totalmobileinstall.com`. Both `src/config/site.js` and `netlify.toml` use it so canonical URLs, social URLs, schema, and the sitemap share one origin. Do not configure `VITE_SITE_URL` to the separate owner-only ChatGPT preview or the legacy `totalmobileglass.com` website. Booking parameters and fragments are excluded from canonical URLs.

## Editing pages

Page metadata remains in each page's existing `data.js` file. `src/seo/routes.js` is the build-only route catalog, including all six valid service slugs. `PageMeta` and the HTML generator share `src/seo/metadata.js`, so direct responses and client navigation have the same title, description, canonical, robots, Open Graph, Twitter Card, and JSON-LD tags. Add new public routes to the React routes and this catalog together. Unknown routes and unapproved policy placeholders are `noindex`; error pages have no canonical.

The business source of truth is `src/content/business.js`: the supplied Tulane Avenue postal address, phone, email, hours, and verified map coordinates. Structured data includes applicable AutomotiveBusiness, WebSite, WebPage, and service details. It deliberately omits prices, aggregate ratings, customer addresses, badges, awards, unsupported reviews, and guarantees. No fabricated business claims were added.

## Hosting and HTTP behavior

Deploy the full generated `dist` from this repository through its production host. `.openai/hosting.json` configures a separate, owner-only ChatGPT preview and does not control `totalmobileinstall.com`. Flat route files such as `about.html` and `services/window-tinting.html` contain prerendered content. `_redirects` declares the legacy `/home-service` redirect and forced `.html` to clean-URL redirects, including `/index.html` to `/`. `netlify.toml` holds the approved canonical origin if the production host is Netlify. Confirm actual host redirects and 404 handling after deployment.

`npm run preview -- --port 4174` serves the built output locally and exercises declared clean routes, 301s, and 404s. It does not prove CDN behavior. During the 2026-10-29 audit, `https://totalmobileinstall.com` returned public 200 responses for the sitemap routes. Confirm redirect and 404 behavior again after deployment. The separate ChatGPT preview is private; it is not the approved canonical website. Robots.txt is not access control.

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

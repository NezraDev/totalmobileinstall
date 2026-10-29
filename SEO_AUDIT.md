# SEO audit — Total Mobile Install

Date: **2026-10-29**

Scope: source, production build output, browser behavior, and the anonymous public website. The owner confirmed `https://totalmobileinstall.com` and **2642 Tulane Ave, New Orleans, LA 70119** as the primary domain and public shop address.

## Resolved in the working tree

- Canonicals, Open Graph URLs, business schema, robots.txt, and sitemap now use `https://totalmobileinstall.com` by default. `netlify.toml` fixes the canonical build origin as well.
- Server prerender and browser hydration render the same site content, including the chatbot. The chatbot is lazy-loaded into its own browser chunk.
- The build emits forced clean-URL redirects for `/index.html` and every prerendered `.html` alias. Netlify does not support the earlier `/*.html` middle-wildcard pattern, so each route now receives an exact rule.
- Unverified awards, satisfaction guarantees, 10K+ vehicle counts, certification claims, lifetime warranty terms, and fixed arrival estimates no longer appear as public promises. Warranty and arrival answers now tell customers to confirm service-specific details with the team.
- Removed the remaining visible certification and dealership-grade wording, unsupported 99% UV and repair-time claims, and dust-free/climate-stable finish claims. Service pages keep the actual service names and New Orleans relevance.
- Each of the six New Orleans service pages now includes service-specific questions and useful internal links. Project cards include grounded descriptions of the supplied photo pairs and link to the matching service page. Project locations and customer details remain private.
- Chatbot code is a separate 41.6 KB chunk (12.4 KB gzip), reducing the main entry chunk from about 402 KB to 362 KB. The hero slideshow pauses offscreen so it does not progressively load every photograph while visitors are elsewhere on the page.

## Validation

- `npm run check`: passed content checks, 13 integration cases with mocked requests, email server checks without sending real mail, and 85 chatbot examples.
- `npm run build`: generated 17 prerendered route documents, a real 404, a 15-URL sitemap, and the corrected canonical origin.
- `npm run check:seo`: passed 17 routes plus 404, 15 sitemap URLs, 558 internal-link instances, and 111 dimensioned images; metadata, schema, redirects, assets, and response codes passed.
- The Playwright SEO browser suite passed across all 17 hydrated routes, query-prefilled forms, 404/noindex, JavaScript-disabled content, and 320/390/1440-pixel viewports. It found no hydration errors.
- `npm run test:browser`: desktop and mobile browser checks passed after the service-copy updates.
- SEO checks also assert that unconfirmed metrics, certifications, guarantees, and performance claims do not appear in prerendered public pages.
- One separate hero visual check times out waiting for the interactive map popup after showing its marker; this map check is not part of the passing SEO browser suite and remains unverified.

## Production and account tasks

Commits `8ef0dc0` and `04c2c96` were pushed to `main` and deployed on Netlify. Cache-bypass checks confirmed the homepage canonical is `https://totalmobileinstall.com/`, the live sitemap has 15 URLs all on that domain, robots.txt points to the correct sitemap, and the homepage no longer shows the unconfirmed 10K+ figure or award/quality/satisfaction badges. Live checks now return 301 for `/index.html`, `/services.html`, `/contact.html`, and `/services/window-tinting.html`, and 404 for an unknown path. Confirm whether `quotes@totalmobileglass.com` remains the correct public email; the owner confirmed the canonical domain and shop address, not an email change.

The owner has begun Search Console setup and reported the prior sitemap's 15 old-domain URL errors. The live sitemap is now corrected; resubmit `sitemap.xml` in the Search Console Sitemaps report to refresh the old error status, then inspect the homepage and service pages. Google Business Profile categories, business verification, and service coverage still need review in the owner's account. Field Core Web Vitals have not been measured; check PageSpeed Insights and Search Console after real-user traffic.

Privacy Policy and Terms pages remain `noindex` because approved business and data-handling terms were not supplied. Keep them out of the sitemap until accurate, approved copy replaces the notices.

Keyword stuffing was not added. The pages target the genuine services and New Orleans customer questions in natural language; unsupported town pages, prices, credentials, and performance promises were not invented.

## Primary references

- [Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical)
- [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google local ranking guidance](https://support.google.com/business/answer/7091)
- [Netlify environment variable precedence](https://docs.netlify.com/build/environment-variables/overview/)
- [Netlify redirect options and wildcard limits](https://docs.netlify.com/manage/routing/redirects/redirect-options/)

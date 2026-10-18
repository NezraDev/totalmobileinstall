# SEO audit — Total Mobile Install

Date: **2026-10-18**

Scope: the existing React, Vite, React Router website and its static hosting configuration. The implementation preserves the current branding, responsive layouts, booking flow, maps, and photographic design. The previously requested motion and crystal headline effects remain in place; this work is not a redesign.

## Priority and status

| Priority | Finding before this work                                                                                                                                         | Implemented improvement                                                                                                                                                                                                    | Status                                                                                                              |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Critical | The live Site requires owner authentication; anonymous requests return HTTP 401. Google cannot crawl authenticated pages.                                        | Identified the hosting audience restriction. No audience or access setting was changed.                                                                                                                                    | **Launch blocker:** the owner must choose a publicly accessible production destination before indexing is possible. |
| High     | Important content and metadata appeared only after client-side JavaScript ran.                                                                                   | Build-time rendering produces complete HTML for 17 page routes and a separate 404 page. Client navigation uses the same metadata utility.                                                                                  | Implemented; production build, generated HTML and local response checks passed.                                     |
| High     | Canonicals were optional, social metadata was absent, and long service descriptions repeated body copy.                                                          | Unique titles and concise descriptions, canonical URLs, Open Graph, and Twitter Cards now use shared page data. Query parameters and fragments are excluded from canonical URLs.                                           | Implemented.                                                                                                        |
| High     | No generated sitemap or crawl configuration covered the complete route catalog.                                                                                  | The build generates `sitemap.xml` with 15 indexable canonical URLs and `robots.txt` allowing public pages and assets. Policy placeholders and recovery pages use `noindex` rather than a crawl block.                      | Implemented.                                                                                                        |
| High     | SPA fallback handling could turn unknown paths into successful responses, and the legacy route redirected only in JavaScript.                                    | Static hosting uses `404-page` handling and flat page HTML. `_redirects` defines permanent legacy and duplicate-path redirects; the local production preview exercises 200, 301, and 404 behavior.                         | Implemented locally; production behavior behind authentication remains unverified.                                  |
| High     | The street address was stale after the shop pin changed.                                                                                                         | Business data and relevant page copy now use the user-confirmed **2642 Tulane Ave, New Orleans, LA 70119**, with latitude **29.961365651200683**, longitude **-90.09014810481109**, and the supplied directions link.      | Implemented.                                                                                                        |
| Medium   | Repair and replacement pages overlapped heavily; services overview skipped a heading level.                                                                      | Repair and replacement copy now explain different service intents. A section H2 precedes service-card H3s. Related-service cards and FAQ links connect relevant pages.                                                     | Implemented without visual redesign.                                                                                |
| Medium   | Images already used local WebP, but responsive sizes and raw project-image dimensions needed improvement; hidden hero slides could compete with the first image. | The image manifest records 113 actual sources, including 40 additional WebP variants. Intrinsic dimensions, responsive selection, below-the-fold lazy loading, and staged hero-image fetching reduce avoidable image work. | Implemented; field Core Web Vitals are not yet available.                                                           |
| Medium   | Business structured data was limited and repeated a stale address.                                                                                               | Shared JSON-LD provides `AutomotiveBusiness`, `WebSite`, and `WebPage` entities, plus `Service` on each applicable service page.                                                                                           | Implemented; markup uses visible, applicable business and service facts.                                            |
| Medium   | Search Console verification had no documented configuration path.                                                                                                | An optional public verification-token configuration is prepared. No analytics or tracking service was added.                                                                                                               | Account setup and verification remain with the owner.                                                               |

## On-page and content decisions

Every main route and all six service routes have distinct title and description text. Real photographs from `public/images` supply social image URLs. Meaningful photographs retain descriptive alternative text; decorative branding can remain empty-alt where adjacent text already identifies the business.

The homepage keeps its existing H1 and design. Service metadata focuses naturally on New Orleans, the actual service, and mobile or shop availability. Windshield repair now focuses on chip and crack assessment; replacement focuses on correct glass, installation, insurance assistance, and calibration considerations. No new location landing pages or repetitive keyword sections were created.

The Our Work page remains a photo-documented project portfolio with a generalized New Orleans marker. The Gallery remains the visual before-and-after collection. Client names, precise client addresses, and unverified project locations are not inferred. Existing service limitations, appointment-confirmation wording, testimonials, and legal FAQ answers were preserved.

The Privacy Policy and Terms pages are approval notices rather than completed legal documents. They remain accessible to visitors but are excluded from the sitemap and marked `noindex, follow`. Unknown routes also receive noindex recovery metadata and have no canonical URL.

## Structured data and factual limits

JSON-LD describes the business name, phone, email, confirmed street address, verified geographic coordinates, visible hours, and applicable services. It does not add review averages, aggregate ratings, awards, prices, product offers, or unsupported credentials. No testimonial or rating rich-result eligibility is claimed.

Existing source notes still flag some certification, vehicle-count, guarantee, and badge claims for business review. This SEO work does not validate those claims and does not amplify them through structured data. Search visibility and rankings depend on factors beyond these code changes; no ranking or traffic result is guaranteed.

## Validation record

The implementation includes content and integration checks, a production build with prerendering, browser checks, and dedicated SEO checks for initial HTML, unique metadata, canonical URLs, structured data, local assets, internal links, sitemap membership, robots configuration, and local response behavior.

Completed integrated validation:

- `npm run check`: passed content checks and 14 integration cases with 15 mocked requests; no real email or network submission.
- `npm run build`: passed browser and build-time server bundles; generated 17 page documents plus 404. The existing MapLibre size warning remains; its code/worker/CSS are deferred near maps.
- `npm run check:seo`: passed 17 routes plus 404, 15 sitemap URLs, 549 internal-link instances and 114 dimensioned image instances; unique metadata, JSON-LD, asset paths, excluded sensitive source files and local 200/301/404 responses verified.
- `npm run test:browser`: passed existing route, form, navigation, comparison, FAQ and responsive checks.
- `npm run test:seo-browser`: passed 17 hydrated routes, query-prefilled booking forms, metadata navigation, 404/noindex, meaningful JavaScript-disabled content, crystal-effect pause/reduced motion and 320/390/1440px views, with no hydration errors.
- Visual inspection covered desktop/mobile and caught an undersized mobile hero source. Its responsive sizing now accounts for the tall cover crop so card optimizations do not soften the hero photograph.
- No lint or TypeScript task is configured. No new dependency or tracker was introduced.

Local preview results are not proof of anonymous production routing. Production requests remain authentication-gated as described below.

The deployed Site is currently owner-only. Anonymous HTTP 401 responses prevent verification of production crawlability, sitemap access, redirects, and not-found behavior. Those checks must be repeated on the final publicly accessible origin.

## Launch and account-only actions

1. Choose or approve a public production destination. The current canonical origin is the existing Site URL, not a fabricated domain. If the production origin changes, update the documented site-URL configuration and rebuild before publication.
2. Verify the publicly accessible production property in Google Search Console using the owner's account and a supported verification method. The code supports an optional HTML verification token; no token is invented or stored in source.
3. Submit the actual public production origin followed by **`/sitemap.xml`**. Confirm sitemap URLs return public 200 responses and inspect representative service pages in Search Console.
4. Confirm production HTTPS, permanent redirects for duplicate and legacy URLs, and real 404 responses for unknown pages and service slugs. Check without an authenticated owner session.
5. Approve and supply final Privacy Policy and Terms text. Reconsider their noindex status only after substantive approved content replaces the notices.
6. Review the existing business claims flagged in the content sources. Keep map coordinates, address, hours, and contact details consistent with the business's verified public listings.
7. Monitor Search Console indexing and field Core Web Vitals after public launch. No analytics configuration was found, and no new tracker or third-party tracking script was introduced.

See the separate SEO configuration guide for build, environment, verification-token, and hosting maintenance instructions.

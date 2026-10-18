# Deploying this repository to Netlify

The production build prerenders every public route into `dist` as its own HTML page, plus a real `404.html`, sitemap, robots file, redirects, and headers. The root `netlify.toml` sets the Netlify build command, Node version, and publish directory. Do not add a catch-all rewrite to `/index.html`: it would mask missing routes and replace the pre-rendered page output.

## Connect the GitHub repository

In Netlify, import `NezraDev/totalmobileinstall` as a new site or update the existing site's build settings. Use the repository root as the base directory; Netlify reads `netlify.toml` and runs:

- Build command: `npm run build`
- Publish directory: `dist`
- Node.js: 22

The lockfile is committed, so Netlify installs the project's dependencies before building. Commit and push `netlify.toml` and `netlify/functions/contact.mjs` before redeploying so Netlify publishes the site and function together.

## Deploy the site and function

Use a Git-connected Netlify deploy or the Netlify CLI so both the generated `dist` site and `netlify/functions/contact.mjs` are published. A drag-and-drop upload of `dist` alone does not include the email function.

## Set the production domain

After Netlify assigns the site's public HTTPS URL, add `VITE_SITE_URL` in **Site configuration → Environment variables** with that exact origin, such as `https://your-site.netlify.app` (no path or trailing slash), then trigger a new deploy. Use your confirmed custom HTTPS domain instead if one is already connected. This keeps canonical links, structured data, Open Graph URLs, and `sitemap.xml` pointed at Netlify.

The booking form uses the same-origin `/api/contact` Netlify Function by default; no public endpoint URL is needed. In **Site configuration → Environment variables**, set `RESEND_API_KEY` to a fresh Resend sending key with Functions scope. Set `RESEND_FROM` to an address on the exact domain marked **Verified** in Resend. For example, if `service.totalmobileglass.com` is marked Verified, use `Total Mobile Install <amartin@service.totalmobileglass.com>`; verifying the subdomain does not verify the root domain. Add any additional website origins to `ALLOWED_ORIGINS`; the function already allows Netlify's primary site URL. Save and redeploy. Do not put the Resend key in a `VITE_` variable or in `netlify.toml`. See [EMAIL_SETUP.md](EMAIL_SETUP.md).

## Check the deployed pages

After publish, open the Netlify URL at `/`, `/services`, `/about`, `/our-work`, and `/services/windshield-replacement`. These paths should show their own pre-rendered pages. An unknown path should show the custom 404. If the site is blank, first check the Netlify deploy log for a successful `npm run build` and confirm the deployed file list contains `index.html`, `about.html`, `services.html`, `services/windshield-replacement.html`, and `404.html`.

The clean URLs are resolved from the matching `.html` files. The build-generated `_redirects` file handles `/home-service` and slash aliases; `netlify.toml` leaves Netlify's Pretty URLs normalization off so the existing canonical URLs remain slashless.

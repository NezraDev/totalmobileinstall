# Deploying this repository to Netlify

The production build prerenders every public route into `dist` as its own HTML page, plus a real `404.html`, sitemap, robots file, redirects, and headers. The root `netlify.toml` sets the Netlify build command, Node version, and publish directory. Do not add a catch-all rewrite to `/index.html`: it would mask missing routes and replace the pre-rendered page output.

## Connect the GitHub repository

In Netlify, import `NezraDev/totalmobileinstall` as a new site or update the existing site's build settings. Use the repository root as the base directory; Netlify reads `netlify.toml` and runs:

- Build command: `npm run build`
- Publish directory: `dist`
- Node.js: 22

The lockfile is committed, so Netlify installs the project's dependencies before building. Commit and push `netlify.toml` before redeploying so Netlify uses these settings.

## Manual deploy

From the repository root, run `npm ci` and `npm run build`, then upload the generated `dist` directory as the published site. Do not upload the repository root, the `src` folder, or just `index.html`.

## Set the production domain

After Netlify assigns the site's public HTTPS URL, add `VITE_SITE_URL` in **Site configuration → Environment variables** with that exact origin, such as `https://your-site.netlify.app` (no path or trailing slash), then trigger a new deploy. Use your confirmed custom HTTPS domain instead if one is already connected. This keeps canonical links, structured data, Open Graph URLs, and `sitemap.xml` pointed at Netlify.

To activate online service requests, set the public `VITE_CONTACT_ENDPOINT` to the actual HTTPS Render endpoint ending in `/api/contact`, then rebuild. Keep `RESEND_API_KEY` and `RESEND_FROM` only in Render's server environment. See [EMAIL_SETUP.md](EMAIL_SETUP.md).

## Check the deployed pages

After publish, open the Netlify URL at `/`, `/services`, `/about`, `/our-work`, and `/services/windshield-replacement`. These paths should show their own pre-rendered pages. An unknown path should show the custom 404. If the site is blank, first check the Netlify deploy log for a successful `npm run build` and confirm the deployed file list contains `index.html`, `about.html`, `services.html`, `services/windshield-replacement.html`, and `404.html`.

The clean URLs are resolved from the matching `.html` files. The build-generated `_redirects` file handles `/home-service` and slash aliases; `netlify.toml` leaves Netlify's Pretty URLs normalization off so the existing canonical URLs remain slashless.

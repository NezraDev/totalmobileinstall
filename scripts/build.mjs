import { build } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

await build({ build: { manifest: true } });
await build({
  publicDir: false,
  build: {
    ssr: 'src/entry-server.jsx',
    outDir: '.ssr-build',
    emptyOutDir: true,
    manifest: false,
  },
});
const {
  renderRoute,
  renderMetadata,
  escapeHtml,
  pageRoutes,
  notFoundMetadata,
  site,
} = await import(
  pathToFileURL(path.resolve('.ssr-build/entry-server.js')).href
);
const template = await fs.readFile('dist/index.html', 'utf8');
const manifest = JSON.parse(
  await fs.readFile('dist/.vite/manifest.json', 'utf8'),
);
const assets = await fs.readdir('dist/assets');
const font = assets.find((name) =>
  /^manrope-latin-500-normal-.+\.woff2$/.test(name),
);
const fontPreload = font
  ? `<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin />`
  : '';

for (const route of [
  ...pageRoutes,
  { path: '/404', metadata: notFoundMetadata },
]) {
  let content = await renderRoute(route.path);
  const resourceHints = [];
  content = content.replace(/<link\b[^>]*rel="preload"[^>]*\/>/g, (hint) => {
    resourceHints.push(hint);
    return '';
  });
  const chunk = manifest[route.module];
  const chunkPreload = chunk
    ? `<link rel="modulepreload" href="/${chunk.file}" crossorigin />`
    : '';
  const html = template
    .replace(
      /<!--seo-start-->[\s\S]*?<!--seo-end-->/,
      `${renderMetadata(route.metadata)}\n${fontPreload}\n${chunkPreload}\n${resourceHints.join('\n')}`,
    )
    .replace('<div id="root">', '<div id="root" data-prerendered="true">')
    .replace('<!--app-html-->', content);
  const filename =
    route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`;
  await fs.mkdir(path.dirname(path.join('dist', filename)), {
    recursive: true,
  });
  await fs.writeFile(path.join('dist', filename), html);
}
const indexed = pageRoutes.filter(({ metadata }) => !metadata.noindex);
await fs.writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexed.map(({ metadata }) => `  <url><loc>${escapeHtml(metadata.canonical)}</loc></url>`).join('\n')}\n</urlset>\n`,
);
await fs.writeFile(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\n\nSitemap: ${site.canonicalBase}/sitemap.xml\n`,
);
const redirects = await fs.readFile('public/_redirects', 'utf8');
const flatHtmlRedirects = pageRoutes
  .map(({ path }) => `${path === '/' ? '/index.html' : `${path}.html`} ${path} 301!`)
  .join('\n');
const cleanRouteRedirects = pageRoutes
  .filter(({ path }) => path !== '/')
  .map(({ path }) => `${path}/ ${path} 301\n${path}/index.html ${path} 301`)
  .join('\n');
await fs.writeFile(
  'dist/_redirects',
  `${redirects.trim()}\n${flatHtmlRedirects}\n${cleanRouteRedirects}\n`,
);
await fs.writeFile(
  'dist/_headers',
  `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Cache-Control: no-cache\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/images/*\n  Cache-Control: public, max-age=86400, stale-while-revalidate=604800\n/404.html\n  X-Robots-Tag: noindex\n/privacy-policy\n  X-Robots-Tag: noindex, follow\n/terms-of-use\n  X-Robots-Tag: noindex, follow\n`,
);
await fs.writeFile(
  '.ssr-build/seo-routes.json',
  JSON.stringify(
    {
      origin: site.canonicalBase,
      routes: pageRoutes.map(({ path, metadata }) => ({ path, ...metadata })),
      notFound: notFoundMetadata,
    },
    null,
    2,
  ),
);
await fs.rm('dist/.vite/manifest.json');
await fs.rmdir('dist/.vite');
console.log(
  `Prerendered ${pageRoutes.length} pages + real 404; sitemap includes ${indexed.length} canonical pages.`,
);

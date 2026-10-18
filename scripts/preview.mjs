import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};
const exists = async (file) => {
  try {
    return (await fs.stat(file)).isFile();
  } catch {
    return false;
  }
};

/** Local inspection of the generated flat HTML and documented static-host redirects. */
export async function createPreviewServer(directory = 'dist') {
  const root = path.resolve(directory);
  const redirects = (await fs.readFile(path.join(root, '_redirects'), 'utf8'))
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.startsWith('#'))
    .map((line) => line.trim().split(/\s+/));
  return http.createServer(async (request, response) => {
    try {
      if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { Allow: 'GET, HEAD' });
        response.end();
        return;
      }
      const url = new URL(request.url, 'http://localhost');
      const pathname = decodeURIComponent(url.pathname);
      const redirect = redirects.find(([from]) => from === pathname);
      if (redirect) {
        response.writeHead(Number(redirect[2]), {
          Location: `${redirect[1]}${url.search}`,
        });
        response.end();
        return;
      }
      let clean = pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
      const pageFile = path.resolve(
        root,
        `.${clean === '/' ? '/index' : clean}.html`,
      );
      if (
        pageFile.startsWith(`${root}${path.sep}`) &&
        (await exists(pageFile)) &&
        clean !== pathname
      ) {
        response.writeHead(301, { Location: `${clean}${url.search}` });
        response.end();
        return;
      }
      const asset = path.resolve(
        root,
        `.${pathname === '/' ? '/index.html' : pathname}`,
      );
      const allowed =
        asset.startsWith(`${root}${path.sep}`) &&
        !pathname.split('/').some((segment) => segment.startsWith('.'));
      const file =
        allowed && (await exists(asset))
          ? asset
          : allowed && (await exists(pageFile))
            ? pageFile
            : path.join(root, '404.html');
      const notFound = file === path.join(root, '404.html');
      const headers = {
        'Content-Type': types[path.extname(file)] || 'application/octet-stream',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Cache-Control': pathname.startsWith('/assets/')
          ? 'public, max-age=31536000, immutable'
          : 'no-cache',
      };
      if (notFound || ['/privacy-policy', '/terms-of-use'].includes(clean))
        headers['X-Robots-Tag'] = 'noindex, follow';
      response.writeHead(notFound ? 404 : 200, headers);
      response.end(
        request.method === 'HEAD' ? undefined : await fs.readFile(file),
      );
    } catch (error) {
      response.writeHead(error instanceof URIError ? 400 : 500, {
        'Content-Type': 'text/plain',
      });
      response.end('Unable to serve this request.');
    }
  });
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  const portIndex = process.argv.indexOf('--port');
  const port = Number(
    portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT || 4173,
  );
  const server = await createPreviewServer();
  server.listen(port, '127.0.0.1', () =>
    console.log(`Local: http://127.0.0.1:${port}/`),
  );
}

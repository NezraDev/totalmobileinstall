import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { prerenderToNodeStream } from 'react-dom/static';
import { renderToString } from 'react-dom/server';
import { ApplicationContent } from './app/App';
export { pageRoutes, notFoundMetadata } from './seo/routes';
export { renderMetadata, escapeHtml } from './seo/metadata';
export { site } from './config/site';

export async function renderRoute(pathname) {
  const errors = [];
  const tree = (
    <React.StrictMode>
      <StaticRouter location={pathname}>
        <ApplicationContent />
      </StaticRouter>
    </React.StrictMode>
  );
  const { prelude } = await prerenderToNodeStream(tree, {
    onError: (error) => errors.push(error),
    signal: AbortSignal.timeout(30000),
  });
  // Resolve lazy routes first, then serialize a settled tree without streaming
  // replacement scripts or a hidden Suspense fallback. This also works without JS.
  for await (const chunk of prelude) void chunk;
  if (errors.length)
    throw new AggregateError(errors, `Prerender failed for ${pathname}`);
  const html = renderToString(tree);
  if (html.includes('class="route-loading"'))
    throw new Error(`Unresolved static route: ${pathname}`);
  return html;
}

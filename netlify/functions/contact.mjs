import { createContactHandler } from '../../server/contact.mjs';

export const config = { path: '/api/contact' };

export function createNetlifyContactHandler(options) {
  const handle = createContactHandler(options);
  return (request, context = {}) => handle(request, context.ip || 'unknown');
}

export default createNetlifyContactHandler();

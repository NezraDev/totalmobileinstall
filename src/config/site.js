const environment = import.meta.env || {};
const deployedOrigin = 'https://totalmobileinstall.com';
const configuredUrl = new URL(environment.VITE_SITE_URL || deployedOrigin);
if (
  configuredUrl.protocol !== 'https:' &&
  !['localhost', '127.0.0.1'].includes(configuredUrl.hostname)
) {
  throw new Error('VITE_SITE_URL must be an HTTPS production origin.');
}
if (
  configuredUrl.username ||
  configuredUrl.password ||
  configuredUrl.pathname !== '/' ||
  configuredUrl.search ||
  configuredUrl.hash
) {
  throw new Error(
    'VITE_SITE_URL must contain only a website origin, without credentials, a path, query, or fragment.',
  );
}
export const site = {
  canonicalBase: configuredUrl.origin,
  googleVerification: environment.VITE_GOOGLE_SITE_VERIFICATION || '',
  showUnconfirmedClaims: false,
};

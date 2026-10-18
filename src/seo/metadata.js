import { site } from '../config/site';
import { business } from '../content/business';
import { services } from '../content/services';
import { getResponsiveImageProps } from '../content/image-sources';

export function normalizePath(value = '/') {
  const path = new URL(value, site.canonicalBase).pathname
    .replace(/\/{2,}/g, '/')
    .replace(/\/index\.html$/i, '/')
    .replace(/\.html$/i, '')
    .replace(/\/+$/, '');
  return path || '/';
}

export const absoluteUrl = (value) =>
  new URL(value, `${site.canonicalBase}/`).href;
export const escapeHtml = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        character
      ],
  );
export const serializeJsonLd = (value) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

export function createPageMetadata(pathname, options = {}) {
  const path = normalizePath(pathname);
  const image =
    options.image || '/images/services/corvette-blue-windshield.webp';
  const noindex = Boolean(options.noindex);
  const imageInfo = getResponsiveImageProps(image);
  const metadata = {
    path,
    title: options.title || `${business.name} | New Orleans Auto Glass`,
    description:
      options.description ||
      'Explore auto glass, window tint, ADAS calibration, and detailing from Total Mobile Install in New Orleans.',
    canonical: options.notFound ? null : absoluteUrl(path),
    robots: noindex
      ? 'noindex, follow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    image: absoluteUrl(image),
    imageWidth: imageInfo.width,
    imageHeight: imageInfo.height,
    imageAlt:
      options.imageAlt ||
      'Photo-documented auto glass work by Total Mobile Install in New Orleans.',
    noindex,
  };
  metadata.structuredData = structuredData(metadata, options.notFound);
  return metadata;
}

function structuredData(metadata, notFound) {
  if (notFound) return null;
  const organizationId = absoluteUrl('/#business');
  const websiteId = absoluteUrl('/#website');
  const graph = [
    {
      '@type': 'AutomotiveBusiness',
      '@id': organizationId,
      name: business.fullName,
      url: site.canonicalBase,
      telephone: '+15042077742',
      email: business.email,
      address: { '@type': 'PostalAddress', ...business.postalAddress },
      geo: { '@type': 'GeoCoordinates', ...business.geo },
      hasMap: 'https://maps.app.goo.gl/RwCt2X5jmooMkDi8A',
      image: absoluteUrl('/images/services/corvette-blue-windshield.webp'),
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '07:00',
          closes: '17:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '07:00',
          closes: '12:00',
        },
      ],
      areaServed: { '@type': 'City', name: 'New Orleans' },
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: business.name,
      url: absoluteUrl('/'),
      inLanguage: 'en-US',
      publisher: { '@id': organizationId },
    },
    {
      '@type': 'WebPage',
      '@id': `${metadata.canonical}#webpage`,
      url: metadata.canonical,
      name: metadata.title,
      description: metadata.description,
      inLanguage: 'en-US',
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
    },
  ];
  const service = services.find(
    (item) => metadata.path === `/services/${item.id}`,
  );
  if (service) {
    graph.push({
      '@type': 'Service',
      '@id': `${metadata.canonical}#service`,
      name: service.name,
      serviceType: service.name,
      description: service.description,
      url: metadata.canonical,
      provider: { '@id': organizationId },
      areaServed: { '@type': 'City', name: 'New Orleans' },
    });
    graph[2].mainEntity = { '@id': `${metadata.canonical}#service` };
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

/** Same tags are emitted at build time and updated during client navigation. */
export function renderMetadata(metadata) {
  const tags = [
    `<title data-tmi-seo>${escapeHtml(metadata.title)}</title>`,
    ...[
      ['name', 'description', metadata.description],
      ['name', 'robots', metadata.robots],
      ['property', 'og:type', 'website'],
      ['property', 'og:site_name', business.name],
      ['property', 'og:locale', 'en_US'],
      ['property', 'og:title', metadata.title],
      ['property', 'og:description', metadata.description],
      ['property', 'og:image', metadata.image],
      ['property', 'og:image:alt', metadata.imageAlt],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', metadata.title],
      ['name', 'twitter:description', metadata.description],
      ['name', 'twitter:image', metadata.image],
      ['name', 'twitter:image:alt', metadata.imageAlt],
    ].map(
      ([attribute, key, value]) =>
        `<meta data-tmi-seo ${attribute}="${key}" content="${escapeHtml(value)}" />`,
    ),
  ];
  if (metadata.canonical) {
    tags.push(
      `<link data-tmi-seo rel="canonical" href="${escapeHtml(metadata.canonical)}" />`,
    );
    tags.push(
      `<meta data-tmi-seo property="og:url" content="${escapeHtml(metadata.canonical)}" />`,
    );
  }
  if (site.googleVerification)
    tags.push(
      `<meta data-tmi-seo name="google-site-verification" content="${escapeHtml(site.googleVerification)}" />`,
    );
  if (metadata.imageWidth && metadata.imageHeight) {
    tags.push(
      `<meta data-tmi-seo property="og:image:width" content="${metadata.imageWidth}" />`,
    );
    tags.push(
      `<meta data-tmi-seo property="og:image:height" content="${metadata.imageHeight}" />`,
    );
  }
  if (metadata.structuredData)
    tags.push(
      `<script data-tmi-seo id="tmi-structured-data" type="application/ld+json">${serializeJsonLd(metadata.structuredData)}</script>`,
    );
  return tags.join('\n');
}

export function applyMetadata(metadata) {
  const template = document.createElement('template');
  template.innerHTML = renderMetadata(metadata);
  document.head
    .querySelectorAll('[data-tmi-seo]')
    .forEach((element) => element.remove());
  document.head.append(template.content);
}

import { site } from '../config/site';
import { business } from '../content/business';
import { services } from '../content/services';
import { locations, locationPath } from '../content/locations';
import { guides, guidesPublished } from '../content/guides';
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
  metadata.structuredData = structuredData(
    metadata,
    options.notFound,
    options.faq,
  );
  return metadata;
}

const breadcrumbLabels = {
  services: 'Services',
  'service-areas': 'Service Areas',
  'our-work': 'Our Work',
  gallery: 'Gallery',
  faq: 'FAQ',
  contact: 'Contact',
  about: 'About',
  'book-service': 'Book Service',
  'privacy-policy': 'Privacy Policy',
  'terms-of-use': 'Terms of Use',
  guides: 'Guides',
};

const locationForPath = (path) =>
  locations.find((location) => path === locationPath(location.slug));

function breadcrumbs(metadata) {
  const segments = metadata.path.split('/').filter(Boolean);
  const location = locationForPath(metadata.path);
  // Location pages sit under Service Areas; /auto-glass-repair itself redirects there.
  const pages = location
    ? [
        { path: '/service-areas', name: breadcrumbLabels['service-areas'] },
        { path: metadata.path, name: location.name },
      ]
    : segments.map((segment, index) => ({
        path: `/${segments.slice(0, index + 1).join('/')}`,
        name:
          breadcrumbLabels[segment] ||
          (segments[0] === 'guides'
            ? guides.find((item) => item.slug === segment)?.title
            : services.find((item) => item.id === segment)?.name),
      }));
  if (!pages.length || pages.some((page) => !page.name)) return null;
  return {
    '@type': 'BreadcrumbList',
    '@id': `${metadata.canonical}#breadcrumb`,
    itemListElement: [{ path: '/', name: 'Home' }, ...pages].map(
      (page, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: page.name,
        item: absoluteUrl(page.path),
      }),
    ),
  };
}

function structuredData(metadata, notFound, faq) {
  if (notFound) return null;
  const organizationId = absoluteUrl('/#business');
  const websiteId = absoluteUrl('/#website');
  const areaServed = [
    {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', ...business.geo },
      geoRadius: 64374,
    },
    ...business.serviceAreas.map((area) => ({
      '@type': 'AdministrativeArea',
      name: `${area.name}, LA`,
    })),
    ...business.serviceAreas.flatMap((area) =>
      area.places.map((place) => ({ '@type': 'City', name: `${place}, LA` })),
    ),
  ];
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
      hasMap: business.mapsUrl,
      image: absoluteUrl('/images/services/corvette-blue-windshield.webp'),
      logo: absoluteUrl(business.logo),
      sameAs: business.socialProfiles.map((profile) => profile.url),
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+15042077742',
        contactType: 'customer service',
        email: business.email,
        areaServed: 'US',
        availableLanguage: 'English',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Mobile auto glass, tint, calibration, and detailing services',
        itemListElement: services
          .filter((item) => !item.unavailable)
          .map((item) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: item.name,
              url: absoluteUrl(`/services/${item.id}`),
            },
          })),
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '07:00',
          closes: '17:00',
        },
      ],
      areaServed,
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
      areaServed,
    });
    graph[2].mainEntity = { '@id': `${metadata.canonical}#service` };
  }
  const guide = guides.find(
    (item) => metadata.path === `/guides/${item.slug}`,
  );
  if (guide) {
    graph.push({
      '@type': 'Article',
      '@id': `${metadata.canonical}#article`,
      headline: guide.title,
      description: metadata.description,
      image: metadata.image,
      datePublished: guidesPublished,
      dateModified: guidesPublished,
      author: { '@id': organizationId },
      publisher: { '@id': organizationId },
      mainEntityOfPage: { '@id': `${metadata.canonical}#webpage` },
      inLanguage: 'en-US',
    });
    graph[2].mainEntity = { '@id': `${metadata.canonical}#article` };
  }
  const location = locationForPath(metadata.path);
  if (location) {
    graph.push({
      '@type': 'Service',
      '@id': `${metadata.canonical}#service`,
      name: `Mobile auto glass repair in ${location.name === 'West Bank' ? 'the West Bank' : `${location.name}, LA`}`,
      serviceType: 'Auto glass repair',
      description: metadata.description,
      url: metadata.canonical,
      provider: { '@id': organizationId },
      areaServed: location.areaServed,
    });
    graph[2].mainEntity = { '@id': `${metadata.canonical}#service` };
  }
  // Only questions shown on the page, passed in by that page.
  if (faq?.length)
    graph.push({
      '@type': 'FAQPage',
      '@id': `${metadata.canonical}#faq`,
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  const breadcrumb = breadcrumbs(metadata);
  if (breadcrumb) {
    graph.push(breadcrumb);
    graph[2].breadcrumb = { '@id': breadcrumb['@id'] };
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

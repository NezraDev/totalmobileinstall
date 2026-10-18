// Build-only catalog: page components and prerendering share their existing SEO data.
import { data as home } from '../pages/Home/data';
import { data as services } from '../pages/Services/data';
import { data as detail } from '../pages/ServiceDetail/data';
import { data as areas } from '../pages/ServiceAreas/data';
import { data as projects } from '../pages/Projects/data';
import { data as gallery } from '../pages/Gallery/data';
import { data as faq } from '../pages/FAQ/data';
import { data as contact } from '../pages/Contact/data';
import { data as about } from '../pages/About/data';
import { data as booking } from '../pages/BookService/data';
import { data as privacy } from '../pages/Privacy/data';
import { data as terms } from '../pages/Terms/data';
import { data as notFound } from '../pages/NotFound/data';
import { createPageMetadata } from './metadata';

export const pageRoutes = [
  ['/', home, 'Home'],
  ['/services', services, 'Services'],
  ...Object.values(detail.records).map((record) => [
    `/services/${record.id}`,
    record,
    'ServiceDetail',
  ]),
  ['/service-areas', areas, 'ServiceAreas'],
  ['/our-work', projects, 'Projects'],
  ['/gallery', gallery, 'Gallery'],
  ['/faq', faq, 'FAQ'],
  ['/contact', contact, 'Contact'],
  ['/about', about, 'About'],
  ['/book-service', booking, 'BookService'],
  ['/privacy-policy', privacy, 'Privacy'],
  ['/terms-of-use', terms, 'Terms'],
].map(([path, data, component]) => ({
  path,
  module: `src/pages/${component}/${component}.jsx`,
  metadata: createPageMetadata(path, data.seo),
}));

export const notFoundMetadata = createPageMetadata('/404', {
  ...notFound.seo,
  noindex: true,
  notFound: true,
});

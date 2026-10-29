import { business } from '../../content/business';
import { photos } from '../../content/assets';
export const data = {
  sourceStatus:
    'Client-supplied coverage: a 40-mile radius around New Orleans covering the metro area, West Bank, and North Shore. Confirm exact availability for each request.',
  seo: {
    title: 'New Orleans Mobile Service Areas | Total Mobile Install',
    description:
      'Explore our 40-mile mobile service radius from 2642 Tulane Ave in New Orleans, including the metro area, West Bank, and North Shore. Confirm availability for your ZIP code.',
    image: '/images/services/mobile-service-bentley.webp',
  },
  eyebrow: 'Greater New Orleans mobile service',
  title: 'Where We Serve',
  description:
    'Our mobile service area extends 40 miles from our New Orleans shop at 2642 Tulane Ave, covering Greater New Orleans, the West Bank, and the North Shore. Request service at home or work, and contact us to confirm availability for your ZIP code.',
  image: photos.mobileService,
  heading: 'Four specialties. One family-owned operation.',
  paragraphs: [
    'Our team provides auto glass, ADAS calibration, ceramic window tint, and detailing through one family-owned operation.',
    'Tell us where your vehicle is and what it needs. We will confirm the right service and location for your request.',
    'Prefer to bring your vehicle in? Ask about in-shop service at 2642 Tulane Ave in New Orleans.',
  ],
  locationLabel: 'Our location',
  address: business.address,
  modeNote:
    'Interior and hand-wash detailing may be mobile. Paint correction, polishing, and ceramic coating are shop-only.',
  requestLabel: 'Request mobile service',
  requestHref: '/book-service?mode=mobile',
  callLabel: `Call ${business.phone}`,
  phoneHref: business.phoneHref,
  mapHeading: 'Our 40-mile mobile service area from the shop',
};

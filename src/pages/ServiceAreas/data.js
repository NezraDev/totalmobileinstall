import { business } from '../../content/business';
import { photos } from '../../content/assets';
export const data = {
  sourceStatus:
    'Client-supplied coverage: a 40-mile radius around New Orleans covering the metro area, West Bank, and North Shore. Confirm exact availability for each request.',
  seo: {
    title: 'Where We Serve | Total Mobile Install New Orleans',
    description:
      'Our 40-mile service radius around New Orleans covers the metro area, the West Bank, and the North Shore. Dealership-grade work, delivered to you.',
  },
  eyebrow: 'Greater New Orleans mobile service',
  title: 'Where We Serve',
  description:
    'Our 40-mile service radius around New Orleans covers the entire metro area, the West Bank, and the North Shore. Dealership-grade work, delivered to you.',
  image: photos.mobileService,
  heading: 'Four specialties. One family-owned operation.',
  paragraphs: [
    'Our certified team brings auto glass, ADAS calibration, ceramic window tint, and detailing together under one operation.',
    'Tell us where your vehicle is and what it needs. We confirm the right service and location for every request.',
    'Prefer to bring your vehicle in? Ask about in-shop service at our Morrison Road location.',
  ],
  locationLabel: 'Our location',
  address: business.address,
  modeNote:
    'Interior and hand-wash detailing may be mobile. Paint correction, polishing, and ceramic coating are shop-only.',
  requestLabel: 'Check my location',
  requestHref: '/book-service?mode=mobile',
  callLabel: `Call ${business.phone}`,
  phoneHref: business.phoneHref,
  mapHeading: 'Our 40-mile mobile service radius',
};

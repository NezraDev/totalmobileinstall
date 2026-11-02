import { business } from '../../content/business';
import { photos } from '../../content/assets';
export const data = {
  sourceStatus:
    'Client-supplied coverage: a 40-mile radius around New Orleans covering the metro area, West Bank, and North Shore. Confirm exact availability for each request.',
  seo: {
    title: 'Greater New Orleans Service Areas | Total Mobile Install',
    description:
      'Mobile auto glass service within 40 miles of New Orleans, including Metairie, Kenner, Gretna, Harvey, Slidell, Mandeville, and Covington.',
    image: '/images/services/mobile-service-bentley.webp',
  },
  eyebrow: 'Greater New Orleans mobile service',
  title: 'Mobile Auto Glass Service Across Greater New Orleans',
  description:
    'Our mobile service area extends 40 miles from our base in New Orleans, covering Greater New Orleans, the West Bank, and the North Shore. Request service at home or work, and contact us to confirm availability for your ZIP code.',
  image: photos.mobileService,
  heading: 'Four specialties. One family-owned operation.',
  paragraphs: [
    'Our team provides auto glass, ADAS calibration, ceramic window tint, and detailing through one family-owned operation.',
    'Tell us where your vehicle is and what it needs. We will confirm the right service and location for your request.',
  ],
  locationLabel: 'Business address',
  address: business.address,
  modeNote:
    'All services can be requested as mobile service at your home or workplace. The team confirms availability for your address and vehicle.',
  requestLabel: 'Request mobile service',
  requestHref: '/book-service',
  callLabel: `Call ${business.phone}`,
  phoneHref: business.phoneHref,
  mapHeading: 'Our 40-mile mobile service area',
  communitiesHeading: 'Communities in our mobile service area',
  communitiesNote:
    'Do not see your community? If you are within 40 miles of New Orleans, call with your ZIP code and we will confirm availability.',
  communities: business.serviceAreas,
};

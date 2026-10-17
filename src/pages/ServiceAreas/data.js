import { business } from '../../content/business';
import { photos } from '../../content/assets';
export const data = {
  sourceStatus:
    'Draft page using confirmed New Orleans location only. Surrounding coverage requires confirmation and no radius or neighborhood list is asserted.',
  seo: {
    title: 'Mobile Auto Glass Service in New Orleans | Total Mobile Install',
    description:
      'Request mobile auto glass service in New Orleans or visit Total Mobile Install at 5800 Morrison Rd. Contact the team to confirm coverage for your location.',
  },
  eyebrow: 'Rooted in New Orleans',
  title: 'Local care. Wherever your day takes you.',
  description:
    'New Orleans is home. Tell us where your vehicle is located and we will confirm whether mobile service is available for your address and service.',
  image: photos.mobileService,
  heading: 'A local team, ready to help.',
  paragraphs: [
    'Total Mobile Install serves New Orleans and surrounding communities. Mobile availability depends on the service and your location, so every request is confirmed with our team.',
    'Prefer to bring your vehicle in? Ask about in-shop service at our Morrison Road location.',
  ],
  locationLabel: 'Our location',
  address: business.address,
  modeNote:
    'Interior and hand-wash detailing may be mobile. Paint correction, polishing, and ceramic coating are shop-only.',
  requestLabel: 'Check my location',
  requestHref: '/book-service',
  callLabel: `Call ${business.phone}`,
  phoneHref: business.phoneHref,
  mapHeading: 'Find us on Morrison Road',
};

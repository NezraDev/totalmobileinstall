import { business } from '../../content/business';
import { directionsUrl } from '../../integrations/mapConfig';
export const data = {
  sourceStatus:
    'Confirmed business details from supplied homepage. Introductory copy is draft editorial content.',
  seo: {
    title: 'Contact Total Mobile Install | New Orleans Auto Glass',
    description:
      'Contact Total Mobile Install at 2642 Tulane Ave, New Orleans, LA 70119. Call 1-504-207-7742 about auto glass, calibration, tint, detailing, and availability.',
    image: '/images/services/workshop-and-service-van.webp',
  },
  eyebrow: 'Let us take a look',
  title: 'Good service starts with a conversation.',
  description:
    'Tell us what your vehicle needs. Our team can help you choose a service and confirm the next steps.',
  detailsHeading: 'Talk to your local team.',
  phoneLabel: 'Give us a call',
  emailLabel: 'Send us an email',
  addressLabel: 'Find the shop',
  hoursLabel: 'Business hours',
  timezoneNote: 'Hours are listed in New Orleans local time (Central Time).',
  directionsLabel: 'Get directions',
  formHeading: 'Tell us what you need.',
  formDescription:
    'Share your vehicle details and service preference. Our team can confirm availability and next steps.',
  mapHeading: 'Find us on Tulane Avenue',
  business,
  directionsHref: directionsUrl,
};

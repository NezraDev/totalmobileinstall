import { business } from '../../content/business';
import { directionsUrl } from '../../integrations/mapConfig';
export const data = {
  sourceStatus:
    'Confirmed business details from supplied homepage. Introductory copy is draft editorial content.',
  seo: {
    title: 'Contact Total Mobile Install | New Orleans Auto Glass',
    description:
      'Call 1-504-207-7742 or contact Total Mobile Install at 5800 Morrison Rd, New Orleans. Request mobile or in-shop auto glass, tint, calibration, or detailing.',
  },
  eyebrow: 'Let us take a look',
  title: 'Good service starts with a conversation.',
  description:
    'Tell us about your vehicle and what you need. We will help you work out the details and confirm your service request.',
  detailsHeading: 'Talk to your local team.',
  phoneLabel: 'Give us a call',
  emailLabel: 'Send us an email',
  addressLabel: 'Find the shop',
  hoursLabel: 'Business hours',
  timezoneNote: 'All hours are New Orleans time (America/Chicago).',
  directionsLabel: 'Get directions',
  formHeading: 'Tell us what you need.',
  formDescription:
    'Send a service inquiry. The team will confirm availability and the next steps.',
  mapHeading: 'Find us on Morrison Road',
  business,
  directionsHref: directionsUrl,
};

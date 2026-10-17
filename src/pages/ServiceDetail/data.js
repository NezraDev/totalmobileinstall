import { services } from '../../content/services';
import { photos } from '../../content/assets';
const photoMap = {
  repair: photos.glassWork,
  windshield: photos.blueCorvette,
  adas: photos.bmw,
  tint: photos.bentley,
  detailing: photos.redCorvette,
  rearGlass: photos.tesla,
};
export const data = {
  sourceStatus:
    'Client-supplied service details. Exact vehicle eligibility and service availability are confirmed with the team.',
  eyebrow: 'Total Mobile Install services',
  overviewLabel: 'Care, explained.',
  requestLabel: 'Request this service',
  callLabel: 'Talk to the team',
  includedLabel: 'What to discuss with our team',
  relatedLabel: 'Explore our other services',
  inquiryNote:
    'Your request is an inquiry. Our team will confirm the service details, location, and appointment time.',
  records: Object.fromEntries(
    services.map((service) => [
      service.id,
      {
        ...service,
        photo: photoMap[service.imageKey],
        seo: {
          title: `${service.name} in New Orleans | Total Mobile Install`,
          description: `${service.description} Contact Total Mobile Install in New Orleans to discuss your vehicle and request service.`,
        },
        requestHref: `/book-service?service=${service.id}`,
      },
    ]),
  ),
};

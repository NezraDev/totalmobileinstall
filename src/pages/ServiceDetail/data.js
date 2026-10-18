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
const serviceSeo = {
  'auto-glass-repair': {
    title: 'Windshield Repair in New Orleans | Total Mobile Install',
    description:
      'Request windshield chip or crack assessment in New Orleans. Total Mobile Install offers mobile and shop repair requests and guidance when replacement is needed.',
  },
  'windshield-replacement': {
    title: 'Windshield Replacement in New Orleans | Total Mobile Install',
    description:
      'Request OEM-equivalent windshield replacement in New Orleans. Ask about mobile or shop installation, insurance assistance, and ADAS calibration for your vehicle.',
  },
  'adas-calibration': {
    title: 'ADAS Calibration in New Orleans | Total Mobile Install',
    description:
      'Ask about static and dynamic ADAS calibration after windshield work in New Orleans, with OEM targets, scan tooling, and pre- and post-scan reports.',
  },
  'window-tinting': {
    title: 'Ceramic Window Tint in New Orleans | Total Mobile Install',
    description:
      'Explore ceramic and carbon window tint options at Total Mobile Install in New Orleans. Request in-shop installation and ask about film choices and warranty terms.',
  },
  'mobile-detailing': {
    title: 'Mobile & Shop Detailing in New Orleans | Total Mobile Install',
    description:
      'Request mobile interior detailing or hand washing in New Orleans. Paint correction, polishing, and ceramic coating are available at the shop.',
  },
  'side-rear-glass': {
    title: 'Side & Rear Glass in New Orleans | Total Mobile Install',
    description:
      'Request door, quarter, or rear window glass replacement in New Orleans. Share your vehicle details so Total Mobile Install can confirm the correct glass.',
  },
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
          ...serviceSeo[service.id],
          image: photoMap[service.imageKey].src,
        },
        requestHref: `/book-service?service=${service.id}&mode=${service.modes[0]}`,
      },
    ]),
  ),
};

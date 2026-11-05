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
  'windshield-repair': {
    title: 'Windshield & Chip Repair New Orleans | Total Mobile Install',
    description:
      'Windshield chip and crack repair in New Orleans. Our mobile team comes to your home or work and can help with your insurance claim.',
  },
  'windshield-replacement': {
    title: 'Windshield Replacement in New Orleans | Total Mobile Install',
    description:
      'Request OEM-equivalent windshield replacement in New Orleans. Ask about mobile installation, insurance assistance, and ADAS calibration for your vehicle.',
  },
  'adas-calibration': {
    title: 'ADAS Calibration in New Orleans | Total Mobile Install',
    description:
      'Ask about static and dynamic ADAS calibration after windshield work in New Orleans, with OEM targets, scan tooling, and pre- and post-scan reports.',
  },
  'window-tinting': {
    title: 'Ceramic Window Tint in New Orleans | Total Mobile Install',
    description:
      'Window tinting from Total Mobile Install is not available as of now. Explore our mobile auto glass, calibration, and detailing services in New Orleans.',
  },
  'mobile-detailing': {
    title: 'Mobile Detailing in New Orleans | Total Mobile Install',
    description:
      'Request mobile interior detailing, hand washing, paint correction, polishing, or ceramic coating at your home or office in New Orleans.',
  },
  'car-window-replacement': {
    title: 'Car Window Replacement in New Orleans | Total Mobile Install',
    description:
      'Car window replacement in New Orleans for door, quarter, and rear glass. Our mobile team comes to you, including fleet trucks and RVs.',
  },
};
const mobileAreaNote = (work) =>
  `We bring ${work} to you across Greater New Orleans. That includes Metairie, Kenner, Gretna, Harvey, Chalmette, Slidell, Mandeville, and Covington. We confirm your address before we book the visit.`;
const areaNotes = {
  'windshield-repair': mobileAreaNote('windshield repair'),
  'windshield-replacement': mobileAreaNote('windshield replacement'),
  'adas-calibration': mobileAreaNote('calibration'),
  'window-tinting':
    'Window tinting is not available as of now. Our other services remain available across Greater New Orleans.',
  'mobile-detailing': mobileAreaNote('detailing'),
  'car-window-replacement': mobileAreaNote('car window replacement'),
};
export const data = {
  sourceStatus:
    'Client-supplied service details. Exact vehicle eligibility and service availability are confirmed with the team.',
  areasLabel: 'See our service areas',
  faqLabel: 'Read common questions',
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
        areaNote: areaNotes[service.id],
        seo: {
          ...serviceSeo[service.id],
          image: photoMap[service.imageKey].src,
          faq: service.questions,
        },
        requestHref: `/book-service#service=${service.id}`,
      },
    ]),
  ),
};

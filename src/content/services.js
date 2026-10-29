import { site } from '../config/site.js';

export const serviceSpecialties = [
  {
    id: 'auto-glass',
    routeId: 'auto-glass-repair',
    name: 'Auto Glass',
    description:
      'Windshield repair and OEM-equivalent replacement, plus side and rear window glass.',
    imageKey: 'windshield',
  },
  {
    id: 'adas-calibration',
    routeId: 'adas-calibration',
    name: 'Advanced Driver-Assistance Calibration',
    description:
      'Static and dynamic calibration for cameras, radar, and modern driver-assistance systems.',
    imageKey: 'adas',
  },
  {
    id: 'window-tinting',
    routeId: 'window-tinting',
    name: 'Ceramic Window Tinting',
    description:
      'Ceramic and carbon films for heat rejection, UV protection, and a clean fit.',
    imageKey: 'tint',
  },
  {
    id: 'mobile-detailing',
    routeId: 'mobile-detailing',
    name: 'Mobile and Shop Detailing',
    description:
      'Interior detailing and hand washing at your location, with paint and coating work at our shop.',
    imageKey: 'detailing',
  },
];

export const services = [
  {
    id: 'auto-glass-repair',
    specialtyId: 'auto-glass',
    name: 'Windshield Repair',
    short: 'Assess the damage. Find the right next step.',
    detailHeading: 'Windshield chip and crack repair',
    description:
      'A chip or crack does not always mean a new windshield. Our New Orleans team assesses the damage and helps determine whether a repair is suitable for your vehicle.',
    detail:
      'Share your vehicle details and tell us where the glass is damaged. You can request mobile service at home or work, or a visit to our shop. If the damage needs a replacement instead, we will explain the next step and help handle your insurance claim.',
    imageKey: 'repair',
    modes: ['mobile', 'shop'],
    points: [
      'Repair options for eligible chips and cracks',
      'Damage assessment before repair',
      'Mobile or in-shop service requests',
      'Help with insurance claims',
    ],
    modeNote:
      'Mobile technicians serve the New Orleans area; availability is confirmed for your address and vehicle.',
    questions: [
      {
        question: 'Can every windshield chip or crack be repaired?',
        answer:
          'Not every windshield is a repair candidate. Tell us your vehicle details and what part of the glass is damaged so the team can advise whether to request a repair or replacement.',
      },
      {
        question: 'Can I request mobile windshield repair in New Orleans?',
        answer:
          'Yes. Request service at home or work, or ask about an in-shop visit. The team confirms coverage for your address and vehicle before scheduling.',
      },
    ],
  },
  {
    id: 'windshield-replacement',
    specialtyId: 'auto-glass',
    name: 'Windshield Replacement',
    short: 'A precise fit and a clear view ahead.',
    detailHeading: 'Windshield replacement for your vehicle',
    description:
      'When a windshield needs replacing, our technicians confirm the correct OEM-equivalent glass for your vehicle and bring the glass, urethane, and tooling for installation.',
    detail:
      'Request a replacement at your home or office, or arrange in-shop service. Our team helps handle your insurance claim and confirms the installation details, safe drive-away time, and whether your vehicle also requires ADAS calibration.',
    imageKey: 'windshield',
    modes: ['mobile', 'shop'],
    points: [
      'Vehicle-specific windshield selection',
      site.showUnconfirmedClaims
        ? 'OEM-equivalent windshields with a lifetime leak warranty'
        : 'Ask our team about the written warranty terms for your replacement',
      'Vehicle-specific glass and urethane installation',
      'Insurance claims handled for you',
    ],
    modeNote:
      'Safe drive-away time and any warranty details are confirmed by the team.',
    questions: [
      {
        question: 'What information helps you quote a windshield replacement?',
        answer:
          'Share your vehicle year, make, and model, which glass needs replacement, and whether you prefer mobile or in-shop service. The team confirms the correct glass and next steps.',
      },
      {
        question: 'Can you help with an insurance claim?',
        answer:
          'The team can help handle your windshield claim. Coverage, deductible, and approval depend on your insurer and policy.',
      },
    ],
  },
  {
    id: 'adas-calibration',
    specialtyId: 'adas-calibration',
    name: 'ADAS Calibration',
    short: 'Precision for the technology ahead.',
    detailHeading: 'Advanced Driver-Assistance Calibration',
    description:
      'Modern vehicles need precise camera and radar calibration after windshield work. We use OEM targets and scan tools to restore lane keeping, collision warning, and adaptive cruise systems to spec.',
    detail:
      'We check your vehicle requirements and confirm the right static or dynamic calibration procedure. Pre- and post-scan reports are included.',
    imageKey: 'adas',
    modes: ['mobile', 'shop'],
    points: [
      'Static and dynamic calibrations',
      'OEM calibration targets and scan tools',
      'Pre- and post-scan reports included',
      'Domestic, European, and Asian makes',
    ],
    modeNote:
      'Choose a preferred location. The team will confirm the right calibration procedure and setting for your vehicle.',
    questions: [
      {
        question: 'Will my vehicle need ADAS calibration after windshield replacement?',
        answer:
          'Some modern vehicles require camera or radar calibration after windshield work. Share your vehicle details so the team can check which procedure it needs.',
      },
      {
        question: 'Do you perform static and dynamic ADAS calibration?',
        answer:
          'The service includes static and dynamic calibration requests. The right procedure and service setting depend on your vehicle and will be confirmed by the team.',
      },
    ],
  },
  {
    id: 'window-tinting',
    specialtyId: 'window-tinting',
    name: 'Window Tinting',
    short: 'Comfort, clarity, and a clean finish.',
    detailHeading: 'Ceramic Window Tinting',
    description:
      'Choose ceramic and carbon films for heat rejection and UV protection in the Louisiana sun. Ask the team which film fits your vehicle.',
    detail:
      site.showUnconfirmedClaims
        ? 'Choose from ceramic and carbon film options. We use computer-cut patterns for clean edges, and the lifetime film warranty covers bubbling, peeling, or fading.'
        : 'Choose from ceramic and carbon film options. We use computer-cut patterns for clean edges. Ask our team for the written warranty terms for the film you choose.',
    imageKey: 'tint',
    modes: ['shop'],
    points: [
      'Ceramic and carbon film options',
      'Film options for heat rejection and UV protection',
      'Computer-cut patterns for clean edges',
      site.showUnconfirmedClaims
        ? 'Lifetime film warranty against bubbling, peeling, or fading'
        : 'Ask about the written warranty terms for your selected film',
    ],
    modeNote:
      'Window tint installation is available in-shop for a clean, controlled finish.',
    questions: [
      {
        question: 'Is window tint installation mobile?',
        answer:
          'Window tint is installed in the shop. Contact the team to discuss ceramic or carbon film options for your vehicle.',
      },
      {
        question: 'Should I ask about Louisiana tint requirements?',
        answer:
          'Yes. The team can help you choose film for your vehicle and discuss the applicable Louisiana tint requirements.',
      },
    ],
  },
  {
    id: 'mobile-detailing',
    specialtyId: 'mobile-detailing',
    name: 'Mobile Detailing',
    short: 'Thoughtful interior care and a polished finish.',
    detailHeading: 'Mobile and Shop Detailing',
    description:
      'Interior deep cleans and hand washes are available at your home or office. Exterior paint correction, polishing, and ceramic coating are performed at our shop at 2642 Tulane Ave.',
    detail:
      'Choose the detailing service that fits your vehicle. Mobile appointments cover interior steam and shampoo, plus hand washing and decontamination. Paint correction, polishing, and ceramic coating packages are shop-only.',
    imageKey: 'detailing',
    modes: ['mobile', 'shop'],
    points: [
      'Interior steam and shampoo (mobile)',
      'Hand wash and decontamination (mobile)',
      'Paint correction and polishing (shop only)',
      'Ceramic coating packages (shop only)',
    ],
    modeNote:
      'Mobile service covers interior detailing and hand washing. Paint correction, polishing, and ceramic coating are shop-only.',
    questions: [
      {
        question: 'Which detailing services are available at my home or office?',
        answer:
          'Interior detailing and hand washing may be requested as mobile service. The team confirms availability for your address.',
      },
      {
        question: 'Which detailing work is done at the shop?',
        answer:
          'Paint correction, polishing, and ceramic coating are shop-only. Contact the team to discuss the right service for your vehicle.',
      },
    ],
  },
  {
    id: 'side-rear-glass',
    specialtyId: 'auto-glass',
    name: 'Side & Rear Glass Replacement',
    short: 'Put broken glass behind you.',
    detailHeading: 'Side and rear window glass replacement',
    description: 'We replace door, quarter, and rear window glass.',
    detail:
      'Tell us which window is damaged and share your vehicle details. Our team will confirm the correct glass, service location, and next steps.',
    imageKey: 'rearGlass',
    modes: ['mobile', 'shop'],
    points: [
      'Door and quarter glass',
      'Rear window replacement',
      'Vehicle-specific glass assessment',
    ],
    modeNote:
      'Choose a preferred location. The team will confirm availability for your vehicle and glass type.',
    questions: [
      {
        question: 'Do you replace door and rear window glass?',
        answer:
          'Yes. The service covers door, quarter, and rear window glass. Share your vehicle details and which window is damaged so the team can confirm the correct glass.',
      },
      {
        question: 'Can I request mobile side or rear glass replacement?',
        answer:
          'You can request mobile or in-shop service. The team confirms availability for your vehicle, glass type, and location.',
      },
    ],
  },
];

export const serviceModes = {
  mobile: 'Mobile Service',
  shop: 'Shop',
};

const detailingShopOnlyTypes = new Set([
  'paint-correction',
  'polishing',
  'ceramic-coating',
]);
const detailingMobileOnlyTypes = new Set(['interior', 'hand-wash']);

export function getAvailableServiceModes(service, detailType = '') {
  if (!service) return [];
  if (service.id === 'mobile-detailing') {
    if (detailingShopOnlyTypes.has(detailType)) return ['shop'];
    if (detailingMobileOnlyTypes.has(detailType)) return ['mobile'];
    return [];
  }
  return service.modes.filter((mode) => mode === 'mobile' || mode === 'shop');
}

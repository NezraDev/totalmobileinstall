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
    name: 'Premium Ceramic Window Tinting',
    description:
      'Ceramic and carbon films for heat rejection, UV protection, and a clean fit.',
    imageKey: 'tint',
  },
  {
    id: 'mobile-detailing',
    routeId: 'mobile-detailing',
    name: 'Showroom-Finish Mobile Detailing',
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
      'Chip and crack repair in under 30 minutes',
      'Damage assessment before repair',
      'Mobile or in-shop service requests',
      'Insurance claims handled for you',
    ],
    modeNote:
      'Mobile technicians serve the New Orleans area; availability is confirmed for your address and vehicle.',
  },
  {
    id: 'windshield-replacement',
    specialtyId: 'auto-glass',
    name: 'Windshield Replacement',
    short: 'A precise fit and a clear view ahead.',
    detailHeading: 'Windshield replacement for your vehicle',
    description:
      'When a windshield needs replacing, our technicians confirm the correct OEM-equivalent glass for your vehicle and bring the glass, urethane, and tooling for a factory-quality installation.',
    detail:
      'Request a replacement at your home or office, or arrange in-shop service. Our team helps handle your insurance claim and confirms the installation details, safe drive-away time, and whether your vehicle also requires ADAS calibration.',
    imageKey: 'windshield',
    modes: ['mobile', 'shop'],
    points: [
      'Vehicle-specific windshield selection',
      'OEM-equivalent windshields with a lifetime leak warranty',
      'Factory-quality urethane installation',
      'Insurance claims handled for you',
    ],
    modeNote:
      'Safe drive-away time and any warranty details are confirmed by the team.',
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
      'Our certified team checks the vehicle requirements and confirms the right static or dynamic calibration procedure. Pre- and post-scan reports are included.',
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
  },
  {
    id: 'window-tinting',
    specialtyId: 'window-tinting',
    name: 'Window Tinting',
    short: 'Comfort, clarity, and a clean finish.',
    detailHeading: 'Premium Ceramic Window Tinting',
    description:
      'Stay cool in the Louisiana sun with ceramic films that reject heat and block up to 99% of UV rays without interfering with vehicle electronics.',
    detail:
      'Choose from ceramic and carbon film options. We use computer-cut patterns for clean edges, and the lifetime film warranty covers bubbling, peeling, or fading.',
    imageKey: 'tint',
    modes: ['shop'],
    points: [
      'Ceramic and carbon film options',
      'Up to 99% UV rejection',
      'Computer-cut patterns for clean edges',
      'Lifetime film warranty against bubbling, peeling, or fading',
    ],
    modeNote:
      'Window tint installation is available in-shop for a clean, controlled finish.',
  },
  {
    id: 'mobile-detailing',
    specialtyId: 'mobile-detailing',
    name: 'Mobile Detailing',
    short: 'Thoughtful interior care and a polished finish.',
    detailHeading: 'Showroom-Finish Mobile Detailing',
    description:
      'Interior deep cleans and hand washes are available at your home or office. Exterior paint correction, polishing, and ceramic coating are performed at our shop at 2642 Tulane Ave for a controlled, dust-free, climate-stable finish.',
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

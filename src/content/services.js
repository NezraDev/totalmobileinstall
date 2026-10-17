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
    short: 'Windshield Repair & Replacement',
    detailHeading: 'Windshield Repair & Replacement',
    description:
      'From chip repair to a full OEM-equivalent windshield replacement, our mobile technicians bring the right glass, urethane, and tooling to your home or office for a factory-quality install.',
    detail:
      'We assess the damage and help determine whether a repair or replacement is the right next step. Our team can also replace side and rear window glass and handle insurance claims for you.',
    imageKey: 'repair',
    modes: ['mobile', 'shop'],
    points: [
      'Chip and crack repair in under 30 minutes',
      'OEM-equivalent windshields with a lifetime leak warranty',
      'Side and rear window glass replacement',
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
    detailHeading: 'Windshield Repair & Replacement',
    description:
      'Mobile windshield repair and OEM-equivalent replacement with a factory-quality installation.',
    detail:
      'Our mobile technicians come to your home or office with the right glass, urethane, and tooling. We will assess whether a chip or crack can be repaired, confirm the correct windshield for your vehicle, and help handle the insurance claim.',
    imageKey: 'windshield',
    modes: ['mobile', 'shop'],
    points: [
      'Chip and crack repair in under 30 minutes',
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
    modes: ['confirm'],
    points: [
      'Static and dynamic calibrations',
      'OEM targets and scan tooling',
      'Pre- and post-scan reports included',
      'Domestic, European, and Asian makes',
    ],
    modeNote:
      'Calibration needs and service location are confirmed for your vehicle.',
  },
  {
    id: 'window-tinting',
    specialtyId: 'window-tinting',
    name: 'Window Tinting',
    short: 'Comfort, clarity, and a clean finish.',
    detailHeading: 'Premium Ceramic Window Tinting',
    description:
      'Stay cool in the Louisiana sun with ceramic films that reject heat and up to 99% of UV rays without interfering with vehicle electronics.',
    detail:
      'Choose from ceramic and carbon film options. We use computer-cut patterns for clean edges, and the film warranty covers bubbling, peeling, or fading for life.',
    imageKey: 'tint',
    modes: ['confirm'],
    points: [
      'Ceramic and carbon film options',
      'Up to 99% UV rejection',
      'Computer-cut patterns for clean edges',
      'Lifetime film warranty against bubbling, peeling, or fading',
    ],
    modeNote:
      'Installation location and film specifications are confirmed with the team.',
  },
  {
    id: 'mobile-detailing',
    specialtyId: 'mobile-detailing',
    name: 'Mobile Detailing',
    short: 'Thoughtful interior care and a polished finish.',
    detailHeading: 'Showroom-Finish Mobile Detailing',
    description:
      'Interior deep cleans and hand washes are available at your home or office. Exterior paint correction, polishing, and ceramic coating are performed at our shop at 5800 Morrison Rd for a controlled, dust-free, climate-stable finish.',
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
    detailHeading: 'Side and Rear Window Glass',
    description: 'Replacement for door, quarter, and rear window glass.',
    detail:
      'Tell us which window is damaged and share your vehicle details. Our team will confirm the correct glass, service location, and next steps.',
    imageKey: 'rearGlass',
    modes: ['confirm'],
    points: [
      'Door and quarter glass',
      'Rear window replacement',
      'Vehicle-specific glass assessment',
    ],
    modeNote:
      'The team will confirm service mode for your vehicle and glass type.',
  },
];

export const serviceModes = {
  mobile: 'Mobile service',
  shop: 'In-shop service',
  confirm: 'Confirm with the team',
};

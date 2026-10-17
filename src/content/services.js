export const services = [
  {
    id: 'auto-glass-repair',
    name: 'Auto Glass Repair',
    short: 'A small chip deserves expert attention.',
    description: 'Chip and crack repair using premium OEM-grade resins.',
    detail:
      'Tell us where the damage is and how it happened. Our team can assess whether a repair is appropriate or whether replacement is needed.',
    imageKey: 'repair',
    modes: ['mobile', 'shop'],
    points: [
      'Chip and crack assessment',
      'Careful repair using premium resins',
      'Service for your vehicle and damage',
    ],
    modeNote: 'Our team will confirm mobile availability for your repair.',
  },
  {
    id: 'windshield-replacement',
    name: 'Windshield Replacement',
    short: 'A fresh view. A precise fit.',
    description:
      'Mobile installation with factory-spec glass for your vehicle.',
    detail:
      'From damaged glass removal to a carefully fitted replacement, we help you get a clear view again. Tell us your vehicle details so we can discuss the right glass and next steps.',
    imageKey: 'windshield',
    modes: ['mobile', 'shop'],
    points: [
      'Vehicle-specific glass',
      'Mobile and in-shop requests',
      'ADAS needs discussed with your technician',
    ],
    modeNote:
      'Safe drive-away time and any warranty details are confirmed by the team.',
  },
  {
    id: 'adas-calibration',
    name: 'ADAS Calibration',
    short: 'Precision for the technology ahead.',
    description: 'Calibration for lane assist, collision warning, and more.',
    detail:
      'Modern driver assistance systems can depend on cameras and sensors associated with the windshield. Ask our team about calibration requirements for your specific vehicle.',
    imageKey: 'adas',
    modes: ['confirm'],
    points: [
      'Vehicle-specific assessment',
      'Lane assistance systems',
      'Forward collision warning systems',
    ],
    modeNote:
      'The team will confirm the required location and calibration procedure.',
  },
  {
    id: 'window-tinting',
    name: 'Window Tinting',
    short: 'Comfort, clarity, and a clean finish.',
    description: 'Premium ceramic films for heat rejection and UV block.',
    detail:
      'Discuss your vehicle, comfort needs, and film options with our team. We will help you choose an appropriate tint and confirm installation details.',
    imageKey: 'tint',
    modes: ['confirm'],
    points: [
      'Ceramic film options',
      'Vehicle-specific consultation',
      'Carefully finished installation',
    ],
    modeNote:
      'Installation location and film specifications are confirmed with the team.',
  },
  {
    id: 'mobile-detailing',
    name: 'Mobile Detailing',
    short: 'Care in every detail.',
    description:
      'Interior and hand-wash mobile detailing. Paint correction, polishing, and ceramic coating are shop-only.',
    detail:
      'Choose interior care or a hand wash for a mobile request. For paint correction, polishing, and ceramic coating, request an in-shop service.',
    imageKey: 'detailing',
    modes: ['mobile', 'shop'],
    points: [
      'Mobile interior detailing',
      'Mobile hand washing',
      'Shop-only paint correction, polishing, and ceramic coating',
    ],
    modeNote:
      'Mobile service is limited to interior detailing and hand washing.',
  },
  {
    id: 'side-rear-glass',
    name: 'Side & Rear Glass',
    short: 'Put broken glass behind you.',
    description: 'Door, quarter, and rear window glass replacement.',
    detail:
      'Let us know which window is damaged and share your vehicle details. Our team will confirm the glass needed, service location, and next steps.',
    imageKey: 'rearGlass',
    modes: ['confirm'],
    points: ['Door window glass', 'Quarter glass', 'Rear window glass'],
    modeNote:
      'The team will confirm service mode for your vehicle and glass type.',
  },
];
export const serviceModes = {
  mobile: 'Mobile service',
  shop: 'In-shop service',
  confirm: 'Confirm with the team',
};

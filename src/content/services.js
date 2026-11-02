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
    name: 'Mobile Detailing',
    description:
      'Interior detailing, hand washing, paint correction, polishing, and ceramic coating at your location.',
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
      'Share your vehicle details and tell us where the glass is damaged. You can request mobile service at home or work. If the damage needs a replacement instead, we will explain the next step and help handle your insurance claim.',
    imageKey: 'repair',
    points: [
      'Repair options for eligible chips and cracks',
      'Damage assessment before repair',
      'Mobile service requests',
      'Help with insurance claims',
    ],
    modeNote:
      'Mobile technicians serve the New Orleans area; availability is confirmed for your address and vehicle.',
    guide: {
      heading: 'Repair or replace a damaged windshield?',
      paragraphs: [
        'Small chips are often the best candidates for repair, especially when they are looked at early, before dirt and moisture settle into the damage. Size, depth, and position all matter. A crack that reaches the edge of the glass, damage directly in the driver’s line of sight, or damage near a windshield-mounted camera can point toward replacement instead.',
        'Heat, sudden temperature changes, and rough roads can make a small chip spread, so it is worth having damage checked soon. Tell us your vehicle year, make, and model, and describe where the damage is and how large it looks. That gives the team what it needs to advise you on the next step.',
      ],
    },
    questions: [
      {
        question: 'Can every windshield chip or crack be repaired?',
        answer:
          'Not every windshield is a repair candidate. Tell us your vehicle details and what part of the glass is damaged so the team can advise whether to request a repair or replacement.',
      },
      {
        question: 'Can I request mobile windshield repair in New Orleans?',
        answer:
          'Yes. Request service at home or work. The team confirms coverage for your address and vehicle before scheduling.',
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
      'Request a replacement at your home or office. Our team helps handle your insurance claim and confirms the installation details, safe drive-away time, and whether your vehicle also requires ADAS calibration.',
    imageKey: 'windshield',
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
    guide: {
      heading: 'What to expect from a windshield replacement',
      paragraphs: [
        'A standard replacement takes 45 to 90 minutes on-site, followed by a 30 to 60 minute safe drive-away window. The exact cure time depends on the adhesive and the outdoor temperature, so your technician will tell you when the vehicle is ready to drive.',
        'Windshields differ by vehicle and equipment. Rain sensors, heated glass, and driver-assistance cameras can all change which glass fits, so your year, make, and model help the team find the right part. If your vehicle has a camera mounted at the windshield, ask whether it needs ADAS calibration after the new glass is installed.',
      ],
    },
    questions: [
      {
        question: 'What information helps you quote a windshield replacement?',
        answer:
          'Share your vehicle year, make, and model, which glass needs replacement, and where the vehicle will be. The team confirms the correct glass and next steps.',
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
    points: [
      'Static and dynamic calibrations',
      'OEM calibration targets and scan tools',
      'Pre- and post-scan reports included',
      'Domestic, European, and Asian makes',
    ],
    modeNote:
      'Choose a preferred location. The team will confirm the right calibration procedure and setting for your vehicle.',
    guide: {
      heading: 'Why calibration can matter after windshield work',
      paragraphs: [
        'Many driver-assistance features rely on a forward-facing camera mounted at the windshield or on radar sensors at the front of the vehicle. Lane keeping, collision warning, and adaptive cruise depend on those sensors reading the road correctly, and windshield work can change what they need.',
        'Static calibration is done with targets in a controlled setup, while dynamic calibration is completed on the road under the right driving conditions. Some vehicles require one, some the other, and some both. Share your vehicle details so the team can check the procedure that applies, with pre- and post-scan reports included.',
      ],
    },
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
    unavailable: true,
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
    points: [
      'Ceramic and carbon film options',
      'Film options for heat rejection and UV protection',
      'Computer-cut patterns for clean edges',
      site.showUnconfirmedClaims
        ? 'Lifetime film warranty against bubbling, peeling, or fading'
        : 'Ask about the written warranty terms for your selected film',
    ],
    modeNote:
      'Window tinting is not available as of now.',
    guide: {
      heading: 'Choosing window tint for New Orleans driving',
      paragraphs: [
        'Ceramic and carbon films both help with heat and UV exposure without the signal interference that metallic films can cause. Ceramic film generally offers stronger heat rejection, while carbon film is a popular option for a deep, even look. The team can walk you through both for your vehicle and how you drive.',
        'For most vehicles, Louisiana requires at least 25% visible-light transmission on front and rear side windows and at least 12% on the rearmost window, with some exemptions by vehicle type. Our FAQ explains these requirements in more detail, and the team can help match film to your vehicle.',
      ],
    },
    questions: [
      {
        question: 'Can I request window tinting right now?',
        answer:
          'Window tinting is not available as of now. Contact the team if you have questions about ceramic or carbon film for your vehicle.',
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
    detailHeading: 'Mobile Detailing at Your Location',
    description:
      'Interior deep cleans, hand washes, paint correction, polishing, and ceramic coating can all be requested at your home or office.',
    detail:
      'Choose the detailing service that fits your vehicle. Mobile appointments cover interior steam and shampoo, hand washing and decontamination, paint correction, polishing, and ceramic coating packages.',
    imageKey: 'detailing',
    points: [
      'Interior steam and shampoo',
      'Hand wash and decontamination',
      'Paint correction and polishing',
      'Ceramic coating packages',
    ],
    modeNote:
      'All detailing services can be requested as mobile service. The team confirms availability for your address and vehicle.',
    guide: {
      heading: 'Which detailing service fits your vehicle?',
      paragraphs: [
        'Choose a deep interior clean or a careful hand wash when everyday use has caught up with your vehicle. Interior steam and shampoo address seats, carpets, and everyday buildup, while hand washing and decontamination take care of the exterior surface.',
        'Choose paint correction or polishing when the paint itself needs attention, and ceramic coating when you want a protective layer afterward. Tell us about your vehicle and what you would like improved, and the team will suggest where to start.',
      ],
    },
    questions: [
      {
        question: 'Which detailing services are available at my home or office?',
        answer:
          'All detailing services may be requested as mobile service, including interior detailing, hand washing, paint correction, polishing, and ceramic coating. The team confirms availability for your address.',
      },
      {
        question: 'What should I share when I request detailing?',
        answer:
          'Share your vehicle details and the detailing work you would like. Contact the team to discuss the right service for your vehicle.',
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
    points: [
      'Door and quarter glass',
      'Rear window replacement',
      'Vehicle-specific glass assessment',
    ],
    modeNote:
      'Choose a preferred location. The team will confirm availability for your vehicle and glass type.',
    guide: {
      heading: 'What to do about a broken side or rear window',
      paragraphs: [
        'Side and rear windows are commonly made of tempered glass, which breaks into many small pieces instead of cracking in place. Those pieces can end up inside the door, on the seats, and in the cargo area, and they can interfere with window or lock mechanisms. Avoid running a damaged power window until it has been looked at.',
        'When you reach out, tell us which window broke and whether it is a door, quarter, or rear window. Mention any rear defroster, antenna, or tint on that glass, along with your vehicle year, make, and model. Those details help the team confirm the correct glass and the next step.',
      ],
    },
    questions: [
      {
        question: 'Do you replace door and rear window glass?',
        answer:
          'Yes. The service covers door, quarter, and rear window glass. Share your vehicle details and which window is damaged so the team can confirm the correct glass.',
      },
      {
        question: 'Can I request mobile side or rear glass replacement?',
        answer:
          'You can request mobile service. The team confirms availability for your vehicle, glass type, and location.',
      },
    ],
  },
];


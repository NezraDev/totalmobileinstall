import { site } from '../config/site.js';

export const serviceSpecialties = [
  {
    id: 'auto-glass',
    routeId: 'windshield-repair',
    name: 'Auto Glass',
    description:
      'Windshield repair and OEM-equivalent replacement, plus car window replacement.',
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
    id: 'windshield-repair',
    linkLabel: 'Explore windshield chip repair',
    specialtyId: 'auto-glass',
    name: 'Windshield Repair',
    short: 'Assess the damage. Find the right next step.',
    detailHeading: 'Windshield Chip Repair',
    description:
      'A chip or crack does not always mean a new windshield. Our New Orleans team looks at the damage and tells you if a repair will work.',
    detail:
      'Share your vehicle details and tell us where the glass is damaged. We come to your home or work. If you need a new windshield instead, we explain the next step and help with your insurance claim.',
    imageKey: 'repair',
    points: [
      'Repair options for eligible chips and cracks',
      'Damage assessment before repair',
      'Mobile service requests',
      'Help with insurance claims',
    ],
    modeNote:
      'Our mobile team serves the New Orleans area. We confirm the time for your address and vehicle.',
    guide: {
      heading: 'Repair or replace a damaged windshield?',
      paragraphs: [
        'Small chips are often the easiest to repair, especially when they are checked early. Over time, dirt and water settle into the damage. Size, depth, and position all matter. A crack that reaches the edge of the glass, damage in front of the driver, or damage near a windshield camera can point to a new windshield instead.',
        'Heat, sudden temperature changes, and rough roads can make a small chip spread. So it is worth having it checked soon. Tell us your vehicle year, make, and model, where the damage is, and how big it looks. Then the team can tell you the next step.',
      ],
    },
    sections: [
      {
        heading: 'Why a small chip should not wait',
        paragraphs: [
          'A chip is a small break in the outer layer of the windshield. Heat, sudden temperature changes, and potholes all put stress on the glass. In New Orleans, a hot afternoon and a cool evening can be enough to turn a chip into a crack.',
          'The sooner the damage is looked at, the better the chance that repair is still an option. Our team decides between repair and replacement after seeing the damage, and we tell you plainly which one fits.',
        ],
      },
      {
        heading: 'Cracks in the windshield',
        paragraphs: [
          'A crack is longer damage that can grow across the glass. Some cracks can be repaired, and some mean the windshield should be replaced. A crack in front of the driver, near the edge of the glass, or near a windshield camera often points to replacement.',
          'Tell us where the crack starts and how long it looks. The team will advise the next step before anyone drives out.',
        ],
      },
      {
        heading: 'What the repair visit looks like',
        paragraphs: [
          'Our technician comes to your home or workplace and looks at the damage first. If repair is the right call, the work is done right there. If the windshield needs replacing instead, we explain why and help you plan that visit.',
        ],
      },
      {
        heading: 'Help with your insurance claim',
        paragraphs: [
          'Many drivers have glass coverage. We can help with your claim. Your insurer and your policy decide what is covered and what you pay, so check your policy before the visit.',
        ],
      },
    ],
    questions: [
      {
        question: 'Do you do mobile windshield chip repair in New Orleans?',
        answer:
          'Yes. Windshield chip repair is a mobile service. We come to your home or workplace anywhere in our 40-mile service area around New Orleans.',
      },
      {
        question: 'How do I know if my chip can be repaired?',
        answer:
          'The team decides after seeing the damage. Size, depth, and position all matter, so we look at the chip before we recommend repair or replacement.',
      },
      {
        question: 'Can every windshield chip or crack be repaired?',
        answer:
          'Not every chip or crack can be repaired. Tell us your vehicle and where the glass is damaged. The team will tell you whether to ask for a repair or a new windshield.',
      },
      {
        question: 'Can I request mobile windshield repair in New Orleans?',
        answer:
          'Yes. We come to your home or work. The team confirms your address and vehicle before booking the visit.',
      },
    ],
  },
  {
    id: 'windshield-replacement',
    linkLabel: 'Explore windshield replacement',
    specialtyId: 'auto-glass',
    name: 'Windshield Replacement',
    short: 'A precise fit and a clear view ahead.',
    detailHeading: 'Windshield replacement for your vehicle',
    description:
      'When a windshield needs replacing, we confirm the right OEM-equivalent glass for your vehicle. Then we bring the glass, adhesive, and tools to you.',
    detail:
      'Request a replacement at your home or office. We help with your insurance claim. We also tell you the safe drive-away time and whether your car needs ADAS calibration.',
    imageKey: 'windshield',
    points: [
      'The right windshield for your vehicle',
      site.showUnconfirmedClaims
        ? 'OEM-equivalent windshields with a lifetime leak warranty'
        : 'Ask our team about the written warranty terms for your replacement',
      'Installed with fresh adhesive',
      'Insurance claims handled for you',
    ],
    modeNote:
      'The team confirms the safe drive-away time and any warranty details.',
    guide: {
      heading: 'What to expect from a windshield replacement',
      paragraphs: [
        'A standard replacement takes 45 to 90 minutes on site. Then you wait 30 to 60 minutes before you drive. The exact time depends on the adhesive and the weather, and your technician will tell you when the car is ready.',
        'Windshields differ by vehicle. Rain sensors, heated glass, and cameras can all change which glass fits. Your year, make, and model help the team find the right part. If your car has a camera at the windshield, ask whether it needs ADAS calibration after the new glass is in.',
      ],
    },
    sections: [
      {
        heading: 'Getting the right glass for your vehicle',
        paragraphs: [
          'Windshields are made for each vehicle. Rain sensors, heated glass, and cameras all change which one fits. Share your year, make, and model when you request service, and the team confirms the correct OEM-equivalent glass before the visit.',
        ],
      },
      {
        heading: 'ADAS calibration after a new windshield',
        paragraphs: [
          'Many newer vehicles have a camera at the windshield for lane keeping and collision warning. That camera may need calibration after the new glass is in. Ask the team whether your vehicle needs it. We offer static and dynamic calibration, with pre- and post-scan reports.',
        ],
      },
      {
        heading: 'How long it takes',
        paragraphs: [
          'A standard replacement takes 45 to 90 minutes on site. After that, plan on a 30 to 60 minute safe drive-away window while the adhesive sets. Your technician will tell you when the vehicle is ready to drive.',
        ],
      },
      {
        heading: 'Insurance help',
        paragraphs: [
          'Our team helps handle your windshield claim. Your insurer and your policy decide what is covered and what you pay.',
        ],
      },
      {
        heading: 'Fleet trucks, commercial vehicles, and RVs',
        paragraphs: [
          'We replace windshields on fleet and commercial trucks, and on RVs and motorhomes. For a fleet, tell us how many vehicles need glass and where they are parked. For an RV, share the year, make, and model so the team can confirm the glass.',
        ],
      },
    ],
    questions: [
      {
        question: 'Can you replace the windshield on my RV or truck?',
        answer:
          'Yes. We work on fleet and commercial trucks and on RV and motorhome glass. Share your vehicle details, and the team will confirm the right windshield before scheduling.',
      },
      {
        question: 'Can I drive right after a windshield replacement?',
        answer:
          'Wait for the safe drive-away time your technician gives you, usually 30 to 60 minutes. The exact time depends on the adhesive and the outdoor temperature.',
      },
      {
        question: 'What do you need to quote a windshield replacement?',
        answer:
          'Share your vehicle year, make, and model, which glass needs replacing, and where the car will be. The team confirms the right glass and the next steps.',
      },
      {
        question: 'Can you help with an insurance claim?',
        answer:
          'The team can help handle your windshield claim. Your insurer and your policy decide what is covered and what you pay.',
      },
    ],
  },
  {
    id: 'adas-calibration',
    linkLabel: 'Explore ADAS calibration',
    specialtyId: 'adas-calibration',
    name: 'ADAS Calibration',
    short: 'Precision for the technology ahead.',
    detailHeading: 'Advanced Driver-Assistance Calibration',
    description:
      'Many newer cars need their cameras and radar set up again after windshield work. We use OEM targets and scan tools to bring lane keeping, collision warning, and adaptive cruise back to spec.',
    detail:
      'We check what your vehicle needs and confirm the right static or dynamic procedure. Pre- and post-scan reports are included.',
    imageKey: 'adas',
    points: [
      'Static and dynamic calibrations',
      'OEM calibration targets and scan tools',
      'Pre- and post-scan reports included',
      'Domestic, European, and Asian makes',
    ],
    modeNote:
      'Choose where you want the work done. The team confirms the right procedure and setting for your vehicle.',
    guide: {
      heading: 'Why calibration can matter after windshield work',
      paragraphs: [
        'Many safety features use a camera at the windshield or radar at the front of the car. Lane keeping, collision warning, and adaptive cruise need those sensors to read the road correctly. Windshield work can throw them off.',
        'Static calibration uses targets in a set-up space. Dynamic calibration is done on the road in the right driving conditions. Some vehicles need one, some the other, and some both. Share your vehicle details, and the team will check which one applies. Pre- and post-scan reports are included.',
      ],
    },
    sections: [
      {
        heading: 'Why calibration matters',
        paragraphs: [
          'Safety features work only as well as the camera and sensors behind them. A camera that sits a little off can read the lane in the wrong place. Calibration sets it back to the automaker spec, so lane keeping and collision warning see the road the right way.',
        ],
      },
      {
        heading: 'When calibration is needed',
        paragraphs: [
          'Calibration is often needed after a new windshield. It can also be needed after other work that moves a camera or sensor. Each automaker sets its own rules. Share your vehicle and the work done, and the team will check what applies. If you are not sure, ask before your windshield is replaced.',
        ],
      },
      {
        heading: 'What the scan reports show',
        paragraphs: [
          'A pre-scan checks the vehicle systems before the work begins. A post-scan checks them again afterward. Both reports are included, so you have a record of the work for your files or your insurer.',
        ],
      },
      {
        heading: 'After the work',
        paragraphs: [
          'Pay attention to dashboard warning lights and to how lane keeping feels on the road. If something seems off after glass work, contact the team so they can check it.',
        ],
      },
    ],
    questions: [
      {
        question: 'Can ADAS calibration be done at my location?',
        answer:
          'Yes, you can ask for calibration at your location. Some calibrations need a certain amount of space and the right conditions, so the team confirms the setting first.',
      },
      {
        question: 'Which vehicles do you calibrate?',
        answer:
          'We calibrate domestic, European, and Asian makes. Share your year, make, and model so the team can confirm the procedure for your vehicle.',
      },
      {
        question: 'Will my vehicle need ADAS calibration after windshield replacement?',
        answer:
          'Some newer vehicles need camera or radar calibration after windshield work. Share your vehicle details, and the team will check what yours needs.',
      },
      {
        question: 'Do you perform static and dynamic ADAS calibration?',
        answer:
          'Yes. We offer both static and dynamic calibration. The right one depends on your vehicle, and the team will confirm it.',
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
    linkLabel: 'Explore mobile detailing',
    specialtyId: 'mobile-detailing',
    name: 'Mobile Detailing',
    short: 'Thoughtful interior care and a polished finish.',
    detailHeading: 'Mobile Detailing at Your Location',
    description:
      'We bring interior deep cleans, hand washes, paint correction, polishing, and ceramic coating to your home or office.',
    detail:
      'Choose the detailing service that fits your car. Visits can cover interior steam and shampoo, a hand wash and decontamination, paint correction, polishing, or a ceramic coating package.',
    imageKey: 'detailing',
    points: [
      'Interior steam and shampoo',
      'Hand wash and decontamination',
      'Paint correction and polishing',
      'Ceramic coating packages',
    ],
    modeNote:
      'Every detailing service is mobile. The team confirms the time for your address and vehicle.',
    guide: {
      heading: 'Which detailing service fits your vehicle?',
      paragraphs: [
        'Choose a deep interior clean or a careful hand wash when daily use has caught up with your car. Steam and shampoo clean the seats and carpets. A hand wash and decontamination clean the outside.',
        'Choose paint correction or polishing when the paint needs work. Add a ceramic coating when you want a layer of protection after. Tell us what you want improved, and the team will suggest where to start.',
      ],
    },
    sections: [
      {
        heading: 'Interior detailing',
        paragraphs: [
          'Interior steam and shampoo clean seats, carpets, and everyday buildup. It is a good fit when the inside of the car needs a reset after months of daily driving. Tell us about stains, pet hair, or odors when you book, so the team can plan the visit.',
        ],
      },
      {
        heading: 'Hand wash and paint care',
        paragraphs: [
          'A hand wash and decontamination clean the paint surface. Paint correction and polishing are for paint that has lost its shine. Tell us what bothers you about the finish, and the team will suggest where to start.',
        ],
      },
      {
        heading: 'Ceramic coating',
        paragraphs: [
          'A ceramic coating adds a protective layer once the paint is clean. Ask the team which coating package fits your vehicle and how you use it. Coating usually comes after a wash, and often after paint correction, so the layer goes on a clean surface.',
        ],
      },
      {
        heading: 'Getting ready for the visit',
        paragraphs: [
          'Take personal items out of the seats, floor, and trunk before we arrive. Tell us where the vehicle will be parked, and the team confirms availability for your address. If the car is parked on the street, say so, and the team will plan around it.',
        ],
      },
    ],
    questions: [
      {
        question: 'How should I get my car ready for mobile detailing?',
        answer:
          'Remove personal items from the seats, floor, and trunk, and tell us where the car will be parked. The team confirms the details before the visit.',
      },
      {
        question: 'Which detailing service should I choose?',
        answer:
          'Choose interior steam and shampoo for seats and carpets, a hand wash for the outside, and paint correction or ceramic coating when the paint needs more. Tell us what you want improved, and the team will help.',
      },
      {
        question: 'Which detailing services are available at my home or office?',
        answer:
          'All of them. Interior detailing, hand washing, paint correction, polishing, and ceramic coating are all mobile. The team confirms the time for your address.',
      },
      {
        question: 'What should I share when I request detailing?',
        answer:
          'Share your vehicle and the work you would like done. The team will help you pick the right service.',
      },
    ],
  },
  {
    id: 'car-window-replacement',
    linkLabel: 'Explore car window replacement',
    specialtyId: 'auto-glass',
    name: 'Car Window Replacement',
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
    sections: [
      {
        heading: 'Door, quarter, and rear glass',
        paragraphs: [
          'Door windows roll up and down inside the door. Quarter glass is the small window near the back of many cars. The rear window often has defroster lines, and some carry the radio antenna. Tell us which window broke so we bring the right part.',
        ],
      },
      {
        heading: 'Staying safe around broken glass',
        paragraphs: [
          'Side and rear windows are usually tempered glass, which breaks into many small pieces. Wear gloves if you handle them, and keep children and pets away from the car. Do not run a broken power window, because loose pieces inside the door can jam it.',
        ],
      },
      {
        heading: 'Defroster and antenna lines',
        paragraphs: [
          'Many rear windows have thin heating lines for the defroster, and some carry the radio antenna. Mention these when you request service, along with any tint on the old glass. That helps the team match the new glass to your vehicle.',
        ],
      },
      {
        heading: 'Keeping the car secure until we arrive',
        paragraphs: [
          'Cover the opening with plastic and tape to keep rain out. Park in a garage or a well-lit spot if you can, and take valuables out of the car. If the car cannot wait, choose Urgent / Rush when you send your request.',
        ],
      },
      {
        heading: 'Fleet trucks and RVs',
        paragraphs: [
          'We replace side and rear glass on fleet and commercial trucks, and on RVs and motorhomes. Share the year, make, and model, and tell us which window is damaged.',
        ],
      },
    ],
    questions: [
      {
        question: 'How much does car window replacement cost?',
        answer:
          'The price depends on your vehicle and the window. The team gives you a quote after confirming your vehicle details and the glass. Choose Quotation on the request form if you want pricing first.',
      },
      {
        question: 'Do you replace windows on fleet trucks and RVs?',
        answer:
          'Yes. We work on fleet and commercial trucks and on RV and motorhome glass. Tell us the vehicle and which window broke.',
      },
      {
        question: 'Do you replace door and rear window glass?',
        answer:
          'Yes. The service covers door, quarter, and rear window glass. Share your vehicle details and which window is damaged so the team can confirm the correct glass.',
      },
      {
        question: 'Can I request mobile car window replacement?',
        answer:
          'You can request mobile service. The team confirms availability for your vehicle, glass type, and location.',
      },
    ],
  },
];

// IDs used before the November 2026 rename. Old /book-service?service= links
// and emailed request buttons (valid for 7 days) can still carry them.
export const legacyServiceIds = {
  'auto-glass-repair': 'windshield-repair',
  'side-rear-glass': 'car-window-replacement',
};

/** Returns the current ID for a current or pre-rename service ID. */
export function currentServiceId(id) {
  return Object.hasOwn(legacyServiceIds, id) ? legacyServiceIds[id] : id;
}

/** Finds a service by its current or pre-rename ID. */
export function findService(id) {
  const current = currentServiceId(id);
  return services.find((service) => service.id === current);
}


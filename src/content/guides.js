import { photos } from './assets.js';

// The date the guides first go live. Update it to the real deploy date if they
// are published later; it feeds the Article structured data.
export const guidesPublished = '2026-11-05';

// Plain-English guides. Rules: answer the question in the first two sentences,
// no invented statistics, prices, chip or crack size limits, or author bios.
export const guides = [
  {
    slug: 'windshield-chip-repair-or-replacement',
    service: 'windshield-repair',
    title: 'Windshield Chip: Repair or Replace?',
    seo: {
      title: 'Windshield Chip: Repair or Replace? | Total Mobile Install',
      description:
        'Can a windshield chip be repaired, or does it need a new windshield? How to tell, why acting fast matters, and what to do next in New Orleans.',
    },
    summary:
      'How to tell whether a chip can be repaired, why it should not wait, and what to do until it is checked.',
    lead: 'Many windshield chips can be repaired, especially when they are small and checked soon after they happen. A chip usually calls for a new windshield instead when it has spread into a crack, sits in the driver’s view, or is close to the edge of the glass or a windshield camera.',
    photo: photos.redCorvette,
    sections: [
      {
        heading: 'What a windshield chip is',
        paragraphs: [
          'A windshield is laminated safety glass. It is made of two layers of glass with a thin plastic layer between them. That plastic layer holds the glass together when something hits it.',
          'A chip is a small break in the outer layer. It often starts when a stone or a piece of debris strikes the glass at highway speed. You may see a small pit, a star shape, or a tiny circle with lines around it. Chips are common on busy highways, where trucks and other vehicles throw up small stones.',
        ],
      },
      {
        heading: 'When repair is usually an option',
        paragraphs: [
          'Repair works best when the damage is fresh and stays in the outer layer of glass. It also helps when the chip is away from the edges and out of the driver’s direct line of sight.',
          'A repair fills the damage so it is less likely to spread. It also saves the original factory seal around your windshield. Our team decides whether repair fits after seeing the chip, because size, depth, and position all matter.',
        ],
      },
      {
        heading: 'When a new windshield is the safer choice',
        paragraphs: [
          'Some damage is better handled with a replacement. These signs usually point that way:',
        ],
        list: [
          'The chip has already spread into a crack.',
          'The damage sits right where the driver looks at the road.',
          'The chip is near the edge of the windshield.',
          'The damage is close to a camera or sensor mounted on the glass.',
          'There are several chips, or the damage goes deeper than the outer layer.',
        ],
        after: [
          'If your vehicle has a camera at the windshield, ask whether it needs ADAS calibration after a replacement.',
        ],
      },
      {
        heading: 'Why acting fast matters',
        paragraphs: [
          'A chip puts stress on the glass around it. Heat, sudden temperature changes, and rough roads all add to that stress. In New Orleans, a hot afternoon in the sun followed by a cool evening can be enough to turn a chip into a crack.',
          'Dirt and moisture also settle into a chip over time. That can make a repair less clean. The sooner the chip is looked at, the better the chance that repair is still an option.',
        ],
      },
      {
        heading: 'What to do until the chip is checked',
        steps: [
          'Do not press on the chip or pick at it.',
          'Cover it with a small piece of clear tape to keep dirt and water out.',
          'Avoid blasting the defroster or the air conditioning straight at the glass.',
          'Park in the shade or a garage when you can.',
          'Skip the car wash until the damage has been looked at.',
          'Request an assessment and tell us where the chip is on the glass.',
        ],
      },
      {
        heading: 'How our team decides',
        paragraphs: [
          'We do not set a size limit over the phone. Our technician looks at the chip in person and checks its size, depth, and position. Then we tell you plainly whether repair or replacement is the right call, and why.',
          'If repair fits, the work is done at your home or workplace. If replacement is the better choice, we explain the next step and help you plan that visit.',
        ],
      },
      {
        heading: 'Repair and replacement side by side',
        list: [
          'A repair keeps your original windshield and its factory seal.',
          'A repair is usually the quicker visit of the two.',
          'A replacement is the right fix when damage has spread, blocks your view, or sits near the edge or a camera.',
          'A replacement can mean the windshield camera needs ADAS calibration afterward.',
          'Both can be done at your home or workplace.',
        ],
      },
      {
        heading: 'What to tell us when you book',
        paragraphs: [
          'Share your vehicle year, make, and model, where the chip is on the glass, and whether you see any lines running from it. Tell us the address where the car will be parked. Choose Urgent / Rush if the chip is spreading, or Appointment if you want to pick a date.',
        ],
      },
      {
        heading: 'Will insurance cover it?',
        paragraphs: [
          'Many drivers have glass coverage, and our team can help with your claim. Your insurer and your policy decide what is covered and what you pay, so check your policy details first.',
        ],
      },
    ],
  },
  {
    slug: 'cracked-windshield-what-to-do',
    service: 'windshield-repair',
    title: 'Cracked Windshield? Next Steps for Repair or Windshield Replacement',
    seo: {
      title: 'Cracked Windshield? What to Do Next | Total Mobile Install',
      description:
        'Just found a crack in your windshield? What to do first, how to keep it from spreading, and when to book windshield repair in New Orleans.',
    },
    summary:
      'What to check first, how to keep a crack from spreading, and when to call for repair or replacement.',
    lead: 'If you find a crack in your windshield, first check whether it blocks your view of the road, and drive as little as possible until it is looked at. Then keep it from spreading by avoiding big temperature swings and rough roads, and book a windshield repair or replacement visit soon.',
    photo: photos.blueCorvette,
    sections: [
      {
        heading: 'Take a first look',
        paragraphs: [
          'Find where the crack starts and where it ends. Many cracks begin at a chip, so look for a small pit at one end. Note whether the crack runs into the edge of the glass or crosses the area in front of the driver.',
          'You do not need to measure anything. A quick description is enough for the team to advise you: where the crack is, about how long it looks, and whether it is growing.',
          'If you notice the crack while driving, there is no need to pull over unless it blocks your view. Finish the trip carefully, then park somewhere shaded and take a closer look once the car has stopped.',
        ],
      },
      {
        heading: 'Why the windshield matters',
        paragraphs: [
          'The windshield is part of your car’s safety system, not only a window. It helps support the roof, and it works with the airbags in a crash. A crack can weaken the glass, so it is worth having it checked rather than waiting.',
        ],
      },
      {
        heading: 'How to keep a crack from spreading',
        steps: [
          'Keep the car out of direct sun when you can.',
          'Do not aim the defroster or the air conditioning straight at the glass.',
          'Avoid potholes and rough roads where possible.',
          'Close the doors gently, since a hard slam can flex the glass.',
          'Skip the car wash until the crack has been looked at.',
          'Cover any chip at the start of the crack with clear tape to keep dirt out.',
        ],
      },
      {
        heading: 'Can a cracked windshield be repaired?',
        paragraphs: [
          'Sometimes. A short crack that is checked early may be repairable. A crack that has spread, reaches the edge of the glass, or sits in the driver’s view usually means the windshield should be replaced.',
          'We do not give size limits over the phone. Our team looks at the crack in person and tells you which option fits. If it is replacement, we confirm the correct glass for your vehicle before the visit.',
        ],
      },
      {
        heading: 'Is it safe to keep driving?',
        paragraphs: [
          'That depends on where the crack is and how much it has spread. If it blocks your view or keeps growing, drive as little as possible until it is fixed. If you are not sure, call the team and describe the damage.',
        ],
      },
      {
        heading: 'What to tell us when you book',
        list: [
          'Your vehicle year, make, and model.',
          'Where the crack starts and about how long it looks.',
          'Whether the windshield has a camera, rain sensor, or heating.',
          'The address where the car will be parked.',
        ],
        after: [
          'Choose Urgent / Rush if the car cannot wait, Appointment if you want to pick a date, or Quotation if you want pricing first.',
        ],
      },
      {
        heading: 'Common causes of windshield cracks',
        list: [
          'A stone chip from highway traffic that was left to spread.',
          'Sudden temperature changes, such as cold air on hot glass.',
          'Stress from potholes and rough roads.',
          'A hard door slam on a windshield that already has a chip.',
        ],
      },
      {
        heading: 'What a replacement visit involves',
        paragraphs: [
          'If the crack calls for a new windshield, the team first confirms the correct glass for your vehicle, including any camera, rain sensor, or heating. On the day, the technician removes the old windshield and sets the new one in fresh adhesive.',
          'After that, the car needs its safe drive-away time before you take it out. If your vehicle has a camera at the windshield, ask whether it needs ADAS calibration too.',
        ],
      },
      {
        heading: 'Mobile service across Greater New Orleans',
        paragraphs: [
          'You do not have to drive a cracked windshield across town. Our mobile team comes to your home or workplace anywhere within 40 miles of New Orleans, from Metairie and Kenner to the West Bank and the North Shore.',
        ],
      },
      {
        heading: 'Insurance and timing',
        paragraphs: [
          'Our team can help with your windshield claim. Your insurer and your policy decide what is covered and what you pay.',
          'If the windshield needs replacing, a standard replacement takes 45 to 90 minutes on site. Then plan on a 30 to 60 minute safe drive-away window while the adhesive sets.',
        ],
      },
    ],
  },
  {
    slug: 'adas-calibration-after-windshield-replacement',
    service: 'windshield-replacement',
    alsoFor: ['adas-calibration'],
    title: 'ADAS Calibration After Windshield Replacement',
    seo: {
      title: 'ADAS After Windshield Replacement | Total Mobile Install',
      description:
        'Does your car need ADAS calibration after a new windshield? What the cameras do, when calibration applies, and what to ask before booking.',
    },
    summary:
      'What driver-assistance cameras do, when calibration applies after new glass, and what to ask before you book.',
    lead: 'Many newer vehicles need ADAS calibration after a windshield replacement, because the camera behind lane keeping and collision warning is mounted on the windshield. Whether yours does depends on the vehicle and its equipment, so check before you book the replacement.',
    photo: photos.bmw,
    sections: [
      {
        heading: 'What ADAS means',
        paragraphs: [
          'ADAS stands for advanced driver-assistance systems. These are the features that help you stay in your lane, warn you about a possible collision, or keep a set distance with adaptive cruise control.',
          'They rely on cameras and sensors that read the road. If a camera is aimed even slightly off, the system can read the lane or the car ahead in the wrong place.',
        ],
      },
      {
        heading: 'Why the windshield matters',
        paragraphs: [
          'On many vehicles, a forward-facing camera sits near the rearview mirror and looks through the windshield. When the windshield is replaced, the camera is moved to the new glass. Calibration makes sure it is aimed the way the automaker intended.',
          'Even a new windshield of the right type can sit very slightly differently from the old one. A small change in angle at the camera becomes a bigger error far down the road, which is why the aim is checked against the automaker specification.',
        ],
      },
      {
        heading: 'Does my vehicle need calibration?',
        paragraphs: ['A few quick checks help:'],
        list: [
          'Look for a camera housing behind the rearview mirror.',
          'Check your owner’s manual for lane keeping, collision warning, or automatic braking.',
          'Note any driver-assistance warning lights on the dashboard.',
        ],
        after: [
          'Then share your year, make, and model when you request service. Each automaker sets its own requirements, and the team will check what applies to your vehicle.',
        ],
      },
      {
        heading: 'Common features and the sensors behind them',
        paragraphs: [
          'Every vehicle is set up a little differently. That is why the year, make, and model matter so much when you book.',
        ],
        list: [
          'Lane departure warning and lane keeping usually rely on the windshield camera.',
          'Collision warning and automatic emergency braking may use the camera, a front radar, or both.',
          'Adaptive cruise control often uses a front radar, and on some vehicles the camera as well.',
        ],
      },
      {
        heading: 'Other work that can affect calibration',
        paragraphs: [
          'A windshield replacement is the most common reason for calibration, but it is not the only one. Front-end repairs, a camera bracket that was removed, or changes to the way the vehicle sits on the road can also call for a check. Tell the team about any recent work when you request service.',
        ],
      },
      {
        heading: 'Static and dynamic calibration',
        paragraphs: [
          'Static calibration uses targets placed in front of the vehicle in a controlled setup. Dynamic calibration is completed on the road under the right driving conditions.',
          'Some vehicles need one, some need the other, and some need both. Some calibrations need specific space and conditions, so the team confirms the right procedure and setting for your vehicle.',
        ],
      },
      {
        heading: 'What the scan reports show',
        paragraphs: [
          'A pre-scan checks the vehicle systems before the work begins. A post-scan checks them again afterward. With our calibration service, both reports are included, so you have a record of the work.',
        ],
      },
      {
        heading: 'What to ask before booking',
        steps: [
          'Does my vehicle need calibration after a new windshield?',
          'Is it static, dynamic, or both for my vehicle?',
          'Where will the calibration take place?',
          'Will I get pre- and post-scan reports?',
          'How long is the safe drive-away time after the new glass?',
          'Can the calibration happen at the same visit as the new windshield?',
          'What should I watch for on the road afterward?',
        ],
      },
      {
        heading: 'Signs a camera may need attention',
        paragraphs: [
          'If you notice any of these after glass work, stop relying on the feature and contact the team.',
        ],
        list: [
          'A driver-assistance warning light stays on.',
          'Lane keeping pulls toward one side or alerts at the wrong times.',
          'Collision warnings appear when nothing is ahead.',
        ],
      },
      {
        heading: 'Calibration with mobile service',
        paragraphs: [
          'You can request calibration together with your windshield replacement. Tell us the address and your vehicle details. Because some calibrations need specific space and conditions, the team confirms the right setting before the visit.',
        ],
      },
      {
        heading: 'After the work',
        paragraphs: [
          'Pay attention to dashboard warning lights and to how lane keeping feels on the road. If something seems off after a windshield replacement, contact the team so they can check it.',
          'A standard replacement takes 45 to 90 minutes on site, followed by a 30 to 60 minute safe drive-away window. The team will tell you when the vehicle is ready to drive.',
        ],
      },
    ],
  },
  {
    slug: 'broken-car-window-what-to-do',
    service: 'car-window-replacement',
    title: 'Broken Car Window? What to Do Before Car Window Replacement',
    seo: {
      title: 'Broken Car Window? What to Do Next | Total Mobile Install',
      description:
        'Broken car window? How to stay safe, clean up the glass, keep rain out, and book a mobile car window replacement in New Orleans.',
    },
    summary:
      'How to stay safe, clean up the glass, keep rain out, and get the window replaced.',
    lead: 'If a car window breaks, first make sure everyone is away from the glass, then take photos and remove your valuables. Next, clean up the loose glass carefully, cover the opening to keep rain out, and book a mobile car window replacement.',
    photo: photos.tesla,
    sections: [
      {
        heading: 'Stay safe first',
        paragraphs: [
          'Side and rear windows are usually tempered glass. Tempered glass breaks into many small pieces instead of large shards, but the pieces can still cut. Keep children and pets away from the car, and wear gloves before you touch anything.',
          'If the window broke while you were driving, pull over somewhere safe before you check the damage. Turn on your hazard lights, and do not try to clear glass from the seat while the car is moving.',
        ],
      },
      {
        heading: 'Why the glass breaks into small pieces',
        paragraphs: [
          'Tempered glass is heat-treated so that it crumbles into small, blunt pieces when it breaks. That makes it safer than large shards, but it also means the whole window usually breaks at once. Unlike a windshield, a broken side or rear window cannot be repaired, so it needs new glass.',
        ],
      },
      {
        heading: 'If it was a break-in',
        steps: [
          'Do not touch more than you need to.',
          'Report the break-in to the police and keep the report number.',
          'Take photos of the window, the inside of the car, and the area around it.',
          'Make a list of anything missing.',
          'Call your insurer to ask how your policy handles glass and theft.',
        ],
      },
      {
        heading: 'Clean up the loose glass',
        paragraphs: [
          'Wear gloves and pick up the larger pieces by hand. Then use a vacuum on the seats, the floor, and the seat tracks. Check the door pockets and the cargo area too, because pieces travel farther than you expect.',
          'Glass often falls inside the door panel. Do not run a broken power window, because loose pieces inside the door can jam it. Let the technician check it when the new glass goes in.',
        ],
      },
      {
        heading: 'Keep the rain out',
        paragraphs: [
          'Cover the opening with a sheet of heavy plastic and tape it to the frame. Painter’s tape is gentler on paint than packing tape. In New Orleans, a sudden afternoon shower can soak the seats quickly, so cover the opening even if the sky looks clear.',
        ],
      },
      {
        heading: 'Secure the car until the appointment',
        list: [
          'Park in a garage or a well-lit spot if you can.',
          'Take valuables, papers, and chargers out of the car.',
          'Keep the car locked, even with the window open.',
        ],
      },
      {
        heading: 'If you have to drive before the appointment',
        paragraphs: [
          'Keep the trip short and drive at a gentle speed. Make sure the plastic cover is taped down well so it does not flap loose. Check the seat for loose glass before you sit down, and keep the other windows closed to cut down on wind and noise.',
        ],
      },
      {
        heading: 'Know which window broke',
        paragraphs: [
          'Door windows roll up and down inside the door. Quarter glass is the small window near the back of many cars. The rear window often has defroster lines, and some carry the radio antenna.',
          'Tell us which window broke and mention any defroster lines, antenna, or tint on the old glass. Those details help the team bring the right part.',
        ],
      },
      {
        heading: 'What the replacement visit looks like',
        paragraphs: [
          'For a door window, the technician usually removes the inner door panel, clears out the loose glass, fits the new glass, and tests the power window. Quarter and rear glass are set into the body of the car. On a rear window, the defroster is connected again when the new glass goes in.',
        ],
      },
      {
        heading: 'Insurance for a broken window',
        paragraphs: [
          'Some policies cover broken car windows, often under comprehensive coverage. Check your deductible, since it can be close to the cost of the glass. The team gives you a quote first, so you can decide whether to file a claim.',
        ],
      },
      {
        heading: 'Getting the window replaced',
        paragraphs: [
          'Request service online or call us. Share your vehicle year, make, and model, which window broke, and where the car is parked. Choose Urgent / Rush if the car cannot wait.',
          'Our mobile team replaces door, quarter, and rear glass at your home or workplace. We also work on fleet trucks and on RV and motorhome glass. The team gives you a quote after confirming your vehicle and the glass.',
        ],
      },
    ],
  },
];

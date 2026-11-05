import { slides, photos } from '../../content/assets';
export const data = {
  seo: {
    title: 'Mobile Auto Glass Repair New Orleans | Total Mobile Install',
    description:
      'Mobile auto glass repair in New Orleans, LA. Windshield chip repair, windshield replacement, and car window replacement at your home or work.',
    image: '/images/services/corvette-red-windshield.webp',
  },
  hero: {
    title: ['New Orleans Auto Glass Repair,', 'At Your Door.'],
    label: 'New Orleans, LA · Mobile services',
    description:
      'Automobile glass repair, calibration, and detailing from a local, family-owned team. We come to your home or workplace.',
    primary: 'Book Mobile Service',
    secondary: 'Call 1-504-207-7742',
    note: 'Your vehicle. Your place. Our precision.',
    explore: 'Explore our work',
  },
  slideshow: {
    slides,
    settings: {
      autoplay: true,
      interval: 4500,
      label: 'Total Mobile Install featured work',
      previous: 'Previous photograph',
      next: 'Next photograph',
      pause: 'Pause slideshow',
      play: 'Play slideshow',
      goTo: 'Show photograph:',
    },
  },
  metrics: {
    label: 'Total Mobile Install at a glance',
    hint: 'Scroll to see the numbers come to life.',
    items: [
      {
        id: 'experience',
        value: 9,
        suffix: '+',
        label: 'Years serving New Orleans',
        detail: 'Local roots. Lasting care.',
      },
      {
        id: 'vehicles',
        value: 10000,
        suffix: '+',
        compact: true,
        label: 'Vehicles serviced',
        detail: 'Across our auto services.',
        requiresConfirmation: true,
        sourceStatus:
          'Client-supplied 10K+ figure. Confirm before public launch.',
      },
      {
        id: 'services',
        value: 6,
        label: 'Services',
        detail: 'Delivered across four specialties.',
        to: '/services',
      },
      {
        id: 'results',
        value: 9,
        label: 'Real transformations',
        detail: 'See the before and after.',
        to: '/gallery',
      },
      {
        id: 'stories',
        value: 6,
        label: 'Customer stories',
        detail: 'Read their experiences.',
        href: '#reviews',
      },
    ],
  },
  about: {
    title: 'Family-owned care. A higher standard.',
    description:
      'Total Mobile Install has served New Orleans and nearby towns for more than nine years. We are a family business that cares about careful work, safety, and clear choices for your car.',
    secondary:
      'From windshields and car windows to calibration and detailing, we put care into every step.',
    image: photos.redCorvette,
    caption: 'A little extra care. A lot of pride in the finish.',
    action: 'Get to know our team',
    stats: [
      { value: '9+', label: 'Years serving New Orleans' },
      { value: 'Family-owned', label: 'Locally operated' },
      { value: 'Mobile service', label: 'Service to fit the work' },
    ],
  },
  services: {
    title: 'Automobile glass repair, brought to you.',
    description:
      'Windshield repair and replacement, car window replacement, ADAS calibration, and mobile detailing from a local, family-owned team in New Orleans.',
    action: 'Explore all services',
    areasLead: 'We come to you across Greater New Orleans, including',
  },
  why: {
    title: 'Good work starts with people who care.',
    description:
      'Local roots. Careful work. A straightforward conversation about what your vehicle needs.',
    items: [
      {
        title: 'Locally owned. Personally invested.',
        description:
          'A family business serving New Orleans, with care that feels personal.',
      },
      {
        title: 'The right service for your vehicle.',
        description:
          'Glass, calibration, tint, and detailing brought together by one team.',
      },
      {
        title: 'We work around your day.',
        description:
          'Request mobile service at your home or workplace.',
      },
    ],
    image: photos.glassWork,
  },
  transformation: {
    title: 'See the transformation.',
    description:
      'From damaged glass to a clear view ahead. A closer look at real vehicles and the work behind the result.',
    action: 'See more transformations',
  },
  reviews: {
    title: 'Local drivers. In their own words.',
    description: 'Stories shared by customers across Greater New Orleans.',
    previous: 'Previous customer story',
    next: 'Next customer story',
    previousLabel: 'Previous story',
    nextLabel: 'Next story',
    navigationHint: 'Use the buttons to read more customer stories.',
    label: 'Customer stories',
    badgesLabel: 'Business badges',
    badges: [
      {
        id: 'best-service',
        src: '/images/badges/badge-best-service.webp',
        alt: 'Awarded Best Service Provider',
        requiresConfirmation: true,
      },
      {
        id: 'locally-owned',
        src: '/images/badges/badge-locally-owned.webp',
        alt: 'Locally Owned',
      },
      {
        id: 'satisfaction',
        src: '/images/badges/badge-satisfaction.webp',
        alt: '100% Customer Satisfaction Guaranteed',
        requiresConfirmation: true,
      },
    ],
    items: [
      {
        id: 'deborah',
        name: 'Deborah Ivy',
        location: 'New Orleans, LA',
        quote:
          "I can recommend Calvin with absolutely no hesitation! He is very professional, friendly, and provides unmatched service. I truly appreciated his bright personality! His company will definitely be my go-to and I'll make sure all my friends and coworkers have his name. His price was also better than his competitors.",
      },
      {
        id: 'boulonguise',
        name: 'Boulonguise Beaute',
        location: 'New Orleans, LA',
        quote:
          'They repaired my window before 8:30am and even worked around my car door locking. Seamless and stress-free. Definitely recommend!',
      },
      {
        id: 'ellen',
        name: 'Ellen Brandao',
        location: 'New Orleans, LA',
        quote:
          'Cannot recommend this small business highly enough. Calvin is so professional, knowledgeable, and great at staying in touch. My rear minivan glass broke and pieces fell in the locking mechanism. He even knew how to fix that!',
      },
      {
        id: 'madison',
        name: 'Madison Uli',
        location: 'New Orleans, LA',
        quote:
          'My back cargo window was shattered and I was so stressed. The next morning I called Calvin and he gave me a fabulous price and put me completely at ease. Made a bad situation so much better.',
      },
      {
        id: 'arleena',
        name: 'Arleena Richmond',
        location: 'New Orleans, LA',
        quote:
          'Great customer service! Calvin was very professional and provided me with same-day service. Happy customer!',
      },
      {
        id: 'david',
        name: 'David Holtman',
        location: 'New Orleans, LA',
        quote:
          'Great experience with Total Mobile Install. If you need mobile auto glass repair, windshield replacement, or window tint in New Orleans, this is the guy to call.',
      },
    ],
  },
  contact: {
    title: 'Let’s get you a clearer view.',
    description:
      'Tell us what your vehicle needs. Our team can help you choose a service and confirm the next steps.',
    phoneLabel: 'Give us a call',
    emailLabel: 'Send us a note',
    hoursLabel: 'Business hours',
    hoursNote: 'All hours are Central Time. Please call to confirm your appointment.',
  },
  sourceStatus: {
    editorial: 'Draft adaptations of supplied homepage content.',
    claimsAwaitingConfirmation: [
      'Certified technician claims',
      '10K+ vehicles',
      '100% satisfaction',
      'Awards and badges',
      'Warranty terms',
    ],
    suppliedStatistics: [
      { value: '9+', label: 'Years' },
      { value: '10K+', label: 'Vehicles' },
      { value: '100%', label: 'Satisfaction' },
    ],
  },
};

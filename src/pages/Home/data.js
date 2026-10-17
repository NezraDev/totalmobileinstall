import { slides, photos } from '../../content/assets';
export const data = {
  seo: {
    title: 'Total Mobile Install | Auto Glass in New Orleans',
    description:
      'Family-owned mobile auto glass, windshield replacement, ADAS calibration, tint and detailing in New Orleans. Book a service request or call 1-504-207-7742.',
  },
  hero: {
    title: ['Windshield Repair,', 'At Your Door.'],
    label: 'New Orleans · Mobile & in-shop services',
    description:
      'Expert auto glass care, wherever your vehicle lives. A local, family-owned team with precision in every detail.',
    primary: 'Book Mobile Service',
    secondary: 'Call 1-504-207-7742',
    note: 'Your vehicle. Your place. Our precision.',
    explore: 'Explore our work',
  },
  slideshow: {
    slides,
    settings: {
      autoplay: true,
      interval: 6000,
      label: 'Total Mobile Install featured work',
      previous: 'Previous photograph',
      next: 'Next photograph',
      pause: 'Pause slideshow',
      play: 'Play slideshow',
      goTo: 'Show photograph:',
    },
  },
  about: {
    title: 'Family-owned care. A higher standard.',
    description:
      'Total Mobile Install Auto Glass & Tint has proudly served New Orleans and surrounding communities for more than nine years. We’re a family-operated business focused on precision, safety, and showroom-quality results, delivered to wherever your vehicle lives.',
    secondary:
      'From windshield replacements and ADAS calibration to window tinting and detailing, we put care into every step.',
    image: photos.redCorvette,
    caption: 'A little extra care. A lot of pride in the finish.',
    action: 'Get to know our team',
    stats: [
      { value: '9+', label: 'Years serving NOLA' },
      { value: 'Family', label: 'Owned & operated' },
      { value: 'Your place', label: 'Or our New Orleans shop' },
    ],
  },
  services: {
    title: 'One team. Every detail covered.',
    description:
      'Six ways to care for your vehicle, from the glass in front of you to the finish around you.',
    action: 'Explore all services',
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
          'Request mobile service at home or work, or arrange a visit to our shop.',
      },
    ],
    image: photos.mobileService,
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
    label: 'Customer stories',
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
          'I scheduled last-minute on a Friday for Saturday morning. They repaired my window before 8:30am and even worked around my car door locking. Seamless and stress-free. Definitely recommend!',
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
      'Tell us about your vehicle. Our team will help you find the right service and confirm the next steps.',
    phoneLabel: 'Give us a call',
    emailLabel: 'Send us a note',
    addressLabel: 'Find our shop',
    hoursLabel: 'Shop hours',
    hoursNote: 'All hours are Central Time. Please call to confirm your visit.',
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

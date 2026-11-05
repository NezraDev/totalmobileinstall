import { site } from '../../config/site.js';
export const data = {
  sourceStatus:
    'FAQ answers based on supplied service details and current Louisiana window-tint requirements.',
  seo: {
    title: 'Auto Glass Repair FAQs in New Orleans | Total Mobile Install',
    description:
      'Answers about auto glass repair in New Orleans: insurance, windshield chip repair, replacement timing, ADAS calibration, and mobile service.',
    image: '/images/services/mobile-glass-work.webp',
  },
  eyebrow: 'Common questions',
  title: 'Auto Glass & ADAS Questions',
  description:
    'Clear answers about insurance, timing, glass, calibration, tint, and warranties.',
  items: [
    {
      id: 'chip-repair',
      question: 'Do you do mobile windshield chip repair in New Orleans?',
      answer:
        'Yes. We repair windshield chips at your home or workplace anywhere in our 40-mile service area. The team decides between repair and replacement after seeing the damage.',
    },
    {
      id: 'car-window-cost',
      question: 'How much does car window replacement cost?',
      answer:
        'It depends on your vehicle and the window. The team gives you a quote after confirming your vehicle details and the glass. Choose Quotation on the request form if you want pricing first.',
    },
    {
      id: 'fleet-rv',
      question: 'Do you work on fleet trucks and RVs?',
      answer:
        'Yes. We handle fleet and commercial trucks, and RV and motorhome glass. Share the year, make, and model so the team can confirm the glass.',
    },
    {
      id: 'areas',
      question: 'Do you come to Metairie, Kenner, and the West Bank?',
      answer:
        'Yes. We serve 57 communities within 40 miles of New Orleans. They include Metairie, Kenner, the West Bank, St. Bernard, St. Charles, LaPlace, and the North Shore.',
    },
    {
      id: 'insurance',
      question: 'Will my insurance cover windshield replacement?',
      answer:
        'Coverage depends on your policy. Many comprehensive plans cover windshield repair. Your deductible may apply to a replacement. We can handle the claim with your insurer, with no additional charge for that help.',
    },
    {
      id: 'arrival',
      question: 'How fast can a mobile technician arrive?',
      answer:
        'It depends on your location, your vehicle, the service, and the schedule that day. Call with your ZIP code, and the team will confirm the next available time.',
    },
    {
      id: 'replacement-time',
      question: 'How long does a windshield replacement take?',
      answer:
        'A standard replacement takes 45 to 90 minutes on site, followed by a 30 to 60 minute safe drive-away window. The exact time depends on the adhesive and the weather.',
    },
    {
      id: 'adas',
      question: 'Do you perform ADAS calibration after replacement?',
      answer:
        'Yes. Many newer vehicles need ADAS calibration after a new windshield. When yours does, we do OEM-spec static or dynamic calibration and give you pre- and post-scan reports.',
    },
    {
      id: 'tint-law',
      question: 'What window tint percentages are legal in Louisiana?',
      answer:
        'For most vehicles, Louisiana requires at least 25% visible-light transmission on the front and rear side windows, and at least 12% on the rearmost window. Trucks, buses, trailers, motor homes, and multipurpose passenger vehicles are exempt for the windows behind the driver. Film reflectance is limited to 20%. Window tinting is not available from us as of now.',
    },
    {
      id: 'warranty',
      question: 'Do you offer a warranty?',
      answer:
        'Warranty terms depend on the service and the product. Ask our team for the written terms that apply to your vehicle and the option you choose.',
    },
    {
      id: 'mobile',
      question: 'Can you service vehicles at my office?',
      answer:
        'Absolutely. We serve homes, offices, fleet yards, and dealerships within 40 miles of New Orleans. We bring power and protective covers, so you do not have to lift a finger. Send your ZIP code, and we will confirm the visit.',
    },
    {
      id: 'vehicles',
      question: 'Do you only work on luxury vehicles?',
      answer:
        'We work on a range of makes and models, from everyday cars to fleet trucks and RVs. Share your vehicle details, and the team will confirm the right glass.',
    },
  ],
  contactTitle: 'Have a question about your vehicle?',
  contactCopy: 'A short conversation can help you choose your next step.',
  contactLabel: 'Get in touch',
  contactHref: '/contact',
};

// The FAQPage structured data lists exactly the questions FAQ.jsx shows.
data.seo.faq = data.items.filter(
  (item) => !item.requiresConfirmation || site.showUnconfirmedClaims,
);

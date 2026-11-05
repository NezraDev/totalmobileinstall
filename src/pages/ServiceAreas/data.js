import { business } from '../../content/business';
import { photos } from '../../content/assets';
const placeCount = business.serviceAreas.reduce(
  (total, area) => total + area.places.length,
  0,
);
export const data = {
  sourceStatus:
    'Client-supplied coverage: a 40-mile radius around New Orleans covering the metro area, West Bank, and North Shore. Confirm exact availability for each request.',
  seo: {
    title: 'Greater New Orleans Mobile Auto Glass | Total Mobile Install',
    description:
      'Mobile auto glass repair within 40 miles of New Orleans, including Metairie, Kenner, the West Bank, St. Bernard, St. Charles, LaPlace, and the North Shore.',
    image: '/images/services/bmw-windshield.webp',
  },
  eyebrow: 'Greater New Orleans mobile service',
  title: 'Mobile Auto Glass Service Across Greater New Orleans',
  description:
    'We come to you within 40 miles of our base in New Orleans. That covers Greater New Orleans, the West Bank, and the North Shore. Request service at home or work, and send your ZIP code so we can confirm.',
  image: photos.bmw,
  heading: 'Four specialties. One family-owned team.',
  paragraphs: [
    'Our team does auto glass, ADAS calibration, and detailing. Window tinting is not available as of now.',
    'Tell us where your vehicle is and what it needs. We will confirm the right service and location for your request.',
  ],
  locationLabel: 'Based in',
  address: business.address,
  modeNote:
    'Every service comes to your home or workplace. The team confirms the time for your address and vehicle.',
  requestLabel: 'Request mobile service',
  requestHref: '/book-service',
  callLabel: `Call ${business.phone}`,
  phoneHref: business.phoneHref,
  mapHeading: 'Our 40-mile mobile service area',
  communitiesHeading: 'Communities in our mobile service area',
  communitiesIntro: `We serve ${placeCount} communities across ${business.serviceAreas.length} parishes, all within 40 miles of New Orleans. Every visit is mobile: tell us your address, and we come to your home or workplace.`,
  neighborhoodsLabel: 'New Orleans neighborhoods',
  localPagesLabel: 'Local pages',
  countLabel: (area) =>
    area.neighborhoods
      ? `New Orleans and ${area.neighborhoods.length} neighborhoods`
      : `${area.places.length} ${area.places.length === 1 ? 'community' : 'communities'}`,
  // Real geography only: the roads and bridges that connect each parish.
  parishNotes: {
    orleans:
      'Orleans Parish and the city of New Orleans share the same borders. Our mobile team covers every neighborhood, from the French Quarter to New Orleans East. Algiers, the part of the city on the West Bank, is just across the Crescent City Connection.',
    jefferson:
      'Jefferson Parish runs along both banks of the Mississippi River. On the east bank, I-10 and Veterans Memorial Boulevard connect Metairie and Kenner. Jefferson Highway runs through Harahan and River Ridge. On the West Bank, the Westbank Expressway links Gretna, Harvey, Marrero, and Westwego. Barataria Boulevard heads south to Lafitte.',
    'st-bernard':
      'St. Bernard Parish begins just downriver from the Lower Ninth Ward. St. Bernard Highway and Judge Perez Drive run through Arabi, Chalmette, Meraux, and Violet. Farther out, our service area reaches Poydras and Delacroix.',
    'st-charles':
      'St. Charles Parish sits upriver, on both banks of the Mississippi. Airline Highway and River Road connect St. Rose, Destrehan, Norco, and Montz on the east bank. On the west bank, I-310 crosses the Hale Boggs Memorial Bridge to Luling. From there, US 90 goes on to Boutte and Des Allemands.',
    'st-john':
      'St. John the Baptist Parish is the farthest upriver parish we serve. LaPlace sits where I-55 meets I-10. Airline Highway goes west toward Reserve and Garyville. Edgard and Wallace are across the river on the west bank, and Pleasure Bend is farther south.',
    'st-tammany':
      'St. Tammany Parish sits on the North Shore of Lake Pontchartrain. The Lake Pontchartrain Causeway links Metairie to Mandeville. The I-10 Twin Span reaches Slidell from New Orleans East. I-12 crosses the parish from Slidell to Covington, and I-59 runs north to Pearl River.',
    plaquemines:
      'In Plaquemines Parish, we serve Belle Chasse, just south of the West Bank. Belle Chasse Highway (LA 23) connects it to Gretna and Terrytown.',
  },
  communitiesNote:
    'Do not see your community? If you are within 40 miles of New Orleans, call with your ZIP code and we will confirm availability.',
  communities: business.serviceAreas,
};

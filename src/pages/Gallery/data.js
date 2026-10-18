import { photos, beforeAfter } from '../../content/assets';
export const data = {
  sourceStatus:
    'Supplied business photography and matched project pairs. Gallery headings and captions are draft editorial copy. Source information is in src/content/assets.js.',
  seo: {
    title: 'Auto Glass Before & After Gallery | Total Mobile Install',
    description:
      'View matched before-and-after auto glass photos and completed vehicles from Total Mobile Install in New Orleans, including windshield and rear glass work.',
    image: '/images/services/gmc-pickup-windshield.webp',
  },
  eyebrow: 'The work speaks for itself',
  title: 'Real vehicles. Careful work.',
  description:
    'See the vehicles and glass work entrusted to Total Mobile Install through matched before-and-after photos and completed projects.',
  transformationHeading: 'See the transformation',
  transformationDescription:
    'Matched photographs show the same vehicle before and after the work. Camera viewpoints may differ.',
  photoHeading: 'More from our project gallery',
  photoDescription:
    'Explore more vehicles and glass work from our project photos.',
  transformations: beforeAfter,
  gallery: [
    {
      id: 'redCorvette',
      photo: photos.redCorvette,
      caption: 'Chevrolet Corvette windshield',
    },
    { id: 'bmw', photo: photos.bmw, caption: 'BMW windshield installation' },
    {
      id: 'bentley',
      photo: photos.bentley,
      caption: 'Bentley windshield installation',
    },
    {
      id: 'isuzu',
      photo: photos.isuzu,
      caption: 'Isuzu commercial windshield',
    },
    { id: 'tesla', photo: photos.tesla, caption: 'Tesla rear glass' },
    {
      id: 'porsche',
      photo: photos.porsche,
      caption: 'Classic Porsche windshield',
    },
    { id: 'gmc', photo: photos.gmc, caption: 'GMC pickup windshield' },
    {
      id: 'peterbilt',
      photo: photos.peterbilt,
      caption: 'Peterbilt truck windshield',
    },
    {
      id: 'glassWork',
      photo: photos.glassWork,
      caption: 'Mobile windshield work in progress',
    },
  ],
};

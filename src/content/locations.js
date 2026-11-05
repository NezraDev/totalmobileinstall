// Location pages at /auto-glass-repair/:slug. Shared by the pages, the footer,
// the Service Areas list, and the structured data. No address or branch: the
// business is mobile-only and based in New Orleans, LA.
export const locations = [
  {
    slug: 'metairie',
    name: 'Metairie',
    linkLabel: 'Auto glass repair in Metairie',
    parishIds: ['jefferson'],
    areaServed: [{ '@type': 'City', name: 'Metairie, LA' }],
  },
  {
    slug: 'kenner',
    name: 'Kenner',
    linkLabel: 'Auto glass repair in Kenner',
    parishIds: ['jefferson'],
    areaServed: [{ '@type': 'City', name: 'Kenner, LA' }],
  },
  {
    slug: 'west-bank',
    name: 'West Bank',
    linkLabel: 'Auto glass repair on the West Bank',
    parishIds: ['jefferson', 'orleans'],
    areaServed: [
      ...[
        'Gretna',
        'Harvey',
        'Marrero',
        'Westwego',
        'Terrytown',
        'Timberlane',
        'Woodmere',
        'Estelle',
        'Bridge City',
        'Avondale',
        'Waggaman',
      ].map((name) => ({ '@type': 'City', name: `${name}, LA` })),
      { '@type': 'Place', name: 'Algiers, New Orleans, LA' },
    ],
  },
];

export const locationPath = (slug) => `/auto-glass-repair/${slug}`;

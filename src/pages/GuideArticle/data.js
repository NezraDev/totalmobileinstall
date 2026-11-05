import { guides } from '../../content/guides';
import { services } from '../../content/services';
export const data = {
  relatedHeading: 'Get it fixed at your location',
  requestLabel: 'Request mobile service',
  moreHeading: 'More auto glass guides',
  allGuidesLabel: 'All guides',
  records: Object.fromEntries(
    guides.map((guide) => {
      const service = services.find((item) => item.id === guide.service);
      return [
        guide.slug,
        {
          ...guide,
          seo: { ...guide.seo, image: guide.photo.src, imageAlt: guide.photo.alt },
          serviceName: service.name,
          serviceHref: `/services/${service.id}`,
          requestHref: `/book-service#service=${service.id}`,
        },
      ];
    }),
  ),
};

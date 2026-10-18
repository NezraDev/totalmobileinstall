import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applyMetadata, createPageMetadata } from '../../seo/metadata';
export default function PageMeta({
  title,
  description,
  image,
  imageAlt,
  noindex = false,
  notFound = false,
}) {
  const { pathname } = useLocation();
  useEffect(() => {
    applyMetadata(
      createPageMetadata(pathname, {
        title,
        description,
        image,
        imageAlt,
        noindex,
        notFound,
      }),
    );
  }, [title, description, image, imageAlt, noindex, notFound, pathname]);
  return null;
}

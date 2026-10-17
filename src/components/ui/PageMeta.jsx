import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { site } from '../../config/site';
export default function PageMeta({ title, description }) {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description || '');
    let canonical = document.querySelector('link[rel="canonical"]');
    if (site.canonicalBase) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.append(canonical);
      }
      canonical.href = new URL(pathname, site.canonicalBase).href;
    } else canonical?.remove();
  }, [title, description, pathname]);
  return null;
}

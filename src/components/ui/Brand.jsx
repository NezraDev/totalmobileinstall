import { business } from '../../content/business';
import { getResponsiveImageProps } from '../../content/image-sources';

export default function Brand() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span className="brand-icon">
        <img
          {...getResponsiveImageProps(business.icon, {
            sizes: '80px',
            fallbackWidth: 160,
          })}
          alt=""
          decoding="async"
        />
      </span>
      <span className="brand-wordmark">
        <span className="brand-name">
          <span>{business.brand.first}</span>{' '}
          <span>{business.brand.remainder}</span>
        </span>
        <span className="brand-descriptor">{business.brand.descriptor}</span>
      </span>
    </span>
  );
}

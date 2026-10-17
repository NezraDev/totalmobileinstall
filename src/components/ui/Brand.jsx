import { business } from '../../content/business';

export default function Brand() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span className="brand-icon">
        <img src={business.icon} alt="" width="500" height="500" />
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

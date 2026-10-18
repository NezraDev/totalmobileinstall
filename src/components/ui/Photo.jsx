import { getResponsiveImageProps } from '../../content/image-sources';

export default function Photo({
  photo,
  className = '',
  priority = false,
  sizes,
  onError,
  style,
  ...props
}) {
  if (!photo?.src) return null;
  return (
    <img
      className={className}
      {...getResponsiveImageProps(photo, { sizes })}
      alt={photo.alt || ''}
      style={{ objectPosition: photo.position || 'center', ...style }}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      {...props}
      onError={(e) => {
        e.currentTarget.style.visibility = 'hidden';
        onError?.(e);
      }}
    />
  );
}

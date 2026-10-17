export default function Photo({
  photo,
  className = '',
  priority = false,
  ...props
}) {
  if (!photo?.src) return null;
  return (
    <img
      className={className}
      src={photo.src}
      srcSet={
        photo.srcSmall
          ? `${photo.srcSmall} 768w, ${photo.src} ${photo.width || 1920}w`
          : undefined
      }
      sizes={props.sizes || '(max-width: 700px) 100vw, 60vw'}
      alt={photo.alt || ''}
      width={photo.width}
      height={photo.height}
      style={{ objectPosition: photo.position || 'center' }}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      {...props}
      onError={(e) => {
        e.currentTarget.style.visibility = 'hidden';
      }}
    />
  );
}

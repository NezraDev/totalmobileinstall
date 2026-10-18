import imageVariants from './image-variants.json' with { type: 'json' };

// The manifest records real pixel widths, including portrait max-edge variants.
// Use the same values for <img> and a matching responsive preload when required.
export function getResponsiveImageProps(
  photo,
  { sizes = '(max-width: 700px) 100vw, 50vw', fallbackWidth } = {},
) {
  const image = typeof photo === 'string' ? { src: photo } : photo;
  if (!image?.src) return {};
  const metadata = imageVariants[image.src];
  const sources = metadata?.sources;
  const fallback = fallbackWidth
    ? sources?.find((source) => source.width >= fallbackWidth)
    : null;
  return {
    src: fallback?.src || image.src,
    srcSet: sources
      ?.map((source) => `${source.src} ${source.width}w`)
      .join(', '),
    sizes: sources ? sizes : undefined,
    width: metadata?.width || image.width,
    height: metadata?.height || image.height,
  };
}

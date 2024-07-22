import React from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, ...props }) => (
  <img src={src} alt={alt} {...props} loading="lazy" />
);

export default LazyImage;

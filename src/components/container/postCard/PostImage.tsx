import Image from 'next/image';
import { useState } from 'react';

interface PostImageProps {
  src: string;
  alt: string;
}

export function PostImage({ src, alt }: PostImageProps) {
  const [imgSrc, setImgSrc] = useState(src || '');
  const [hide, setHide] = useState(false);

  if (!imgSrc || hide) return null;

  return (
    <Image
      width={600}
      height={600}
      src={imgSrc}
      alt={alt}
      className='max-h-[90vh] w-full rounded-md object-contain md:max-h-[80vh]'
      onError={() => {
        if (imgSrc !== '/images/no-image.jpg') {
          setImgSrc('/images/no-image.png');
        } else {
          setHide(true);
        }
      }}
    />
  );
}

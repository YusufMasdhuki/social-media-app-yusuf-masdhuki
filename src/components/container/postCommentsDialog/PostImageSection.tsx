'use client';

import Image from 'next/image';

export function PostImageSection({ imageUrl }: { imageUrl: string }) {
  return (
    <div className='relative h-[calc(90vh-40px)] max-w-[60%] flex-shrink-0 basis-auto bg-black/40 backdrop-blur-md'>
      <Image
        src={imageUrl || '/images/no-image.png'}
        alt='Post Image'
        width={720}
        height={720}
        className='h-[calc(90vh-40px)] w-auto object-contain'
      />
    </div>
  );
}

import { useState } from 'react';

import { Button } from '@/components/ui/button';

interface PostCaptionProps {
  authorName: string;
  caption: string;
}

export function PostCaption({ authorName, caption }: PostCaptionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='text-neutral-25 flex flex-col gap-1'>
      <h2 className='md:text-md text-sm font-bold'>{authorName}</h2>
      <p className={`text-md ${!expanded ? 'line-clamp-2' : ''}`}>{caption}</p>

      {caption.length > 100 && (
        <Button
          variant='link'
          onClick={() => setExpanded((prev) => !prev)}
          className='md:text-md text-primary-200 !h-auto self-start px-0 text-sm font-semibold'
        >
          {expanded ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </div>
  );
}

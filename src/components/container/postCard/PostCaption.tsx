import { useState } from 'react';

import { Button } from '@/components/ui/button';

interface PostCaptionProps {
  authorName: string;
  caption: string;
}

export function PostCaption({ authorName, caption }: PostCaptionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='flex flex-col gap-1'>
      <h2 className='text-md font-bold'>{authorName}</h2>
      <p className={`text-md ${!expanded ? 'line-clamp-2' : ''}`}>{caption}</p>

      {caption.length > 100 && (
        <Button
          variant='link'
          onClick={() => setExpanded((prev) => !prev)}
          className='text-md text-primary-200 !h-auto self-start px-0 font-semibold'
        >
          {expanded ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </div>
  );
}

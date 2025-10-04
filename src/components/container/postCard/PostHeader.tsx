import Image from 'next/image';
import { useState } from 'react';

import { formatTime } from '@/lib/format-time';
import type { FeedAuthor } from '@/types/feed-type';

interface PostHeaderProps {
  author: FeedAuthor;
  createdAt: string;
}

export function PostHeader({ author, createdAt }: PostHeaderProps) {
  const [avatarSrc, setAvatarSrc] = useState(
    author.avatarUrl || '/images/default-avatar.png'
  );

  return (
    <div className='flex items-center gap-3'>
      <Image
        src={avatarSrc}
        alt={author.username || 'user avatar'}
        width={64}
        height={64}
        className='aspect-square size-16 rounded-full object-cover'
        onError={() => setAvatarSrc('/images/default-avatar.png')}
      />
      <div>
        <h2 className='text-md font-bold'>{author.name}</h2>
        <p className='text-sm text-neutral-400'>{formatTime(createdAt)}</p>
      </div>
    </div>
  );
}

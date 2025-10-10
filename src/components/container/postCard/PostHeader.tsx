'use client';

import Image from 'next/image';
import { useState } from 'react';

import { formatTime } from '@/lib/format-time';
import { useProfileNavigation } from '@/lib/useProfileNavigation';
import type { FeedAuthor } from '@/types/feed-type';

interface PostHeaderProps {
  author: FeedAuthor;
  createdAt: string;
}

export function PostHeader({ author, createdAt }: PostHeaderProps) {
  const [avatarSrc, setAvatarSrc] = useState(
    author.avatarUrl || '/images/default-avatar.png'
  );

  const { handleProfileClick } = useProfileNavigation();

  return (
    <div
      className='group flex cursor-pointer items-center gap-2 md:gap-3'
      onClick={() => handleProfileClick(author.username)}
    >
      <Image
        src={avatarSrc}
        alt={author.username || 'user avatar'}
        width={64}
        height={64}
        className='aspect-square size-11 rounded-full object-cover md:size-16'
        onError={() => setAvatarSrc('/images/default-avatar.png')}
      />
      <div>
        <h2 className='md:text-md text-neutral-25 group-hover:text-primary-200 text-sm font-bold transition-all duration-300 ease-out'>
          {author.name}
        </h2>
        <p className='text-xs text-neutral-400 md:text-sm'>
          {formatTime(createdAt)}
        </p>
      </div>
    </div>
  );
}

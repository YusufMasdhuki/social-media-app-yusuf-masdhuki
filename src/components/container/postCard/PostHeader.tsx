'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useGetMe } from '@/hooks/my-profile/useGetMe';
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

  const router = useRouter();
  const { data: meData } = useGetMe();

  const handleProfileClick = () => {
    // kalau user yang sedang login
    if (meData?.data.profile.username === author.username) {
      router.push('/myProfile');
    } else {
      router.push(`/friendsProfile/${author.username}`);
    }
  };

  return (
    <div
      className='group flex cursor-pointer items-center gap-2 md:gap-3'
      onClick={handleProfileClick}
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

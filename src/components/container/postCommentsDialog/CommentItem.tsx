'use client';

import Image from 'next/image';

import { formatTime } from '@/lib/format-time';
import { useProfileNavigation } from '@/lib/useProfileNavigation';
import type { PostComment } from '@/types/get-post-comments-type';

export function CommentItem({ comment }: { comment: PostComment }) {
  const { handleProfileClick } = useProfileNavigation();
  return (
    <div className='text-neutral-25 py-3 md:py-4'>
      <div
        className='group mb-2 flex max-w-max cursor-pointer items-center gap-2 md:mb-2.5'
        onClick={() => handleProfileClick(comment.author.username)}
      >
        <Image
          src={comment.author.avatarUrl || '/images/default-avatar.png'}
          alt={comment.author.username}
          width={40}
          height={40}
          className='aspect-square rounded-full object-cover'
        />
        <div>
          <p className='group-hover:text-primary-200 transition-base text-xs font-semibold md:text-sm md:font-bold'>
            {comment.author.username}
          </p>
          <p className='text-xs text-neutral-400'>
            {formatTime(comment.createdAt)}
          </p>
        </div>
      </div>
      <p className='text-xs md:text-sm'>{comment.text}</p>
    </div>
  );
}

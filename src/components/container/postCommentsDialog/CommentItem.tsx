'use client';

import Image from 'next/image';

import type { PostComment } from '@/types/get-post-comments-type';

export function CommentItem({ comment }: { comment: PostComment }) {
  return (
    <div className='flex items-start gap-3'>
      <Image
        src={comment.author.avatarUrl || '/images/default-avatar.png'}
        alt={comment.author.username}
        width={32}
        height={32}
        className='aspect-square rounded-full object-cover'
      />
      <div>
        <p className='text-sm'>
          <span className='font-semibold'>{comment.author.username} </span>
          {comment.text}
        </p>
        <p className='mt-1 text-xs text-neutral-500'>
          {new Date(comment.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

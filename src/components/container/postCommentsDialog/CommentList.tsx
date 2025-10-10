'use client';

import { Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

import type { PostComment } from '@/types/get-post-comments-type';

import { CommentItem } from './CommentItem';

interface CommentListProps {
  comments: PostComment[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetching: boolean;
}

export function CommentList({
  comments,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isFetching,
}: CommentListProps) {
  const { ref, inView } = useInView({ rootMargin: '100px' });

  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  return (
    <div className='mr-5 flex min-h-[200px] flex-col divide-y divide-neutral-900'>
      {comments.length === 0 && !isFetching && (
        <div className='flex flex-1 flex-col items-center justify-center gap-1 py-10 text-center'>
          <p className='text-md text-neutral-25 font-bold'>No Comments yet</p>
          <p className='text-sm text-neutral-400'>Start the conversation</p>
        </div>
      )}

      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}

      {hasNextPage && (
        <div ref={ref} className='flex justify-center py-3'>
          {isFetchingNextPage && (
            <Loader2 className='h-5 w-5 animate-spin text-neutral-400' />
          )}
        </div>
      )}
    </div>
  );
}

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
    <div className='space-y-4 pt-5'>
      {comments.length === 0 && !isFetching && (
        <p className='text-center text-neutral-500'>No comments yet</p>
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

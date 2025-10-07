'use client';

import Image from 'next/image';
import { useRef } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';

import { usePostComments } from '@/hooks/comments/usePostComments';

import { CommentInput } from './CommentInput';
import { CommentList } from './CommentList';
import { PostActions } from '../postCard/PostActions';

interface PostCommentsSectionProps {
  post: {
    id: number;
    caption: string;
    likedByMe: boolean;
    likeCount: number;
    author: { username: string; avatarUrl: string };
  };
  username?: string;
  userPostsLimit?: number;
  onLikeChange?: (postId: number, liked: boolean, likeCount: number) => void;
}

export function PostCommentsSection({
  post,
  username,
  userPostsLimit,
  onLikeChange,
}: PostCommentsSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null); // ref ke input komentar

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    usePostComments(post.id);
  const allComments = data?.pages.flatMap((p) => p.data.comments) || [];

  return (
    <div className='flex h-[calc(90vh-40px)] flex-1 flex-col bg-neutral-950 p-5 pr-0'>
      <ScrollArea className='h-full w-full overflow-y-auto'>
        {/* Header */}
        <div className='mr-5 flex flex-col border-b border-neutral-800 pb-5'>
          <div className='flex items-center gap-3 pb-3'>
            <Image
              src={post.author.avatarUrl || '/images/default-avatar.png'}
              alt={post.author.username}
              width={40}
              height={40}
              className='aspect-square rounded-full object-cover'
            />
            <div className='flex flex-col'>
              <span className='text-sm font-semibold'>
                {post.author.username}
              </span>
            </div>
          </div>
          <p className='text-sm text-neutral-300'>{post.caption}</p>
        </div>

        {/* Comments List */}
        <CommentList
          comments={allComments}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isFetching={isFetching}
        />
      </ScrollArea>

      {/* Post Actions */}
      <PostActions
        postId={post.id}
        likedByMe={post.likedByMe}
        likeCount={post.likeCount}
        commentCount={allComments.length}
        onCommentClick={() => inputRef.current?.focus()}
        username={username}
        userPostsLimit={userPostsLimit}
        onLikeChange={(postId, liked, likeCount) =>
          onLikeChange?.(postId, liked, likeCount)
        }
        className='pt-3 pr-5'
      />

      {/* Footer */}
      <CommentInput ref={inputRef} postId={post.id} />
    </div>
  );
}

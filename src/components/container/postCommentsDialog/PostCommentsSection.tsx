import Image from 'next/image';
import { useRef } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';

import { usePostComments } from '@/hooks/comments/usePostComments';
import { formatTime } from '@/lib/format-time';
import { useIsMobile } from '@/lib/use-is-mobile';
import { useProfileNavigation } from '@/lib/useProfileNavigation';

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
    createdAt: string;
  };
  username?: string;
  userPostsLimit?: number;
  onLikeChange?: (postId: number, liked: boolean, likeCount: number) => void;
  onSaveChange?: (postId: number, saved: boolean) => void;
}

export function PostCommentsSection({
  post,
  username,
  userPostsLimit,
  onLikeChange,
  onSaveChange,
}: PostCommentsSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    usePostComments(post.id);
  const { handleProfileClick } = useProfileNavigation();

  const allComments = data?.pages.flatMap((p) => p.data.comments) || [];

  return (
    <div className='text-neutral-25 flex h-[calc(80vh-40px)] flex-1 flex-col bg-neutral-950 p-4 pr-0 max-md:pb-8 md:h-[calc(90vh-40px)] md:p-5 md:pr-0'>
      <h3 className='text-md block font-bold md:hidden'>Comments</h3>
      <ScrollArea className='h-full w-full overflow-y-auto'>
        {!isMobile && (
          <div className='mr-5 flex flex-col border-b border-neutral-800 pb-4'>
            {/* Author */}
            <div
              className='group flex max-w-max cursor-pointer items-center gap-3 pb-3 transition-all duration-300 ease-out'
              onClick={() => handleProfileClick(post.author.username)}
            >
              <Image
                src={post.author.avatarUrl || '/images/default-avatar.png'}
                alt={post.author.username}
                width={40}
                height={40}
                className='h-10 w-10 rounded-full object-cover'
              />
              <div className='flex flex-col'>
                <span className='group-hover:text-primary-200 text-sm font-bold transition-all duration-300 ease-out'>
                  {post.author.username}
                </span>
                <span className='text-xs text-neutral-400'>
                  {formatTime(post.createdAt)}
                </span>
              </div>
            </div>
            <p className='text-sm text-neutral-300'>{post.caption}</p>
          </div>
        )}
        <h3 className='text-md hidden pt-4 font-bold md:block'>Comments</h3>

        <CommentList
          comments={allComments}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isFetching={isFetching}
        />
      </ScrollArea>

      {!isMobile && (
        <PostActions
          postId={post.id}
          likedByMe={post.likedByMe}
          likeCount={post.likeCount}
          commentCount={allComments.length}
          onCommentClick={() => inputRef.current?.focus()}
          username={username}
          userPostsLimit={userPostsLimit}
          onLikeChange={onLikeChange}
          onSaveChange={onSaveChange}
          className='pt-3 pr-5'
        />
      )}

      <CommentInput ref={inputRef} postId={post.id} />
    </div>
  );
}

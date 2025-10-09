import clsx from 'clsx';
import Image from 'next/image';
import { useMemo } from 'react';

import Love from '@/components/icons/love';
import SaveIcon from '@/components/icons/save-icon';
import { Button } from '@/components/ui/button';

import { useGetPostLikes } from '@/hooks/likes/useGetPostLikes';
import { useToggleLikePost } from '@/hooks/likes/useToggleLikePost';
import { useSavedPosts } from '@/hooks/saves/useSavedPosts';
import { useToggleSavePost } from '@/hooks/saves/useToggleSavePost';

import PostLikesDialog from '../PostLikesDialog';

interface PostActionsProps {
  postId: number;
  likedByMe: boolean;
  likeCount: number;
  commentCount: number;
  username?: string;
  userPostsLimit?: number;
  onCommentClick?: () => void;
  onLikeChange?: (postId: number, liked: boolean, likeCount: number) => void;
  onSaveChange?: (postId: number, saved: boolean) => void;
  className?: string;
}

export function PostActions({
  postId,
  likedByMe,
  likeCount,
  commentCount,
  username,
  userPostsLimit,
  onSaveChange,
  onCommentClick,
  onLikeChange,
  className,
}: PostActionsProps) {
  const toggleLikeMutation = useToggleLikePost(
    postId,
    username,
    userPostsLimit
  );
  const toggleSaveMutation = useToggleSavePost(postId);

  const { isSaved, toggle } = useSavedPosts(); // Redux

  const handleToggleLike = () => {
    const newLiked = !likedByMe;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;

    onLikeChange?.(postId, newLiked, newCount);

    toggleLikeMutation.mutate(
      { like: newLiked },
      {
        onSuccess: (data) => {
          onLikeChange?.(postId, data.data.liked, data.data.likeCount);
        },
        onError: () => {
          onLikeChange?.(postId, likedByMe, likeCount);
        },
      }
    );
  };

  const handleToggleSave = () => {
    const currentlySaved = isSaved(postId);

    // update Redux
    toggle(postId);

    // callback ke parent
    onSaveChange?.(postId, !currentlySaved);

    // update server
    toggleSaveMutation.mutate({ save: !currentlySaved });
  };

  const { data } = useGetPostLikes(postId, 3);
  const likeNames = useMemo(() => {
    const users = data?.pages?.[0]?.data.users ?? [];
    if (users.length === 0) return null;
    const names = users.map((u) => u.name || u.username);
    if (names.length === 1) return `Liked by ${names[0]}`;
    if (names.length === 2) return `Liked by ${names[0]} and ${names[1]}`;
    return `Liked by ${names[0]}, ${names[1]} and ${likeCount - 2} others`;
  }, [data, likeCount]);

  return (
    <div className={clsx('flex flex-col', className)}>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3 md:gap-4'>
          <Button size='icon' variant='icon' onClick={handleToggleLike}>
            <Love
              filled={likedByMe}
              fillColor='#B41759'
              strokeColor='#FDFDFD'
              size={24}
            />
            <span className='md:text-md text-sm font-semibold'>
              {likeCount}
            </span>
          </Button>

          <Button
            size='icon'
            variant='icon'
            onClick={onCommentClick}
            className='flex items-center gap-1.5'
          >
            <Image
              src='/icons/comment-icon.svg'
              alt='comment'
              width={24}
              height={24}
            />
            <span className='md:text-md text-sm font-semibold'>
              {commentCount}
            </span>
          </Button>

          <Image
            src='/icons/share-icon.svg'
            alt='share'
            width={24}
            height={24}
          />
        </div>

        <Button size='icon' variant='icon' onClick={handleToggleSave}>
          <SaveIcon
            filled={isSaved(postId)}
            fillColor='#FDFDFD'
            strokeColor='#FDFDFD'
          />
        </Button>
      </div>

      {likeNames && (
        <PostLikesDialog
          postId={postId}
          trigger={
            <div className='hover:text-primary-200 max-w-max cursor-pointer justify-start px-0 text-sm font-medium transition-all duration-300 ease-out'>
              {likeNames}
            </div>
          }
        />
      )}
    </div>
  );
}

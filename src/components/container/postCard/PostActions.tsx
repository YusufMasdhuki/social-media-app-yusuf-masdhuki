'use client';

import Image from 'next/image';

import Love from '@/components/icons/love';
import SaveIcon from '@/components/icons/save-icon';
import { Button } from '@/components/ui/button';

import { useToggleLikePost } from '@/hooks/likes/useToggleLikePost';

import PostLikesDialog from '../PostLikesDialog';

interface PostActionsProps {
  postId: number;
  likedByMe: boolean;
  likeCount: number;
  commentCount: number;
  onCommentClick?: () => void;
}

export function PostActions({
  postId,
  likedByMe,
  likeCount,
  commentCount,
  onCommentClick,
}: PostActionsProps) {
  const toggleLikeMutation = useToggleLikePost(postId);

  const handleToggleLike = () => {
    toggleLikeMutation.mutate({ like: !likedByMe });
  };

  return (
    <div className='flex items-center justify-between'>
      <div className='text-md flex items-center gap-4'>
        <div className='flex items-center gap-1.5'>
          <Button
            size='icon'
            variant='icon'
            onClick={handleToggleLike}
            disabled={toggleLikeMutation.isPending}
            className='size-6 cursor-pointer bg-transparent'
          >
            <Love
              filled={likedByMe}
              fillColor='#B41759'
              strokeColor='#FDFDFD'
              size={24}
            />
          </Button>
          <PostLikesDialog
            postId={postId}
            trigger={
              <Button
                variant='text'
                size='icon'
                className='text-md w-auto font-semibold'
              >
                {likeCount}
              </Button>
            }
          />
        </div>

        <Button
          size='icon'
          variant='text'
          onClick={onCommentClick}
          className='flex items-center gap-1.5'
        >
          <Image
            src='/icons/comment-icon.svg'
            alt='comment'
            width={24}
            height={24}
          />
          <span>{commentCount}</span>
        </Button>

        <Image src='/icons/share-icon.svg' alt='share' width={24} height={24} />
      </div>
      <SaveIcon />
    </div>
  );
}

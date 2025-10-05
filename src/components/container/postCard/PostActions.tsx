'use client';

import Image from 'next/image';
import { useState } from 'react';

import Love from '@/components/icons/love';
import SaveIcon from '@/components/icons/save-icon';
import { Button } from '@/components/ui/button';

import { useToggleLikePost } from '@/hooks/likes/useToggleLikePost';

import PostLikesDialog from '../PostLikesDialog';

interface PostActionsProps {
  postId: number;
  initialLiked: boolean;
  initialLikeCount: number;
  commentCount: number;
  onCommentClick?: () => void; // opsional
}

export function PostActions({
  postId,
  initialLiked,
  initialLikeCount,
  commentCount,
  onCommentClick,
}: PostActionsProps) {
  const [likedByMe, setLikedByMe] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const toggleLikeMutation = useToggleLikePost(postId);

  const handleToggleLike = () => {
    const nextLiked = !likedByMe;
    setLikedByMe(nextLiked);
    setLikeCount((prev) => (nextLiked ? prev + 1 : prev - 1));

    toggleLikeMutation.mutate(
      { like: nextLiked },
      {
        onError: () => {
          setLikedByMe(initialLiked);
          setLikeCount(initialLikeCount);
        },
      }
    );
  };

  return (
    <div className='flex items-center justify-between'>
      <div className='text-md flex items-center gap-4'>
        {/* Like */}
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

        {/* Comment */}
        <Button
          size='icon'
          variant='text'
          onClick={onCommentClick} // perilaku bisa disesuaikan
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

        {/* Share */}
        <Image src='/icons/share-icon.svg' alt='share' width={24} height={24} />
      </div>
      <SaveIcon />
    </div>
  );
}

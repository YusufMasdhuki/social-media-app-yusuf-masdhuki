'use client';

import Image from 'next/image';
import { useState } from 'react';

import Love from '@/components/icons/love';
import SaveIcon from '@/components/icons/save-icon';

import { useToggleLikePost } from '@/hooks/likes/useToggleLikePost';

interface PostActionsProps {
  postId: number;
  initialLiked: boolean;
  initialLikeCount: number;
  commentCount: number;
}

export function PostActions({
  postId,
  initialLiked,
  initialLikeCount,
  commentCount,
}: PostActionsProps) {
  const [likedByMe, setLikedByMe] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const toggleLikeMutation = useToggleLikePost(postId);

  const handleToggleLike = () => {
    const nextLiked = !likedByMe;

    // Optimistic UI
    setLikedByMe(nextLiked);
    setLikeCount((prev) => (nextLiked ? prev + 1 : prev - 1));

    toggleLikeMutation.mutate(
      { like: nextLiked },
      {
        onError: () => {
          // rollback kalau error
          setLikedByMe(initialLiked);
          setLikeCount(initialLikeCount);
        },
      }
    );
  };

  return (
    <div className='flex items-center justify-between'>
      <div className='text-md flex items-center gap-4'>
        <button
          onClick={handleToggleLike}
          disabled={toggleLikeMutation.isPending}
          className='flex cursor-pointer items-center gap-1.5'
        >
          <Love
            filled={likedByMe}
            fillColor='red'
            strokeColor='gray'
            size={24}
          />
          <span>{likeCount}</span>
        </button>

        <div className='flex items-center gap-1.5'>
          <Image
            src='/icons/comment-icon.svg'
            alt='comment'
            width={24}
            height={24}
          />
          <span>{commentCount}</span>
        </div>

        <Image src='/icons/share-icon.svg' alt='share' width={24} height={24} />
      </div>
      <SaveIcon />
    </div>
  );
}

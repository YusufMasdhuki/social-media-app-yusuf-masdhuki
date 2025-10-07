'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState, useMemo } from 'react';

import Love from '@/components/icons/love';
import SaveIcon from '@/components/icons/save-icon';
import { Button } from '@/components/ui/button';

import { useGetPostLikes } from '@/hooks/likes/useGetPostLikes';
import { useToggleLikePost } from '@/hooks/likes/useToggleLikePost';

import PostLikesDialog from '../PostLikesDialog';

interface PostActionsProps {
  postId: number;
  likedByMe: boolean;
  likeCount: number;
  commentCount: number;
  username?: string;
  userPostsLimit?: number;
  onCommentClick?: () => void;
  /** 🔥 Callback dari parent (misalnya LikedGallery) untuk update UI luar */
  onLikeChange?: (postId: number, liked: boolean, likeCount: number) => void;
  className?: string;
}

export function PostActions({
  postId,
  likedByMe: likedByMeProp,
  likeCount: likeCountProp,
  commentCount,
  username,
  userPostsLimit,
  onCommentClick,
  onLikeChange,
  className,
}: PostActionsProps) {
  // ✅ stabilkan params agar key React Query tetap konsisten
  const savedParams = useMemo(() => ({ limit: 12 }), []);

  const toggleLikeMutation = useToggleLikePost(
    postId,
    username,
    userPostsLimit,
    savedParams
  );

  // ✅ local state untuk optimistik update
  const [likedByMe, setLikedByMe] = useState(likedByMeProp);
  const [likeCount, setLikeCount] = useState(likeCountProp);

  // ✅ Fungsi handle toggle like
  const handleToggleLike = () => {
    const newLiked = !likedByMe;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;

    // Optimistic UI update
    setLikedByMe(newLiked);
    setLikeCount(newCount);

    // Jalankan mutation
    toggleLikeMutation.mutate(
      { like: newLiked },
      {
        onSuccess: (data) => {
          const serverLike = data.data.liked;
          const serverCount = data.data.likeCount;

          // Koreksi data berdasarkan hasil server
          setLikedByMe(serverLike);
          setLikeCount(serverCount);

          // ✅ Update parent UI (misalnya di LikedGallery)
          onLikeChange?.(postId, serverLike, serverCount);
        },
        onError: () => {
          // Rollback jika gagal
          setLikedByMe(likedByMeProp);
          setLikeCount(likeCountProp);
        },
      }
    );
  };

  // ✅ Ambil nama yang like untuk dialog
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
        <div className='flex items-center gap-4'>
          <Button size='icon' variant='icon' onClick={handleToggleLike}>
            <Love
              filled={likedByMe}
              fillColor='#B41759'
              strokeColor='#FDFDFD'
              size={24}
            />
            <span className='text-md font-semibold'>{likeCount}</span>
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
            <span>{commentCount}</span>
          </Button>

          <Image
            src='/icons/share-icon.svg'
            alt='share'
            width={24}
            height={24}
          />
        </div>
        <SaveIcon />
      </div>

      {likeNames && (
        <PostLikesDialog
          postId={postId}
          trigger={
            <Button
              variant='text'
              type='button'
              className='!h-7 !w-auto max-w-max justify-start px-0 text-sm font-medium'
            >
              {likeNames}
            </Button>
          }
        />
      )}
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { PostCommentsDialog } from '@/components/container/postCommentsDialog/PostCommentsDialog';

import { useGetPostById } from '@/hooks/posts/useGetPostById';
import { useGetSavedPostsInfinite } from '@/hooks/saves/useGetSavedPostsInfinite';
import type { FeedItem } from '@/types/feed-type';
import { SavedPost } from '@/types/get-saved-post';

const SavedGallery = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetSavedPostsInfinite({ limit: 12 });

  const posts: SavedPost[] =
    data?.pages.flatMap((page) => page.data.posts) ?? [];

  const { ref, inView } = useInView({ threshold: 1 });

  const [selectedPost, setSelectedPost] = useState<SavedPost | null>(null);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Fetch detail saat post dipilih
  const { data: postDetailData } = useGetPostById(
    selectedPost?.id ?? 0,
    !!selectedPost
  );

  if (posts.length === 0) {
    return (
      <p className='mt-6 text-center text-neutral-400'>
        There are no saved posts yet
      </p>
    );
  }

  return (
    <>
      <div className='mt-6 grid grid-cols-3 gap-2'>
        {posts.map((post, index) => (
          <div
            key={`${post.id}-${index}`}
            className='relative aspect-square cursor-pointer'
            onClick={() => setSelectedPost(post)}
          >
            <Image
              src={post.imageUrl}
              alt={post.caption || 'Saved post'}
              fill
              className='rounded-md object-cover'
            />
          </div>
        ))}

        {/* sentinel */}
        {hasNextPage && (
          <div
            ref={ref}
            className='col-span-3 flex justify-center py-4 text-neutral-400'
          >
            {isFetchingNextPage
              ? 'Loading...'
              : 'Scroll untuk load lebih banyak'}
          </div>
        )}
      </div>

      {/* Dialog */}
      {selectedPost && (
        <PostCommentsDialog
          post={
            postDetailData?.data ??
            ({
              id: selectedPost.id,
              imageUrl: selectedPost.imageUrl,
              caption: selectedPost.caption,
              createdAt: selectedPost.createdAt,
              likedByMe: false,
              likeCount: 0,
              commentCount: 0,
              author: {
                id: 0,
                username: 'unknown',
                name: 'Unknown',
                avatarUrl: '/images/default-avatar.png',
              },
            } as FeedItem)
          }
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
};

export default SavedGallery;

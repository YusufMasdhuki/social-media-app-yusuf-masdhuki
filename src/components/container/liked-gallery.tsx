'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { useInfiniteUserLikes } from '@/hooks/users/useInfiniteUserLikes';
import { toFeedItem } from '@/lib/adapter';
import type { FeedItem } from '@/types/feed-type';

import { PostCommentsDialog } from './postCommentsDialog/PostCommentsDialog';

const LikedGallery = ({ username }: { username: string }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteUserLikes(username, 12);

  const { ref, inView } = useInView({ threshold: 1 });
  const [selectedPost, setSelectedPost] = useState<FeedItem | null>(null);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') return <p>Loading liked posts...</p>;
  if (status === 'error') return <p>Failed to load liked posts.</p>;

  const posts = data?.pages.flatMap((page) => page.data.posts) ?? [];

  if (posts.length === 0) {
    return (
      <div className='mt-6 flex flex-col items-center justify-center gap-4 text-center'>
        <p className='text-neutral-400'>No liked posts yet</p>
      </div>
    );
  }

  return (
    <>
      <div className='mt-6 grid grid-cols-3 gap-2'>
        {posts.map(
          (post) =>
            post.imageUrl && (
              <button
                key={post.id}
                onClick={() => setSelectedPost(toFeedItem(post))}
                className='relative aspect-square cursor-pointer focus:outline-none'
              >
                <Image
                  src={post.imageUrl}
                  alt={post.caption || 'Liked post'}
                  fill
                  className='rounded-md object-cover'
                />
              </button>
            )
        )}

        {/* infinite scroll trigger */}
        {hasNextPage && (
          <div
            ref={ref}
            className='col-span-3 flex items-center justify-center py-4'
          >
            {isFetchingNextPage && <p>Loading more...</p>}
          </div>
        )}
      </div>

      {/* dialog muncul kalau selectedPost ada */}
      {selectedPost && (
        <PostCommentsDialog
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
};

export default LikedGallery;

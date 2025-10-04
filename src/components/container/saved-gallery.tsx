'use client';

import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

import { useGetSavedPostsInfinite } from '@/hooks/saves/useGetSavedPostsInfinite';

const SavedGallery = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetSavedPostsInfinite({ limit: 12 });

  // kumpulin semua posts
  const posts = data?.pages.flatMap((page) => page.data.posts) ?? [];

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: false,
  });

  // kalau div sentinel masuk viewport, fetchNextPage
  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  if (posts.length === 0) {
    return (
      <p className='mt-6 text-center text-neutral-400'>
        There are no saved posts yet
      </p>
    );
  }

  return (
    <div className='mt-6 grid grid-cols-3 gap-2'>
      {posts.map((post) => (
        <div key={post.id} className='relative aspect-square'>
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
          {isFetchingNextPage ? 'Loading...' : 'Scroll untuk load lebih banyak'}
        </div>
      )}
    </div>
  );
};

export default SavedGallery;

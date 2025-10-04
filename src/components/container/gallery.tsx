'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useInfiniteUserPosts } from '@/hooks/users/useInfiniteUserPosts';

const Gallery = ({ username }: { username: string }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteUserPosts(username, 12);

  const { ref, inView } = useInView({ threshold: 1 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') return <p>Loading posts...</p>;
  if (status === 'error') return <p>Failed to load posts.</p>;

  // 🔹 gabungkan semua posts
  const posts = data?.pages.flatMap((page) => page.data.posts) ?? [];

  // 🔹 kalau kosong, tampilkan fallback
  if (posts.length === 0) {
    return (
      <div className='mt-6 flex flex-col items-center justify-center gap-4 text-center'>
        <p className='text-neutral-400'>No posts yet</p>
        <button
          onClick={() => console.log('Create new post')}
          className='rounded-md bg-white px-4 py-2 text-black hover:bg-neutral-200'
        >
          Create Post
        </button>
      </div>
    );
  }

  return (
    <div className='mt-6 grid grid-cols-3 gap-2'>
      {posts.map(
        (post) =>
          post.imageUrl && (
            <div key={post.id} className='relative aspect-square'>
              <Image
                src={post.imageUrl}
                alt={post.caption || 'User post'}
                fill
                className='rounded-md object-cover'
              />
            </div>
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
  );
};

export default Gallery;

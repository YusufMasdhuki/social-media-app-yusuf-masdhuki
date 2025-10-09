'use client';

import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';

import PostCard from '@/components/container/postCard/PostCard';

import { useFeed } from '@/hooks/feed/useFeed';
import type { RootState } from '@/store';
import type { FeedItem, GetFeedErrorResponse } from '@/types/feed-type';

export default function Home() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useFeed(5);

  const { ref, inView } = useInView({
    threshold: 1, // fully visible baru trigger
    triggerOnce: false, // bisa load berkali-kali
  });

  // 🔹 Auto-fetch saat observer kelihatan
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 🔹 Kalau belum login
  if (!isAuthenticated) {
    return (
      <div className='mx-auto flex min-h-screen w-full max-w-150 items-center justify-center px-4'>
        <p className='text-lg text-neutral-400'>
          You must be logged in to view the feed
        </p>
      </div>
    );
  }

  if (status === 'pending') return <p>Loading feed...</p>;
  if (status === 'error')
    return <p>Error: {(error as GetFeedErrorResponse).message}</p>;

  return (
    <div className='mx-auto min-h-screen w-full max-w-158 px-4 pt-16 pb-32 md:pt-26'>
      <div className='flex flex-col divide-y divide-neutral-900'>
        {data?.pages
          .flatMap((page) => page.data.items)
          .map((item: FeedItem) => (
            <PostCard key={item.id} item={item} />
          ))}
      </div>

      {/* 🔹 Loader + Observer */}
      <div ref={ref} className='flex h-12 items-center justify-center'>
        {isFetchingNextPage && (
          <Loader2 className='h-5 w-5 animate-spin text-gray-500' />
        )}
        {!hasNextPage && <p className='text-gray-500'>No more posts</p>}
      </div>
    </div>
  );
}

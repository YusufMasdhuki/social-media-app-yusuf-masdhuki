'use client';

import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { PostCommentsDialog } from '@/components/container/postCommentsDialog/PostCommentsDialog';

import { useGetSavedPostsInfinite } from '@/hooks/saves/useGetSavedPostsInfinite';
import { toFeedItem } from '@/lib/adapter';
import type { FeedItem } from '@/types/feed-type';

import Love from '../icons/love';

const SavedGallery = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useGetSavedPostsInfinite({ limit: 12 });

  const { ref, inView } = useInView({ threshold: 1 });
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  // ✅ State lokal untuk sinkron manual
  const [postsState, setPostsState] = useState<FeedItem[]>([]);

  // ✅ Update postsState setiap kali data baru di-fetch
  useEffect(() => {
    if (data) {
      const fetched = data.pages.flatMap((page) => page.data.posts) ?? [];
      const adapted = fetched.map((post) => toFeedItem(post));
      setPostsState(adapted);
    }
  }, [data]);

  // ✅ Infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ✅ Update state lokal saat like berubah di dialog
  const handleUpdatePost = (
    postId: number,
    liked: boolean,
    likeCount: number
  ) => {
    setPostsState((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likedByMe: liked, likeCount } : p
      )
    );
  };

  if (status === 'pending') return <p>Loading saved posts...</p>;
  if (status === 'error') return <p>Failed to load saved posts.</p>;
  if (postsState.length === 0)
    return (
      <p className='mt-6 text-center text-neutral-400'>
        There are no saved posts yet
      </p>
    );

  const selectedPost = postsState.find((p) => p.id === selectedPostId);

  return (
    <>
      <div className='mt-6 grid grid-cols-3 gap-2'>
        {postsState.map((post) => (
          <div
            key={post.id}
            className='group relative aspect-square cursor-pointer overflow-hidden rounded-md'
            onClick={() => setSelectedPostId(post.id)}
          >
            <Image
              src={post.imageUrl || '/images/no-image.png'}
              alt={post.caption || 'Saved post'}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-110'
            />
            <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
              <div className='flex items-center gap-4 text-white'>
                <div className='flex items-center gap-1'>
                  <Love
                    filled
                    fillColor='white'
                    className='h-5 w-5 fill-white'
                  />
                  <span className='text-sm font-semibold'>
                    {post.likeCount ?? 0}
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <MessageCircle className='h-5 w-5 fill-white' />
                  <span className='text-sm font-semibold'>
                    {post.commentCount ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {hasNextPage && (
          <div
            ref={ref}
            className='col-span-3 flex items-center justify-center py-4'
          >
            {isFetchingNextPage && <p>Loading more...</p>}
          </div>
        )}
      </div>

      {selectedPost && (
        <PostCommentsDialog
          post={toFeedItem(selectedPost)}
          onClose={() => setSelectedPostId(null)}
          username={selectedPost.author.username}
          userPostsLimit={12}
          onLikeChange={handleUpdatePost} // ✅ sinkron dengan state lokal
        />
      )}
    </>
  );
};

export default SavedGallery;

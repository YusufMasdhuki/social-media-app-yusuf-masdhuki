'use client';

import { Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { PostCommentsDialog } from '@/components/container/postCommentsDialog/PostCommentsDialog';

import { useGetPostById } from '@/hooks/posts/useGetPostById';
import { useGetSavedPostsInfinite } from '@/hooks/saves/useGetSavedPostsInfinite';
import type { FeedItem } from '@/types/feed-type';
import { PostDetail } from '@/types/get-post-detail-type';

const SavedGallery = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useGetSavedPostsInfinite({ limit: 12 });

  const posts: PostDetail[] =
    data?.pages.flatMap((page) => page.data.posts) ?? [];

  const { ref, inView } = useInView({ threshold: 1 });
  const [selectedPost, setSelectedPost] = useState<PostDetail | null>(null);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Fetch detail saat post dipilih
  const { data: postDetailData } = useGetPostById(
    selectedPost?.id ?? 0,
    !!selectedPost
  );

  if (status === 'pending') return <p>Loading saved posts...</p>;
  if (status === 'error') return <p>Failed to load saved posts.</p>;

  if (posts.length === 0) {
    return (
      <p className='mt-6 text-center text-neutral-400'>
        There are no saved posts yet
      </p>
    );
  }

  // 🔹 Normalisasi biar cocok sama PostCommentsDialog
  const normalizePost = (post: PostDetail): FeedItem => ({
    id: post.id,
    caption: post.caption,
    likedByMe: post.likedByMe,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    imageUrl: post.imageUrl || '/images/no-image.png',
    createdAt: post.createdAt,
    author: post.author,
  });

  return (
    <>
      <div className='mt-6 grid grid-cols-3 gap-2'>
        {posts.map((post) => (
          <div
            key={post.id}
            className='group relative aspect-square cursor-pointer overflow-hidden rounded-md'
            onClick={() => setSelectedPost(post)}
          >
            <Image
              src={post.imageUrl || '/images/no-image.png'}
              alt={post.caption || 'Saved post'}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-110'
            />

            {/* Overlay hover */}
            <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
              <div className='flex items-center gap-4 text-white'>
                <div className='flex items-center gap-1'>
                  <Heart className='h-5 w-5 fill-white' />
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

        {/* Infinite scroll sentinel */}
        {hasNextPage && (
          <div
            ref={ref}
            className='col-span-3 flex items-center justify-center py-4'
          >
            {isFetchingNextPage && <p>Loading more...</p>}
          </div>
        )}
      </div>

      {/* Dialog post detail */}
      {selectedPost && (
        <PostCommentsDialog
          post={postDetailData?.data ?? normalizePost(selectedPost)}
          onClose={() => setSelectedPost(null)}
          username={postDetailData?.data?.author.username}
          userPostsLimit={12}
        />
      )}
    </>
  );
};

export default SavedGallery;

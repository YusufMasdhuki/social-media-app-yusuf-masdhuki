'use client';

import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { PostCommentsDialog } from '@/components/container/postCommentsDialog/PostCommentsDialog';

import { useInfiniteUserPosts } from '@/hooks/users/useInfiniteUserPosts';
import { Post } from '@/types/get-user-post-type';

import Love from '../icons/love';

const Gallery = ({ username }: { username: string }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteUserPosts(username, 12);

  const { ref, inView } = useInView({ threshold: 1 });

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') return <p>Loading posts...</p>;
  if (status === 'error') return <p>Failed to load posts.</p>;

  const posts = data?.pages.flatMap((page) => page.data.posts) ?? [];

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

  // 🔹 Normalisasi post supaya cocok dengan PostCommentsDialog
  const normalizePost = (post: Post) => ({
    id: post.id,
    caption: post.caption,
    likedByMe: post.likedByMe,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    imageUrl: post.imageUrl || '/images/no-image.png',
    createdAt: post.createdAt,
    author: {
      id: post.author.id,
      username: post.author.username,
      avatarUrl: post.author.avatarUrl || '/images/default-avatar.png',
      name: post.author.name,
    },
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
              alt={post.caption || 'User post'}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-110'
            />

            {/* Overlay hover */}
            <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
              <div className='flex items-center gap-4 text-white'>
                <div className='flex items-center gap-1'>
                  <Love
                    filled
                    fillColor='white'
                    className='h-5 w-5 fill-white'
                  />
                  <span className='text-sm font-semibold'>
                    {post.likeCount}
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <MessageCircle className='h-5 w-5 fill-white' />
                  <span className='text-sm font-semibold'>
                    {post.commentCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

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

      {selectedPost && (
        <PostCommentsDialog
          post={normalizePost(selectedPost)}
          username={username}
          userPostsLimit={12} // ✅ penting agar key cocok
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
};

export default Gallery;

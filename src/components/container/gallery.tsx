'use client';

import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { PostCommentsDialog } from '@/components/container/postCommentsDialog/PostCommentsDialog';

import { useSavedPosts } from '@/hooks/saves/useSavedPosts';
import { useInfiniteUserPosts } from '@/hooks/users/useInfiniteUserPosts';
import { Post } from '@/types/get-user-post-type';

import Love from '../icons/love';

const Gallery = ({ username }: { username: string }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteUserPosts(username, 12);
  const { toggle, isSaved } = useSavedPosts();

  const { ref, inView } = useInView({ threshold: 1 });

  // ✅ state lokal untuk posts agar bisa sinkron like & saved
  const [postsState, setPostsState] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  // ✅ sinkron state lokal saat fetch data baru
  useEffect(() => {
    if (data) {
      const fetched = data.pages.flatMap((page) => page.data.posts) ?? [];
      setPostsState(fetched);
    }
  }, [data]);

  // ✅ infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ✅ callback untuk sinkron like
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

  // ✅ callback untuk sinkron save
  const handleUpdateSave = (postId: number) => {
    toggle(postId); // update Redux store

    setPostsState((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSaved: !isSaved(p.id) } : p))
    );
  };

  if (status === 'pending') return <p>Loading posts...</p>;
  if (status === 'error') return <p>Failed to load posts.</p>;
  if (postsState.length === 0)
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

  // 🔹 normalisasi post untuk dialog
  const normalizePost = (post: Post) => ({
    id: post.id,
    caption: post.caption,
    likedByMe: post.likedByMe,
    likeCount: post.likeCount,
    commentCount: post.commentCount ?? 0,
    imageUrl: post.imageUrl || '/images/no-image.png',
    createdAt: post.createdAt,
    isSaved: post.isSaved ?? false, // ✅ tambahkan
    author: {
      id: post.author.id,
      username: post.author.username,
      avatarUrl: post.author.avatarUrl || '/images/default-avatar.png',
      name: post.author.name,
    },
  });

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
              alt={post.caption || 'User post'}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-110'
            />

            {/* Overlay hover */}
            <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
              <div className='flex items-center gap-4 text-white'>
                <div className='flex items-center gap-1'>
                  <Love
                    filled={post.likedByMe}
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

        {hasNextPage && (
          <div
            ref={ref}
            className='col-span-3 flex items-center justify-center py-4'
          >
            {isFetchingNextPage && <p>Loading more...</p>}
          </div>
        )}
      </div>

      {/* Dialog */}
      {selectedPost && (
        <PostCommentsDialog
          post={normalizePost(selectedPost)}
          username={username}
          onClose={() => setSelectedPostId(null)}
          onLikeChange={handleUpdatePost} // ✅ sinkron like
          onSaveChange={handleUpdateSave} // ✅ sinkron save
        />
      )}
    </>
  );
};

export default Gallery;

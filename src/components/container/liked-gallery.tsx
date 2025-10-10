'use client';

import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

import { useSavedPosts } from '@/hooks/saves/useSavedPosts';
import { useInfiniteUserLikes } from '@/hooks/users/useInfiniteUserLikes';
import { toFeedItem } from '@/lib/adapter';
import { useIsMobile } from '@/lib/use-is-mobile';
import type { FeedItem } from '@/types/feed-type';

import Love from '../icons/love';
import { PostCommentsDialog } from './postCommentsDialog/PostCommentsDialog';

const LikedGallery = ({ username }: { username: string }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteUserLikes(username, 12);
  const { toggle } = useSavedPosts();
  const isMobile = useIsMobile();
  const router = useRouter();
  const { ref, inView } = useInView({ threshold: 1 });
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const [postsState, setPostsState] = useState<FeedItem[]>([]);

  useEffect(() => {
    if (data) {
      const fetched = data.pages.flatMap((page) => page.data.posts) ?? [];
      const adapted = fetched.map(toFeedItem);
      setPostsState(adapted);
    }
  }, [data]);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Callback untuk update like
  const handleUpdateLike = useCallback(
    (postId: number, liked: boolean, likeCount: number) => {
      setPostsState((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likedByMe: liked, likeCount } : p
        )
      );
    },
    []
  );

  // Callback untuk update save
  const handleUpdateSave = useCallback(
    (postId: number, saved: boolean) => {
      // update Redux global
      toggle(postId);

      // update state lokal
      setPostsState((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isSaved: saved } : p))
      );
    },
    [toggle]
  );

  if (status === 'pending') return <p>Loading liked posts...</p>;
  if (status === 'error') return <p>Failed to load liked posts.</p>;
  if (postsState.length === 0)
    return (
      <p className='mt-6 text-center text-neutral-400'>No liked posts yet</p>
    );

  const selectedPost = postsState.find((p) => p.id === selectedPostId);

  return (
    <>
      <div className='mt-6 grid grid-cols-3 gap-2'>
        {postsState.map((post) => (
          <div
            key={post.id}
            className='group relative aspect-square cursor-pointer overflow-hidden rounded-md'
            onClick={() => {
              if (isMobile) {
                router.push(`/post/${post.id}`); // 📱 Mobile → navigate
              } else {
                setSelectedPostId(post.id); // 💻 Desktop → open dialog
              }
            }}
          >
            <Image
              src={post.imageUrl || '/images/no-image.png'}
              alt={post.caption || 'Liked post'}
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

      {/* Post Comments Dialog */}
      {!isMobile && selectedPost && (
        <PostCommentsDialog
          post={selectedPost}
          username={selectedPost.author.username}
          userPostsLimit={12}
          onClose={() => setSelectedPostId(null)}
          onLikeChange={handleUpdateLike}
          onSaveChange={handleUpdateSave}
        />
      )}
    </>
  );
};

export default LikedGallery;

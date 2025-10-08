'use client';

import { useState, useEffect } from 'react';

import { useSavedPosts } from '@/hooks/saves/useSavedPosts';
import type { FeedItem } from '@/types/feed-type';

import { PostActions } from './PostActions';
import { PostCaption } from './PostCaption';
import { PostHeader } from './PostHeader';
import { PostImage } from './PostImage';
import { PostCommentsDialog } from '../postCommentsDialog/PostCommentsDialog';

interface PostCardProps {
  item: FeedItem;
}

const PostCard: React.FC<PostCardProps> = ({ item }) => {
  const { isSaved } = useSavedPosts(); // Redux global saved state

  // ✅ State lokal untuk like saja
  const [likedByMe, setLikedByMe] = useState(item.likedByMe);
  const [likeCount, setLikeCount] = useState(item.likeCount);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // ✅ Sync jika item dari parent berubah (misal feed query update)
  useEffect(() => {
    setLikedByMe(item.likedByMe);
    setLikeCount(item.likeCount);
  }, [item.likedByMe, item.likeCount]);

  return (
    <div className='flex flex-col gap-3 py-6'>
      <PostHeader author={item.author} createdAt={item.createdAt} />
      <PostImage src={item.imageUrl} alt={item.caption} />

      <PostActions
        postId={item.id}
        likedByMe={likedByMe}
        likeCount={likeCount}
        commentCount={item.commentCount}
        onCommentClick={() => setIsDialogOpen(true)}
        onLikeChange={(postId, liked, count) => {
          if (postId === item.id) {
            setLikedByMe(liked);
            setLikeCount(count);
          }
        }}
      />

      <PostCaption authorName={item.author.name} caption={item.caption} />

      {isDialogOpen && (
        <PostCommentsDialog
          post={{
            ...item,
            likedByMe,
            likeCount,
            isSaved: isSaved(item.id), // ✅ pakai Redux
          }}
          onClose={() => setIsDialogOpen(false)}
          username={item.author.username}
          onLikeChange={(postId, liked, count) => {
            if (postId === item.id) {
              setLikedByMe(liked);
              setLikeCount(count);
            }
          }}
        />
      )}
    </div>
  );
};

export default PostCard;

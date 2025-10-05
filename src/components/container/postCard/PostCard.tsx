'use client';

import { useState } from 'react';

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
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const openPostCommentsDialog = (postId: number) => {
    setSelectedPostId(postId);
  };

  return (
    <div className='flex flex-col gap-3 py-6'>
      <PostHeader author={item.author} createdAt={item.createdAt} />
      <PostImage src={item.imageUrl} alt={item.caption} />
      <PostActions
        postId={item.id}
        likedByMe={item.likedByMe}
        likeCount={item.likeCount}
        commentCount={item.commentCount}
        onCommentClick={() => openPostCommentsDialog(item.id)}
      />
      <PostCaption authorName={item.author.name} caption={item.caption} />
      {selectedPostId && (
        <PostCommentsDialog
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </div>
  );
};

export default PostCard;

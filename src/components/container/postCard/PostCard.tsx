'use client';

import type { FeedItem } from '@/types/feed-type';

import { PostActions } from './PostActions';
import { PostCaption } from './PostCaption';
import { PostHeader } from './PostHeader';
import { PostImage } from './PostImage';

interface PostCardProps {
  item: FeedItem;
}

const PostCard: React.FC<PostCardProps> = ({ item }) => {
  return (
    <div className='flex flex-col gap-3 py-6'>
      <PostHeader author={item.author} createdAt={item.createdAt} />
      <PostImage src={item.imageUrl} alt={item.caption} />
      <PostActions
        postId={item.id}
        initialLiked={item.likedByMe}
        initialLikeCount={item.likeCount}
        commentCount={item.commentCount}
      />
      <PostCaption authorName={item.author.name} caption={item.caption} />
    </div>
  );
};

export default PostCard;

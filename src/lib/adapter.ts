import type { FeedItem } from '@/types/feed-type';
import { Post } from '@/types/get-user-likes-type';

export function toFeedItem(post: Post): FeedItem {
  return {
    id: post.id,
    imageUrl: post.imageUrl ?? '/images/no-image.png',
    caption: post.caption,
    createdAt: post.createdAt,
    likedByMe: post.likedByMe,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    author: {
      id: post.author.id,
      username: post.author.username,
      name: post.author.name,
      avatarUrl: post.author.avatarUrl ?? '/images/default-avatar.png',
    },
  };
}

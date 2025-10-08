// lib/updateCacheUtils.ts
import { InfiniteData, QueryClient } from '@tanstack/react-query';

import type { FeedItem, GetFeedSuccessResponse } from '@/types/feed-type';
import type { GetPostByIdSuccessResponse } from '@/types/get-post-detail-type';
import type { GetSavedPostsSuccessResponse } from '@/types/get-saved-post';
import type { UserLikesSuccessResponse } from '@/types/get-user-likes-type';
import type { UserPostsSuccessResponse } from '@/types/get-user-post-type';

type FeedInfinite = InfiniteData<GetFeedSuccessResponse>;
type UserPostsInfinite = InfiniteData<UserPostsSuccessResponse>;
type SavedPostsInfinite = InfiniteData<{
  data: {
    posts: GetPostByIdSuccessResponse['data'][];
    pagination: GetSavedPostsSuccessResponse['data']['pagination'];
  };
}>;
type UserLikesInfinite = InfiniteData<UserLikesSuccessResponse>;

// Update single post
export const updateSinglePost = (
  queryClient: QueryClient,
  postId: number,
  updater: (prev: GetPostByIdSuccessResponse) => GetPostByIdSuccessResponse
) => {
  queryClient.setQueryData<GetPostByIdSuccessResponse>(
    ['post', postId],
    (prev) => (prev ? updater(prev) : prev)
  );
};

// Update feed
export const updateFeedCache = (
  queryClient: QueryClient,
  postId: number,
  updater: (item: FeedItem) => FeedItem
) => {
  queryClient.setQueryData<FeedInfinite>(['feed'], (old) => {
    if (!old) return old;

    const newPages = old.pages.map((page) => {
      const newItems = page.data.items.map((item) =>
        item.id === postId ? updater(item) : item
      );
      return { ...page, data: { ...page.data, items: newItems } };
    });

    return { ...old, pages: newPages };
  });
};

export const updateUserPostsCache = (
  queryClient: QueryClient,
  key: readonly [string, string, number], // <-- readonly
  postId: number,
  updater: (
    post: UserPostsSuccessResponse['data']['posts'][number]
  ) => UserPostsSuccessResponse['data']['posts'][number]
) => {
  queryClient.setQueryData<UserPostsInfinite>(key, (old) =>
    old
      ? {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              posts: page.data.posts.map((p) =>
                p.id === postId ? updater(p) : p
              ),
            },
          })),
        }
      : old
  );
};

// Update user likes
export const updateUserLikesCache = (
  queryClient: QueryClient,
  key: readonly [string, string, number], // <-- readonly
  postId: number,
  updater: (
    post: UserLikesSuccessResponse['data']['posts'][number]
  ) => UserLikesSuccessResponse['data']['posts'][number]
) => {
  queryClient.setQueryData<UserLikesInfinite>(key, (old) =>
    old
      ? {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              posts: page.data.posts.map((p) =>
                p.id === postId ? updater(p) : p
              ),
            },
          })),
        }
      : old
  );
};

// Update saved posts
export const updateSavedPostsCache = (
  queryClient: QueryClient,
  key: readonly [string, Record<string, any> | undefined],
  postId: number,
  updater: (
    post: GetPostByIdSuccessResponse['data']
  ) => GetPostByIdSuccessResponse['data']
) => {
  queryClient.setQueryData<SavedPostsInfinite>(key, (old) =>
    old
      ? {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              posts: page.data.posts.map((p) =>
                p.id === postId ? updater(p) : p
              ),
            },
          })),
        }
      : old
  );
};

// Update user likes

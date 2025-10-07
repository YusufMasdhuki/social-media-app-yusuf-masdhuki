import { InfiniteData, QueryClient } from '@tanstack/react-query';

import type { FeedItem, GetFeedSuccessResponse } from '@/types/feed-type';
import type { GetPostByIdSuccessResponse } from '@/types/get-post-detail-type';
import type { GetSavedPostsSuccessResponse } from '@/types/get-saved-post';
import type { UserPostsSuccessResponse } from '@/types/get-user-post-type';

type FeedInfinite = InfiniteData<GetFeedSuccessResponse>;
type UserPostsInfinite = InfiniteData<UserPostsSuccessResponse>;

/**
 * Karena pada SavedGallery kamu ubah posts-nya menjadi array of `PostDetail` (dari GetPostById),
 * maka kita representasikan seperti ini:
 */
type SavedPostsInfinite = InfiniteData<{
  data: {
    posts: GetPostByIdSuccessResponse['data'][];
    pagination: GetSavedPostsSuccessResponse['data']['pagination'];
  };
}>;

// 🧠 Update single post detail
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

// 🧠 Update feed cache (list utama)
export const updateFeedCache = (
  queryClient: QueryClient,
  postId: number,
  updater: (item: FeedItem) => FeedItem
) => {
  queryClient.setQueryData<FeedInfinite>(['feed'], (old) =>
    old
      ? {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              items: page.data.items.map((item) =>
                item.id === postId ? updater(item) : item
              ),
            },
          })),
        }
      : old
  );
};

// 🧠 Update user posts cache (profile)
export const updateUserPostsCache = (
  queryClient: QueryClient,
  key: [string, string, number],
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

// 🧠 Update saved posts cache
export const updateSavedPostsCache = (
  queryClient: QueryClient,
  key: [string, Record<string, any> | undefined],
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

import {
  useQueryClient,
  useMutation,
  InfiniteData,
} from '@tanstack/react-query';

import { likePost, unlikePost } from '@/services/likes-service';
import type { GetFeedSuccessResponse, FeedItem } from '@/types/feed-type';
import type { GetPostByIdSuccessResponse } from '@/types/get-post-detail-type';
import { UserPostsSuccessResponse } from '@/types/get-user-post-type';
import type {
  LikePostSuccessResponse,
  LikePostErrorResponse,
  UnlikePostSuccessResponse,
  UnlikePostErrorResponse,
} from '@/types/post-like-type';

type ToggleLikeSuccess = LikePostSuccessResponse | UnlikePostSuccessResponse;
type ToggleLikeError = LikePostErrorResponse | UnlikePostErrorResponse;
type FeedInfiniteData = InfiniteData<GetFeedSuccessResponse>;

export const useToggleLikePost = (
  postId: number,
  username?: string,
  userPostsLimit?: number
) => {
  const queryClient = useQueryClient();

  // key untuk infinite user posts
  const userPostsKey = username
    ? ['userPosts', username, userPostsLimit ?? 20]
    : null;

  return useMutation<
    ToggleLikeSuccess,
    ToggleLikeError,
    { like: boolean },
    {
      prevPost?: GetPostByIdSuccessResponse;
      prevFeed?: FeedInfiniteData;
      prevUserPosts?: InfiniteData<UserPostsSuccessResponse>;
    }
  >({
    mutationFn: ({ like }) =>
      like ? likePost({ id: postId }) : unlikePost(postId),

    onMutate: async ({ like }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['post', postId] }),
        queryClient.cancelQueries({ queryKey: ['feed'] }),
        userPostsKey
          ? queryClient.cancelQueries({ queryKey: userPostsKey })
          : Promise.resolve(),
      ]);

      const prevPost = queryClient.getQueryData<GetPostByIdSuccessResponse>([
        'post',
        postId,
      ]);
      const prevFeed = queryClient.getQueryData<FeedInfiniteData>(['feed']);
      const prevUserPosts = userPostsKey
        ? queryClient.getQueryData<InfiniteData<UserPostsSuccessResponse>>(
            userPostsKey
          )
        : undefined;

      // Optimistic update single post
      if (prevPost) {
        queryClient.setQueryData<GetPostByIdSuccessResponse>(['post', postId], {
          ...prevPost,
          data: {
            ...prevPost.data,
            likedByMe: like,
            likeCount: like
              ? (prevPost.data?.likeCount ?? 0) + 1
              : (prevPost.data?.likeCount ?? 0) - 1,
          },
        });
      }

      // Optimistic update feed
      if (prevFeed) {
        queryClient.setQueryData<FeedInfiniteData>(['feed'], (old) =>
          old
            ? {
                ...old,
                pages: old.pages.map((page) => ({
                  ...page,
                  data: {
                    ...page.data,
                    items: page.data.items.map((item: FeedItem) =>
                      item.id === postId
                        ? {
                            ...item,
                            likedByMe: like,
                            likeCount: like
                              ? item.likeCount + 1
                              : item.likeCount - 1,
                          }
                        : item
                    ),
                  },
                })),
              }
            : old
        );
      }

      // Optimistic update infinite user posts
      if (prevUserPosts) {
        queryClient.setQueryData<InfiniteData<UserPostsSuccessResponse>>(
          userPostsKey!,
          (old) =>
            old
              ? {
                  ...old,
                  pages: old.pages.map((page) => ({
                    ...page,
                    data: {
                      ...page.data,
                      posts: page.data.posts.map((p) =>
                        p.id === postId
                          ? {
                              ...p,
                              likedByMe: like,
                              likeCount: like
                                ? p.likeCount + 1
                                : p.likeCount - 1,
                            }
                          : p
                      ),
                    },
                  })),
                }
              : old
        );
      }

      return { prevPost, prevFeed, prevUserPosts };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevPost)
        queryClient.setQueryData(['post', postId], ctx.prevPost);
      if (ctx?.prevFeed) queryClient.setQueryData(['feed'], ctx.prevFeed);
      if (ctx?.prevUserPosts && userPostsKey)
        queryClient.setQueryData(userPostsKey, ctx.prevUserPosts);
    },

    onSuccess: (data) => {
      // Update single post
      queryClient.setQueryData<GetPostByIdSuccessResponse>(
        ['post', postId],
        (old) =>
          old
            ? {
                ...old,
                data: {
                  ...old.data,
                  likedByMe: data.data.liked,
                  likeCount: data.data.likeCount,
                },
              }
            : old
      );

      // Update feed
      queryClient.setQueryData<FeedInfiniteData>(['feed'], (old) =>
        old
          ? {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                data: {
                  ...page.data,
                  items: page.data.items.map((item: FeedItem) =>
                    item.id === postId
                      ? {
                          ...item,
                          likedByMe: data.data.liked,
                          likeCount: data.data.likeCount,
                        }
                      : item
                  ),
                },
              })),
            }
          : old
      );

      // Update infinite user posts
      if (userPostsKey) {
        queryClient.setQueryData<InfiniteData<UserPostsSuccessResponse>>(
          userPostsKey,
          (old) =>
            old
              ? {
                  ...old,
                  pages: old.pages.map((page) => ({
                    ...page,
                    data: {
                      ...page.data,
                      posts: page.data.posts.map((p) =>
                        p.id === postId
                          ? {
                              ...p,
                              likedByMe: data.data.liked,
                              likeCount: data.data.likeCount,
                            }
                          : p
                      ),
                    },
                  })),
                }
              : old
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['postLikes', postId] });
      queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
      if (userPostsKey)
        queryClient.invalidateQueries({ queryKey: userPostsKey });
    },
  });
};

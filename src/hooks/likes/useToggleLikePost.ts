import {
  useQueryClient,
  useMutation,
  InfiniteData,
} from '@tanstack/react-query';

import { likePost, unlikePost } from '@/services/likes-service';
import type { GetFeedSuccessResponse, FeedItem } from '@/types/feed-type';
import type { GetPostByIdSuccessResponse } from '@/types/get-post-detail-type';
import type {
  LikePostSuccessResponse,
  LikePostErrorResponse,
  UnlikePostSuccessResponse,
  UnlikePostErrorResponse,
} from '@/types/post-like-type';

type ToggleLikeSuccess = LikePostSuccessResponse | UnlikePostSuccessResponse;
type ToggleLikeError = LikePostErrorResponse | UnlikePostErrorResponse;

type FeedInfiniteData = InfiniteData<GetFeedSuccessResponse>;

export const useToggleLikePost = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    ToggleLikeSuccess,
    ToggleLikeError,
    { like: boolean }, // payload harus kasih state terbaru
    { prevPost?: GetPostByIdSuccessResponse; prevFeed?: FeedInfiniteData }
  >({
    mutationFn: ({ like }) =>
      like ? likePost({ id: postId }) : unlikePost(postId),

    onMutate: async ({ like }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['post', postId] }),
        queryClient.cancelQueries({ queryKey: ['feed'] }),
      ]);

      const prevPost = queryClient.getQueryData<GetPostByIdSuccessResponse>([
        'post',
        postId,
      ]);
      const prevFeed = queryClient.getQueryData<FeedInfiniteData>(['feed']);

      // optimistic update post detail
      if (prevPost) {
        queryClient.setQueryData<GetPostByIdSuccessResponse>(['post', postId], {
          ...prevPost,
          data: {
            ...prevPost.data,
            likedByMe: like,
            likeCount: like
              ? prevPost.data.likeCount + 1
              : prevPost.data.likeCount - 1,
          },
        });
      }

      // optimistic update feed
      queryClient.setQueriesData<FeedInfiniteData>(
        { queryKey: ['feed'] },
        (old) => {
          if (!old) return old;
          return {
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
          };
        }
      );

      return { prevPost, prevFeed };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevPost)
        queryClient.setQueryData(['post', postId], ctx.prevPost);
      if (ctx?.prevFeed) queryClient.setQueryData(['feed'], ctx.prevFeed);
    },

    onSuccess: (data) => {
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

      queryClient.setQueriesData<FeedInfiniteData>(
        { queryKey: ['feed'] },
        (old) => {
          if (!old) return old;
          return {
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
          };
        }
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['postLikes', postId] });
    },
  });
};

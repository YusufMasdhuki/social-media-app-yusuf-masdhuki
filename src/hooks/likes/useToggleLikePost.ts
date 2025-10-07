import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  updateFeedCache,
  updateSavedPostsCache,
  updateSinglePost,
  updateUserPostsCache,
} from '@/lib/updateCacheUtils';
import { likePost, unlikePost } from '@/services/likes-service';
import type {
  LikePostErrorResponse,
  LikePostSuccessResponse,
  UnlikePostErrorResponse,
  UnlikePostSuccessResponse,
} from '@/types/post-like-type';

type ToggleLikeSuccess = LikePostSuccessResponse | UnlikePostSuccessResponse;
type ToggleLikeError = LikePostErrorResponse | UnlikePostErrorResponse;

export const useToggleLikePost = (
  postId: number,
  username?: string,
  userPostsLimit = 20,
  savedParams?: Record<string, any>
) => {
  const queryClient = useQueryClient();
  const userPostsKey: [string, string, number] | null = username
    ? ['userPosts', username, userPostsLimit]
    : null;

  const savedPostsKey: [string, Record<string, any> | undefined] = [
    'savedPosts',
    savedParams,
  ];

  return useMutation<ToggleLikeSuccess, ToggleLikeError, { like: boolean }>({
    mutationFn: ({ like }) =>
      like ? likePost({ id: postId }) : unlikePost(postId),

    onMutate: async ({ like }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['post', postId] }),
        queryClient.cancelQueries({ queryKey: ['feed'] }),
        queryClient.cancelQueries({ queryKey: savedPostsKey }),
        userPostsKey
          ? queryClient.cancelQueries({ queryKey: userPostsKey })
          : Promise.resolve(),
      ]);

      // 🧠 Optimistic update
      updateSinglePost(queryClient, postId, (prev) => ({
        ...prev,
        data: {
          ...prev.data,
          likedByMe: like,
          likeCount: like ? prev.data.likeCount + 1 : prev.data.likeCount - 1,
        },
      }));

      updateFeedCache(queryClient, postId, (item) => ({
        ...item,
        likedByMe: like,
        likeCount: like ? item.likeCount + 1 : item.likeCount - 1,
      }));

      if (userPostsKey) {
        updateUserPostsCache(queryClient, userPostsKey, postId, (p) => ({
          ...p,
          likedByMe: like,
          likeCount: like ? p.likeCount + 1 : p.likeCount - 1,
        }));
      }

      updateSavedPostsCache(queryClient, savedPostsKey, postId, (p) => ({
        ...p,
        likedByMe: like,
        likeCount: like ? p.likeCount + 1 : p.likeCount - 1,
      }));
    },

    onSuccess: (data) => {
      updateSinglePost(queryClient, postId, (prev) => ({
        ...prev,
        data: {
          ...prev.data,
          likedByMe: data.data.liked,
          likeCount: data.data.likeCount,
        },
      }));

      updateFeedCache(queryClient, postId, (item) => ({
        ...item,
        likedByMe: data.data.liked,
        likeCount: data.data.likeCount,
      }));

      if (userPostsKey) {
        updateUserPostsCache(queryClient, userPostsKey, postId, (p) => ({
          ...p,
          likedByMe: data.data.liked,
          likeCount: data.data.likeCount,
        }));
      }

      updateSavedPostsCache(queryClient, savedPostsKey, postId, (p) => ({
        ...p,
        likedByMe: data.data.liked,
        likeCount: data.data.likeCount,
      }));
    },

    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: savedPostsKey });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['postLikes', postId] });
      queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
      queryClient.invalidateQueries({ queryKey: savedPostsKey });
    },
  });
};

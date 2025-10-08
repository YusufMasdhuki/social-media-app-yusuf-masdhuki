import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  updateFeedCache,
  updateSavedPostsCache,
  updateSinglePost,
  updateUserLikesCache,
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

  const userPostsKey = username
    ? (['userPosts', username, userPostsLimit] as const)
    : null;
  const userLikesKey = username
    ? (['userLikes', username, userPostsLimit] as const)
    : null;
  const savedPostsKey = ['savedPosts', savedParams] as const;

  const updater = (like: boolean, item: any, serverCount?: number) => ({
    ...item,
    likedByMe: like,
    likeCount: serverCount ?? (like ? item.likeCount + 1 : item.likeCount - 1),
  });

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
        userLikesKey
          ? queryClient.cancelQueries({ queryKey: userLikesKey })
          : Promise.resolve(),
      ]);

      // Optimistic updates
      updateSinglePost(queryClient, postId, (prev) => ({
        ...prev,
        data: updater(like, prev.data),
      }));
      updateFeedCache(queryClient, postId, (item) => updater(like, item));
      if (userPostsKey)
        updateUserPostsCache(queryClient, userPostsKey, postId, (item) =>
          updater(like, item)
        );
      updateSavedPostsCache(queryClient, savedPostsKey, postId, (item) =>
        updater(like, item)
      );

      if (userLikesKey) {
        if (!like) {
          queryClient.setQueryData(userLikesKey, (old: any) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                data: {
                  ...page.data,
                  posts: page.data.posts.filter((p: any) => p.id !== postId),
                },
              })),
            };
          });
        } else {
          updateUserLikesCache(queryClient, userLikesKey, postId, (item) =>
            updater(like, item)
          );
        }
      }
    },

    onSuccess: (data) => {
      const like = data.data.liked;
      const count = data.data.likeCount;
      const serverUpdater = (item: any) => updater(like, item, count);

      updateSinglePost(queryClient, postId, (prev) => ({
        ...prev,
        data: serverUpdater(prev.data),
      }));
      updateFeedCache(queryClient, postId, serverUpdater);
      if (userPostsKey)
        updateUserPostsCache(queryClient, userPostsKey, postId, serverUpdater);
      updateSavedPostsCache(queryClient, savedPostsKey, postId, serverUpdater);
      if (userLikesKey && like)
        updateUserLikesCache(queryClient, userLikesKey, postId, serverUpdater);

      // ✅ invalidate me & user detail biar sinkron
      queryClient.invalidateQueries({ queryKey: ['me'] });
      if (username)
        queryClient.invalidateQueries({ queryKey: ['userDetail', username] });
    },

    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: savedPostsKey });
      if (userPostsKey)
        queryClient.invalidateQueries({ queryKey: userPostsKey });
      if (userLikesKey)
        queryClient.invalidateQueries({ queryKey: userLikesKey });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['postLikes', postId] });
      queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: savedPostsKey });
      if (userPostsKey)
        queryClient.invalidateQueries({ queryKey: userPostsKey });
      if (userLikesKey)
        queryClient.invalidateQueries({ queryKey: userLikesKey });

      // ✅ invalidate di akhir juga untuk jaga-jaga
      queryClient.invalidateQueries({ queryKey: ['me'] });
      if (username)
        queryClient.invalidateQueries({ queryKey: ['userDetail', username] });
    },
  });
};

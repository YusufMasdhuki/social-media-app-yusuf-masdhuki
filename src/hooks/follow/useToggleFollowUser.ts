import { useMutation, useQueryClient } from '@tanstack/react-query';

import { followUser, unfollowUser } from '@/services/follow-service';
import type {
  FollowUserErrorResponse,
  FollowUserSuccessResponse,
  UnfollowUserErrorResponse,
  UnfollowUserSuccessResponse,
} from '@/types/follow-user-type';
import type { UserDetailSuccessResponse } from '@/types/user-detail-type';

type ToggleFollowSuccess =
  | FollowUserSuccessResponse
  | UnfollowUserSuccessResponse;

type ToggleFollowError = FollowUserErrorResponse | UnfollowUserErrorResponse;

export const useToggleFollowUser = (username: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    ToggleFollowSuccess,
    ToggleFollowError,
    { follow: boolean }, // payload wajib menyebut status baru
    { prevUser?: UserDetailSuccessResponse }
  >({
    mutationFn: ({ follow }) =>
      follow ? followUser({ username }) : unfollowUser({ username }),

    onMutate: async ({ follow }) => {
      await queryClient.cancelQueries({ queryKey: ['userProfile', username] });

      const prevUser = queryClient.getQueryData<UserDetailSuccessResponse>([
        'userProfile',
        username,
      ]);

      // optimistic update
      if (prevUser) {
        queryClient.setQueryData<UserDetailSuccessResponse>(
          ['userProfile', username],
          {
            ...prevUser,
            data: {
              ...prevUser.data,
              isFollowing: follow,
              counts: {
                ...prevUser.data.counts,
                followers: follow
                  ? prevUser.data.counts.followers + 1
                  : Math.max(prevUser.data.counts.followers - 1, 0),
              },
            },
          }
        );
      }

      return { prevUser };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevUser)
        queryClient.setQueryData(['userProfile', username], ctx.prevUser);
    },

    onSuccess: (data) => {
      queryClient.setQueryData<UserDetailSuccessResponse>(
        ['userProfile', username],
        (old) =>
          old
            ? {
                ...old,
                data: {
                  ...old.data,
                  isFollowing: data.data.following,
                  counts: {
                    ...old.data.counts,
                    followers: data.data.following
                      ? old.data.counts.followers + 1
                      : Math.max(old.data.counts.followers - 1, 0),
                  },
                },
              }
            : old
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', username] });
      queryClient.invalidateQueries({ queryKey: ['postLikes'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};

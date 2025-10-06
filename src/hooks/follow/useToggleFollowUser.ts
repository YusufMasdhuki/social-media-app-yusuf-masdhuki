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
    { follow: boolean },
    { prevUser?: UserDetailSuccessResponse }
  >({
    mutationFn: ({ follow }) =>
      follow ? followUser({ username }) : unfollowUser({ username }),

    onMutate: async ({ follow }) => {
      await queryClient.cancelQueries({ queryKey: ['userDetail', username] });

      const prevUser = queryClient.getQueryData<UserDetailSuccessResponse>([
        'userDetail',
        username,
      ]);

      // ✅ Optimistic update
      if (prevUser) {
        queryClient.setQueryData<UserDetailSuccessResponse>(
          ['userDetail', username],
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
        queryClient.setQueryData(['userDetail', username], ctx.prevUser);
    },

    onSuccess: (data) => {
      queryClient.setQueryData<UserDetailSuccessResponse>(
        ['userDetail', username],
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
      // ✅ Sinkronkan ulang
      queryClient.invalidateQueries({ queryKey: ['userDetail', username] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['postLikes'] });
      queryClient.invalidateQueries({ queryKey: ['postComments'] });
    },
  });
};
